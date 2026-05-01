"""
Orchestrator — coordinates the 7-agent pipeline.

Pause/resume aware: when an agent flips ``run.status`` to
``awaiting_input``, ``run()`` returns immediately without marking the
run completed. A subsequent call (after the user answers) skips any
agents already in a terminal state and resumes where we paused.
"""
from __future__ import annotations

import asyncio
import importlib
from typing import Any

from agents.base_agent import BaseAgent
from core.logger import event
from core.state_manager import AgentStatus, RunState, RunStatus, StateManager

AGENT_IMPORT_PATHS: dict[str, tuple[str, str]] = {
    "intake": ("agents.intake_agent", "IntakeAgent"),
    "architect": ("agents.architect_agent", "ArchitectAgent"),
    "planner": ("agents.planner_agent", "PlannerAgent"),
    "qa": ("agents.qa_agent", "QAAgent"),
    "coder": ("agents.coder_agent", "CoderAgent"),
    "validator": ("agents.validator_agent", "ValidatorAgent"),
    "recovery": ("agents.recovery_agent", "RecoveryAgent"),
}

TERMINAL_AGENT_STATES = {AgentStatus.success, AgentStatus.skipped}

# Orchestrator per-step decision signals.
_CONTINUE = "continue"
_PAUSE = "pause"
_STOP = "stop"


class Orchestrator:
    """High-level controller for a framework run."""

    def __init__(self, state: StateManager, config: dict[str, Any] | None = None) -> None:
        self.state = state
        self.config: dict[str, Any] = config or {}
        self.pipeline: list[str] = list(AGENT_IMPORT_PATHS.keys())
        self._agent_cache: dict[str, BaseAgent] = {}

    # ------------- metadata -------------
    def describe_pipeline(self) -> list[dict[str, str]]:
        return [
            {"name": "intake", "label": "Intake", "desc": "Clarifies spec & produces JSON"},
            {"name": "architect", "label": "Architect", "desc": "Folder / API / DB design"},
            {"name": "planner", "label": "Planner", "desc": "Atomic testable tasks"},
            {"name": "qa", "label": "QA (TDD)", "desc": "Failing pytest cases first"},
            {"name": "coder", "label": "Coder", "desc": "Writes code to pass tests"},
            {"name": "validator", "label": "Validator", "desc": "Runs pytest + lint"},
            {"name": "recovery", "label": "Recovery", "desc": "Heals failures, retries"},
        ]

    # ------------- config helpers -------------
    def _retry_policy(self) -> dict[str, int]:
        r = self.config.get("retry", {})
        return {
            "max_attempts": int(r.get("max_attempts", 3)),
            "backoff_seconds": int(r.get("backoff_seconds", 2)),
            "hard_fail_after": int(r.get("hard_fail_after", 5)),
        }

    # ------------- agent factory -------------
    def _get_agent(self, name: str) -> BaseAgent:
        if name in self._agent_cache:
            return self._agent_cache[name]
        module_name, cls_name = AGENT_IMPORT_PATHS[name]
        module = importlib.import_module(module_name)
        cls = getattr(module, cls_name)
        agent = cls(config=self.config, state=self.state)
        self._agent_cache[name] = agent
        return agent

    # ------------- main entrypoint -------------
    async def run(self, run_id: str) -> RunState:
        self._require_run(run_id)  # validate exists; raises if not
        self.state.update_run(run_id, status=RunStatus.running)
        event(run_id, "info", "orchestrator",
              f"pipeline start · {len(self.pipeline)} agents",
              pipeline=self.pipeline)

        total_retries = 0
        hard_fail_after = self._retry_policy()["hard_fail_after"]

        for agent_name in self.pipeline:
            decision, total_retries = await self._step(
                run_id, agent_name, total_retries, hard_fail_after
            )
            if decision == _PAUSE:
                return self._require_run(run_id)
            if decision == _STOP:
                break

        return self._finalize(run_id, total_retries)

    # ------------- per-step dispatcher -------------
    async def _step(
        self,
        run_id: str,
        agent_name: str,
        total_retries: int,
        hard_fail_after: int,
    ) -> tuple[str, int]:
        """Run one agent and decide what to do next."""
        run = self._require_run(run_id)
        if run.agents[agent_name].status in TERMINAL_AGENT_STATES:
            event(run_id, "info", "orchestrator",
                  f"skip {agent_name} · already {run.agents[agent_name].status.value}")
            return _CONTINUE, total_retries

        retries_used = await self._run_agent_step(run_id, agent_name)
        total_retries += retries_used
        run = self._require_run(run_id)

        if run.status == RunStatus.awaiting_input:
            event(run_id, "warn", "orchestrator",
                  f"pipeline paused — {agent_name} awaiting user input")
            return _PAUSE, total_retries
        if run.status == RunStatus.failed:
            return _STOP, total_retries
        if total_retries >= hard_fail_after:
            event(run_id, "error", "orchestrator",
                  f"hard_fail_after={hard_fail_after} retries exceeded — aborting",
                  total_retries=total_retries)
            self.state.update_run(run_id, status=RunStatus.failed)
            return _STOP, total_retries
        return _CONTINUE, total_retries

    # ------------- finalisation -------------
    def _finalize(self, run_id: str, total_retries: int) -> RunState:
        run = self.state.get(run_id)
        if run is not None and run.status == RunStatus.running:
            self.state.update_run(run_id, status=RunStatus.completed)
            event(run_id, "success", "orchestrator",
                  "pipeline complete", total_retries=total_retries)
        return self._require_run(run_id)

    def _require_run(self, run_id: str) -> RunState:
        run = self.state.get(run_id)
        if run is None:
            raise ValueError(f"unknown run_id={run_id}")
        return run

    # ------------- per-agent step with retry -------------
    async def _run_agent_step(self, run_id: str, agent_name: str) -> int:
        policy = self._retry_policy()
        max_attempts = policy["max_attempts"]
        backoff = policy["backoff_seconds"]

        self.state.mark_agent(run_id, agent_name, AgentStatus.running, attempts=0)

        for attempt in range(1, max_attempts + 1):
            try:
                agent = self._get_agent(agent_name)
                result = await agent.execute(run_id)
            except NotImplementedError:
                return self._mark_skipped(run_id, agent_name, attempt)
            except Exception as exc:  # noqa: BLE001
                if self._handle_failure(run_id, agent_name, attempt, max_attempts, exc):
                    return attempt
                await asyncio.sleep(backoff)
                continue
            return self._mark_success_or_waiting(run_id, agent_name, attempt, result)

        return max_attempts

    # ---- outcome helpers ----
    def _mark_skipped(self, run_id: str, agent_name: str, attempt: int) -> int:
        self.state.mark_agent(
            run_id, agent_name, AgentStatus.skipped,
            attempts=attempt,
            output_summary="dry-run · agent body arrives in a later phase",
        )
        event(run_id, "warn", agent_name, "skipped (NotImplementedError) — dry-run")
        return 0

    def _handle_failure(
        self,
        run_id: str,
        agent_name: str,
        attempt: int,
        max_attempts: int,
        exc: BaseException,
    ) -> bool:
        """Record the failure. Return True if retries are exhausted."""
        event(run_id, "error", agent_name,
              f"attempt {attempt}/{max_attempts} failed: {exc}",
              error=str(exc))
        self.state.mark_agent(run_id, agent_name, AgentStatus.error,
                              attempts=attempt, last_error=str(exc))
        if attempt >= max_attempts:
            event(run_id, "error", "orchestrator",
                  f"{agent_name} exhausted retries — marking run failed")
            self.state.update_run(run_id, status=RunStatus.failed)
            return True
        return False

    def _mark_success_or_waiting(
        self, run_id: str, agent_name: str, attempt: int, result: Any,
    ) -> int:
        summary = _extract_summary(result)
        is_awaiting = isinstance(result, dict) and result.get("mode") == "awaiting_input"
        if is_awaiting:
            # Keep agent in `running` shape — re-entry after the user answers
            # will run this exact step again with new context.
            self.state.mark_agent(run_id, agent_name, AgentStatus.running,
                                  attempts=attempt, output_summary=summary)
        else:
            self.state.mark_agent(run_id, agent_name, AgentStatus.success,
                                  attempts=attempt, output_summary=summary)
        return attempt - 1


def _extract_summary(result: Any) -> str:
    if isinstance(result, dict):
        return str(result.get("summary") or result.get("message") or "ok")
    return "ok"
