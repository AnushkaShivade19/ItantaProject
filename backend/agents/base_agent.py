"""
BaseAgent — shared contract + Groq async helper.

Concrete agents inherit from this and call ``self.call_groq(...)``
to get JSON-structured responses. Retry/back-off lives in the
orchestrator; this class stays focused on the single call.
"""
from __future__ import annotations

import json
import os
from abc import ABC, abstractmethod
from typing import Any

from groq import AsyncGroq

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
        self.max_tokens: int = int(config["llm"].get("max_tokens", 4096))
        self.timeout_seconds: int = int(config["llm"].get("timeout_seconds", 90))
        self._api_key: str | None = os.environ.get("GROQ_API_KEY")
        self._client: AsyncGroq | None = None

    # ---------------- abstract ----------------
    @abstractmethod
    async def execute(self, run_id: str, **kwargs: Any) -> dict[str, Any]:
        """Run the agent for a given run_id and return its output."""

    # ---------------- helpers ----------------
    def log(self, run_id: str, message: str, level: str = "info", **extra: Any) -> None:
        event(run_id, level, self.name, message, **extra)

    def require_key(self, run_id: str) -> str:
        if not self._api_key:
            self.log(run_id, "GROQ_API_KEY missing — add it to backend/.env",
                     level="error")
            raise RuntimeError("GROQ_API_KEY is not configured.")
        return self._api_key

    def _groq_client(self) -> AsyncGroq:
        if self._client is None:
            self._client = AsyncGroq(api_key=self._api_key, timeout=self.timeout_seconds)
        return self._client

    async def call_groq_json(
        self,
        run_id: str,
        system_prompt: str,
        user_prompt: str,
        extra_messages: list[dict[str, str]] | None = None,
    ) -> dict[str, Any]:
        """Call Groq with forced JSON output; parse and return dict.

        Raises if the key is missing, the response is not JSON, or the
        HTTP call fails — the orchestrator catches these as agent errors.
        """
        self.require_key(run_id)
        messages: list[dict[str, str]] = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]
        if extra_messages:
            messages.extend(extra_messages)

        self.log(run_id, f"groq call · model={self.model} temp={self.temperature}")
        client = self._groq_client()
        response = await client.chat.completions.create(
            model=self.model,
            messages=messages,  # type: ignore[arg-type]
            temperature=self.temperature,
            max_tokens=self.max_tokens,
            response_format={"type": "json_object"},
        )
        content = response.choices[0].message.content or "{}"
        try:
            parsed: dict[str, Any] = json.loads(content)
        except json.JSONDecodeError as exc:
            self.log(run_id, f"groq returned invalid JSON: {exc}",
                     level="error", raw_preview=content[:200])
            raise RuntimeError(f"invalid JSON from {self.model}: {exc}") from exc
        usage = getattr(response, "usage", None)
        if usage is not None:
            self.log(run_id, "groq ok",
                     prompt_tokens=usage.prompt_tokens,
                     completion_tokens=usage.completion_tokens)
        return parsed
