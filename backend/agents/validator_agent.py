"""Validator Agent — implemented in Phase 7."""
from __future__ import annotations

from typing import Any

from .base_agent import BaseAgent


class ValidatorAgent(BaseAgent):
    name = "validator"

    async def execute(self, run_id: str, **kwargs: Any) -> dict[str, Any]:  # noqa: ARG002
        raise NotImplementedError("ValidatorAgent arrives in Phase 7.")
