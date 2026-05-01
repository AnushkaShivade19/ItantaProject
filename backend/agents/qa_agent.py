"""QA Agent (TDD-first) — implemented in Phase 5."""
from __future__ import annotations

from typing import Any

from .base_agent import BaseAgent


class QAAgent(BaseAgent):
    name = "qa"

    async def execute(self, run_id: str, **kwargs: Any) -> dict[str, Any]:  # noqa: ARG002
        raise NotImplementedError("QAAgent arrives in Phase 5.")
