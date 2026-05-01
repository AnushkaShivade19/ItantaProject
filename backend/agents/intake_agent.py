"""Intake Agent — implemented in Phase 3."""
from __future__ import annotations

from typing import Any

from .base_agent import BaseAgent


class IntakeAgent(BaseAgent):
    name = "intake"

    async def execute(self, run_id: str, **kwargs: Any) -> dict[str, Any]:  # noqa: ARG002
        raise NotImplementedError("IntakeAgent arrives in Phase 3.")
