"""
State manager — single source of truth for a framework run.

Responsibilities
----------------
* Hold the in-memory RunState for every active/recent run
* Persist each run to logs/runs/<run_id>.json on every mutation
* Emit structured events via core.logger.event() so the dashboard and
  replay tools see every transition
* Restore runs from disk on boot (survives backend restarts)
"""
from __future__ import annotations

import json
import uuid
from datetime import datetime, timezone
from enum import Enum
from pathlib import Path
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from core.logger import LOGS_DIR, event


class AgentStatus(str, Enum):
    idle = "idle"
    running = "running"
    success = "success"
    error = "error"
    skipped = "skipped"


class RunStatus(str, Enum):
    pending = "pending"
    running = "running"
    awaiting_input = "awaiting_input"
    completed = "completed"
    failed = "failed"


class TaskStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    passed = "passed"
    failed = "failed"


AGENT_ORDER: list[str] = [
    "intake",
    "architect",
    "planner",
    "qa",
    "coder",
    "validator",
    "recovery",
]

RUNS_DIR: Path = LOGS_DIR / "runs"
RUNS_DIR.mkdir(parents=True, exist_ok=True)


# =================== Pydantic models ===================
class AgentState(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str
    status: AgentStatus = AgentStatus.idle
    started_at: str | None = None
    ended_at: str | None = None
    attempts: int = 0
    last_error: str | None = None
    output_summary: str | None = None


class Task(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    detail: str = ""
    status: TaskStatus = TaskStatus.pending
    depends_on: list[str] = Field(default_factory=list)
    files: list[str] = Field(default_factory=list)
    test_focus: str = ""
    test_file_path: str | None = None
    code_file_paths: list[str] = Field(default_factory=list)
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class RunState(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    spec_input: str = ""
    status: RunStatus = RunStatus.pending
    phase: str = "phase-2-orchestrator"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    specification: dict[str, Any] | None = None
    architecture: dict[str, Any] | None = None
    tasks: list[Task] = Field(default_factory=list)
    test_results: dict[str, Any] | None = None
    summary_report: dict[str, Any] | None = None
    output_dir: str | None = None
    agents: dict[str, AgentState] = Field(
        default_factory=lambda: {n: AgentState(name=n) for n in AGENT_ORDER}
    )


# =================== StateManager ===================
class StateManager:
    """In-memory store keyed by run_id, persisted to disk per mutation."""

    def __init__(self) -> None:
        self._runs: dict[str, RunState] = {}
        self._load_all_from_disk()

    # ---------- persistence ----------
    @staticmethod
    def _snapshot_path(run_id: str) -> Path:
        return RUNS_DIR / f"{run_id}.json"

    def save_snapshot(self, run_id: str) -> None:
        run = self._runs.get(run_id)
        if not run:
            return
        path = self._snapshot_path(run_id)
        with path.open("w", encoding="utf-8") as fh:
            json.dump(run.model_dump(mode="json"), fh, indent=2)

    def _load_all_from_disk(self) -> None:
        for path in sorted(RUNS_DIR.glob("*.json")):
            try:
                with path.open("r", encoding="utf-8") as fh:
                    data = json.load(fh)
                run = RunState(**data)
                self._runs[run.id] = run
            except Exception as exc:  # corrupt snapshot — skip, don't crash boot
                event("system", "error", "state", f"failed to load snapshot {path.name}: {exc}")

    # ---------- internal helper ----------
    def _touch(self, run_id: str) -> None:
        run = self._runs[run_id]
        run.updated_at = datetime.now(timezone.utc).isoformat()
        self.save_snapshot(run_id)

    # ---------- public API ----------
    def create(self, spec_input: str = "") -> RunState:
        run = RunState(spec_input=spec_input)
        self._runs[run.id] = run
        event(run.id, "info", "state", "run created",
              spec_preview=spec_input[:120])
        self.save_snapshot(run.id)
        return run

    def get(self, run_id: str) -> RunState | None:
        return self._runs.get(run_id)

    def list(self) -> list[RunState]:
        return sorted(self._runs.values(), key=lambda r: r.created_at, reverse=True)

    def update_run(self, run_id: str, **fields: Any) -> None:
        run = self._runs[run_id]
        changes = {}
        for k, v in fields.items():
            if hasattr(run, k):
                setattr(run, k, v)
                changes[k] = v
        self._touch(run_id)
        if changes:
            event(run_id, "info", "state", f"run updated: {list(changes.keys())}")

    def mark_agent(self, run_id: str, agent: str, status: AgentStatus, **kwargs: Any) -> None:
        run = self._runs[run_id]
        a = run.agents[agent]
        a.status = status
        now = datetime.now(timezone.utc).isoformat()
        if status == AgentStatus.running and not a.started_at:
            a.started_at = now
        if status in {AgentStatus.success, AgentStatus.error, AgentStatus.skipped}:
            a.ended_at = now
        for k, v in kwargs.items():
            if hasattr(a, k):
                setattr(a, k, v)
        self._touch(run_id)
        event(run_id, _event_level(status), agent,
              f"agent → {status.value}",
              attempts=a.attempts,
              error=a.last_error if status == AgentStatus.error else None)

    def set_specification(self, run_id: str, spec: dict[str, Any]) -> None:
        self._runs[run_id].specification = spec
        self._touch(run_id)
        event(run_id, "info", "state", "specification stored",
              features=len(spec.get("features", [])))

    def set_architecture(self, run_id: str, arch: dict[str, Any]) -> None:
        self._runs[run_id].architecture = arch
        self._touch(run_id)
        event(run_id, "info", "state", "architecture stored")

    def add_task(self, run_id: str, title: str, detail: str = "", **extras: Any) -> Task:
        task = Task(title=title, detail=detail, **extras)
        self._runs[run_id].tasks.append(task)
        self._touch(run_id)
        event(run_id, "info", "state", f"task added · {title}", task_id=task.id)
        return task

    def mark_task(self, run_id: str, task_id: str, status: TaskStatus) -> None:
        run = self._runs[run_id]
        for t in run.tasks:
            if t.id == task_id:
                t.status = status
                break
        self._touch(run_id)
        event(run_id, _task_event_level(status), "state",
              f"task → {status.value}", task_id=task_id)

    def set_task_test_file(self, run_id: str, task_id: str, path: str) -> None:
        run = self._runs[run_id]
        for t in run.tasks:
            if t.id == task_id:
                t.test_file_path = path
                break
        self._touch(run_id)
        event(run_id, "info", "state", f"task test file set · {path}", task_id=task_id)

    def set_task_code_files(self, run_id: str, task_id: str, paths: list[str]) -> None:
        run = self._runs[run_id]
        for t in run.tasks:
            if t.id == task_id:
                t.code_file_paths = list(paths)
                break
        self._touch(run_id)
        event(run_id, "info", "state",
              f"task code files set · {len(paths)} file(s)", task_id=task_id)

    def set_test_results(self, run_id: str, results: dict[str, Any]) -> None:
        self._runs[run_id].test_results = results
        self._touch(run_id)
        event(run_id, "info", "state", "test results stored",
              passed=results.get("passed"), failed=results.get("failed"))

    def set_summary(self, run_id: str, summary: dict[str, Any]) -> None:
        self._runs[run_id].summary_report = summary
        self._touch(run_id)
        event(run_id, "success", "state", "summary report stored")


def _event_level(status: AgentStatus) -> str:
    return {
        AgentStatus.running: "running",
        AgentStatus.success: "success",
        AgentStatus.error: "error",
        AgentStatus.skipped: "warn",
        AgentStatus.idle: "info",
    }[status]


def _task_event_level(status: TaskStatus) -> str:
    return {
        TaskStatus.pending: "info",
        TaskStatus.in_progress: "running",
        TaskStatus.passed: "success",
        TaskStatus.failed: "error",
    }[status]


# module-level singleton
state_manager = StateManager()
