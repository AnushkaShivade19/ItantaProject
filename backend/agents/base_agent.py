"""
BaseAgent — shared contract + Groq LLM helper.

Phase 1 scaffold. Concrete agents land in Phase 3+.
"""
from __future__ import annotations

import os
from abc import ABC, abstractmethod
from typing import Any

from core.logger import event
from core.state_manager import StateManager


class BaseAgent(ABC):
    """All agents inherit from this class."""

    name: str = "base"

    def __init__(self, config: dict[str, Any], state: StateManager) -> None:
        self.config = config
        self.state = state
        agent_cfg = config["agents"].get(self.name, {})
        self.model: str = agent_cfg.get("model", config["llm"]["default_model"])
        self.temperature: float = agent_cfg.get("temperature", config["llm"]["temperature"])
        self._api_key: str | None = os.environ.get("GROQ_API_KEY")

    # ---- abstract ----
    @abstractmethod
    async def execute(self, run_id: str, **kwargs: Any) -> dict[str, Any]:
        """Run the agent for a given run_id and return its output."""

    # ---- helpers ----
    def log(self, run_id: str, message: str, level: str = "info", **extra: Any) -> None:
        event(run_id, level, self.name, message, **extra)

    def require_key(self, run_id: str) -> str:
        if not self._api_key:
            self.log(run_id, "GROQ_API_KEY missing — add it to backend/.env", level="error")
            raise RuntimeError("GROQ_API_KEY is not configured.")
        return self._api_key
