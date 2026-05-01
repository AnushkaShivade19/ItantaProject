"""Architect Agent — implemented in Phase 4."""
from __future__ import annotations

from typing import Any

from .base_agent import BaseAgent


class ArchitectAgent(BaseAgent):
    name = "architect"

    async def execute(self, run_id: str, **kwargs: Any) -> dict[str, Any]:  # noqa: ARG002
        raise NotImplementedError("ArchitectAgent arrives in Phase 4.")
