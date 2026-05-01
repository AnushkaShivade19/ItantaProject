"""
Orchestrator — coordinates the 7-agent pipeline.

Phase 1 scaffold. Phase 2 will implement run() and the full workflow.
"""
from __future__ import annotations

from .state_manager import AGENT_ORDER, RunState, StateManager


class Orchestrator:
    """High-level controller for a framework run.

    Flow (to be implemented in Phase 2):
      Intake -> Architect -> Planner -> QA -> Coder -> Validator -> Recovery
    """

    def __init__(self, state: StateManager) -> None:
        self.state = state
        self.pipeline: list[str] = AGENT_ORDER

    def describe_pipeline(self) -> list[dict]:
        """Return static metadata for the pipeline (used by dashboard)."""
        return [
            {"name": "intake", "label": "Intake", "desc": "Clarifies spec & produces JSON"},
            {"name": "architect", "label": "Architect", "desc": "Folder / API / DB design"},
            {"name": "planner", "label": "Planner", "desc": "Atomic testable tasks"},
            {"name": "qa", "label": "QA (TDD)", "desc": "Failing pytest cases first"},
            {"name": "coder", "label": "Coder", "desc": "Writes code to pass tests"},
            {"name": "validator", "label": "Validator", "desc": "Runs pytest + lint"},
            {"name": "recovery", "label": "Recovery", "desc": "Heals failures, retries"},
        ]

    async def run(self, run_id: str) -> RunState:  # noqa: ARG002
        raise NotImplementedError("Phase 2 wires the orchestrator. Phase 1 is scaffolding only.")
