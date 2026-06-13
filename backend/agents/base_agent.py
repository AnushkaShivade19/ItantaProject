"""
BaseAgent — shared contract + dynamic LLM helper (via litellm).

Concrete agents inherit from this and call ``self.call_groq_json(...)``
to get JSON-structured responses from any provider using litellm.
"""
from __future__ import annotations

import json
import os
import re
import asyncio
from abc import ABC, abstractmethod
from typing import Any

from core.logger import event
from core.state_manager import StateManager
import litellm

litellm.suppress_debug_info = True


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
        self._api_key: str | None = os.environ.get(f"{self.name.upper()}_API_KEY") or os.environ.get("GROQ_API_KEY")

    # ---------------- abstract ----------------
    @abstractmethod
    async def execute(self, run_id: str, **kwargs: Any) -> dict[str, Any]:
        """Run the agent for a given run_id and return its output."""

    # ---------------- helpers ----------------
    def log(self, run_id: str, message: str, level: str = "info", **extra: Any) -> None:
        event(run_id, level, self.name, message, **extra)

    def require_key(self, run_id: str) -> str:
        if not self._api_key:
            self.log(run_id, f"{self.name.upper()}_API_KEY or GROQ_API_KEY missing — add it to backend/.env",
                     level="error")
            raise RuntimeError(f"{self.name.upper()}_API_KEY and GROQ_API_KEY are not configured.")
        return self._api_key

    # ---------------- LLM call helpers ----------------
    def _build_messages(
        self,
        system_prompt: str,
        user_prompt: str,
        extra_messages: list[dict[str, str]] | None,
    ) -> list[dict[str, str]]:
        messages: list[dict[str, str]] = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]
        if extra_messages:
            messages.extend(extra_messages)
        return messages

    def _parse_json_or_raise(self, run_id: str, content: str) -> dict[str, Any]:
        try:
            # Strip markdown code blocks if present
            clean_content = re.sub(r"^```(?:json)?\s*(.*?)\s*```$", r"\1", content.strip(), flags=re.DOTALL)
            return json.loads(clean_content)
        except json.JSONDecodeError as exc:
            self.log(run_id, f"llm returned invalid JSON: {exc}",
                     level="error", raw_preview=content[:200])
            raise RuntimeError(f"invalid JSON from {self.model}: {exc}") from exc

    def _log_usage(self, run_id: str, response: Any) -> None:
        usage = getattr(response, "usage", None)
        if usage is None:
            return
        self.log(run_id, "llm ok",
                 prompt_tokens=getattr(usage, "prompt_tokens", 0),
                 completion_tokens=getattr(usage, "completion_tokens", 0))

    async def call_groq_json(
        self,
        run_id: str,
        system_prompt: str,
        user_prompt: str,
        extra_messages: list[dict[str, str]] | None = None,
    ) -> dict[str, Any]:
        """Call LLM with forced JSON output; parse and return dict."""
        self.require_key(run_id)
        messages = self._build_messages(system_prompt, user_prompt, extra_messages)
        
        # If using a Google API key and the model doesn't specify gemini/, inject it 
        # so Litellm routes correctly to Google GenAI.
        model = self.model
        if self._api_key and self._api_key.startswith("AIzaSy") and not model.startswith("gemini/"):
            model = f"gemini/{model}"
        elif self._api_key and self._api_key.startswith("gsk_") and not model.startswith("groq/"):
            model = f"groq/{model}"

        self.log(run_id, f"llm call · model={model} temp={self.temperature}")
        
        try:
            response = await litellm.acompletion(
                model=model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                response_format={"type": "json_object"},
                api_key=self._api_key,
                timeout=self.timeout_seconds,
            )
        except Exception as exc:
            text = str(exc)
            if "429" in text or "rate_limit" in text.lower() or "ResourceExhausted" in text:
                m = re.search(r"try again in ([\d.]+)\s*s", text)
                wait_s = float(m.group(1)) + 0.5 if m else 8.0
                self.log(run_id,
                         f"llm 429 · pre-sleeping {wait_s:.1f}s before bubbling",
                         level="warn")
                await asyncio.sleep(wait_s)
            elif "503" in text or "ServiceUnavailableError" in text or "UNAVAILABLE" in text:
                wait_s = 15.0
                self.log(run_id,
                         f"llm 503 · pre-sleeping {wait_s:.1f}s before bubbling",
                         level="warn")
                await asyncio.sleep(wait_s)
            raise
            
        content = response.choices[0].message.content or "{}"
        parsed = self._parse_json_or_raise(run_id, content)
        self._log_usage(run_id, response)
        return parsed
