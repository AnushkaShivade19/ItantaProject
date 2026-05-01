"""Coder Agent — implemented in Phase 6."""
from __future__ import annotations

from typing import Any

from .base_agent import BaseAgent


class CoderAgent(BaseAgent):
    name = "coder"

    async def execute(self, run_id: str, **kwargs: Any) -> dict[str, Any]:  # noqa: ARG002
        raise NotImplementedError("CoderAgent arrives in Phase 6.")
