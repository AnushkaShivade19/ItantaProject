"""
State manager — single source of truth for a framework run.

Phase 1 scaffold. The orchestrator (Phase 2) and agents will mutate
state via the methods below.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


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


AGENT_ORDER: list[str] = [
    "intake",
    "architect",
    "planner",
    "qa",
    "coder",
    "validator",
    "recovery",
]


class AgentState(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str
    status: AgentStatus = AgentStatus.idle
    started_at: str | None = None
    ended_at: str | None = None
    attempts: int = 0
    last_error: str | None = None
    output_summary: str | None = None


class RunState(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    spec_input: str = ""
    status: RunStatus = RunStatus.pending
    phase: str = "phase-1-setup"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    specification: dict[str, Any] | None = None
    architecture: dict[str, Any] | None = None
    tasks: list[dict[str, Any]] = Field(default_factory=list)
    test_results: dict[str, Any] | None = None
    summary_report: dict[str, Any] | None = None
    output_dir: str | None = None
    agents: dict[str, AgentState] = Field(
        default_factory=lambda: {n: AgentState(name=n) for n in AGENT_ORDER}
    )


class StateManager:
    """In-memory state store keyed by run_id. Persisted to disk via logger."""

    def __init__(self) -> None:
        self._runs: dict[str, RunState] = {}

    def create(self, spec_input: str = "") -> RunState:
        run = RunState(spec_input=spec_input)
        self._runs[run.id] = run
        return run

    def get(self, run_id: str) -> RunState | None:
        return self._runs.get(run_id)

    def list(self) -> list[RunState]:
        return sorted(self._runs.values(), key=lambda r: r.created_at, reverse=True)

    def mark_agent(self, run_id: str, agent: str, status: AgentStatus, **kwargs: Any) -> None:
        run = self._runs[run_id]
        a = run.agents[agent]
        a.status = status
        now = datetime.now(timezone.utc).isoformat()
        if status == AgentStatus.running and not a.started_at:
            a.started_at = now
        if status in {AgentStatus.success, AgentStatus.error}:
            a.ended_at = now
        for k, v in kwargs.items():
            if hasattr(a, k):
                setattr(a, k, v)
        run.updated_at = now

    def update_run(self, run_id: str, **kwargs: Any) -> None:
        run = self._runs[run_id]
        for k, v in kwargs.items():
            if hasattr(run, k):
                setattr(run, k, v)
        run.updated_at = datetime.now(timezone.utc).isoformat()


# module-level singleton — simple for now
state_manager = StateManager()
