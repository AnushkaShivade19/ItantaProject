"""Recovery Agent — implemented in Phase 7."""
from __future__ import annotations

from typing import Any

from .base_agent import BaseAgent


class RecoveryAgent(BaseAgent):
    name = "recovery"

    async def execute(self, run_id: str, **kwargs: Any) -> dict[str, Any]:  # noqa: ARG002
        raise NotImplementedError("RecoveryAgent arrives in Phase 7.")
