"""
Intake Agent — turns a natural-language spec into a structured JSON
specification, asking clarifying questions when the brief is ambiguous.

Flow per invocation
-------------------
1.  Read ``run.spec_input`` and any prior ``clarifications`` stored on
    the run's specification.
2.  Ask Groq (forced JSON mode) to either:
      a) return up to 3 clarifying questions, OR
      b) return the final structured specification.
3a. If clarifications needed → set ``run.status = awaiting_input`` and
    store the pending questions on the spec. The orchestrator will
    pause. When the user answers, Phase 3's answer endpoint stores
    them and re-runs this agent.
3b. If spec is ready → store the full JSON on the run and return
    success.

Return dict shape:
    {"mode": "awaiting_input", "summary": "..."} on clarification round
    {"mode": "spec", "summary": "...", "specification": {...}} on success
"""
from __future__ import annotations

from typing import Any

from core.state_manager import RunStatus

from .base_agent import BaseAgent

SYSTEM_PROMPT = """You are the Intake Agent in an autonomous AI software-generation pipeline.

Your single job: take a user's natural-language project brief and either
  (a) ASK at most 3 precise clarifying questions when critical info is
      missing or ambiguous, OR
  (b) PRODUCE a complete structured specification JSON when the brief is
      clear enough to architect and build.

A spec is "clear enough" when you know: the project name (may be inferred),
the primary tech stack (frontend, backend, database/storage), at least 3
core features, at least 2 acceptance criteria, and any explicit constraints.

ALWAYS respond with a valid JSON object in EXACTLY one of these shapes:

SHAPE A — clarification needed:
{
  "mode": "clarify",
  "reasoning": "1-sentence explanation of what's ambiguous",
  "questions": [
    {"id": "q1", "text": "Concrete question.", "options": ["opt1","opt2"]},
    {"id": "q2", "text": "Another question.", "options": null}
  ]
}

SHAPE B — spec ready:
{
  "mode": "spec",
  "specification": {
    "project_name": "<kebab-case-name>",
    "description": "<1-2 sentence human description>",
    "features": ["feature A", "feature B", "feature C", ...],
    "constraints": ["constraint 1", "constraint 2"],
    "tech_stack": {
      "frontend": "<eg: React + Tailwind>",
      "backend": "<eg: FastAPI>",
      "database": "<eg: MongoDB>",
      "other": ["<eg: pytest>", "<eg: Docker>"]
    },
    "acceptance_criteria": [
      "criterion 1 (testable)",
      "criterion 2 (testable)"
    ]
  }
}

Rules:
- NEVER include anything outside the JSON.
- Ask questions ONLY about what a senior engineer truly needs to scope
  the project. Don't ask about nice-to-haves.
- Prefer SHAPE B (final spec) whenever the brief is reasonably scoped —
  a senior engineer fills small gaps with sensible defaults.
- If the user already supplied answers to earlier questions (passed as
  extra context), integrate them and move toward SHAPE B.
"""

MAX_QUESTIONS_PER_ROUND = 3


def _format_clarifications(clarifications: list[dict[str, str]]) -> str:
    if not clarifications:
        return ""
    lines: list[str] = ["\n\nPrior clarifications:"]
    for c in clarifications:
        lines.append(f"- Q: {c.get('question', '?')}")
        lines.append(f"  A: {c.get('answer', '')}")
    return "\n".join(lines)


class IntakeAgent(BaseAgent):
    name = "intake"

    async def execute(self, run_id: str, **kwargs: Any) -> dict[str, Any]:  # noqa: ARG002
        run = self.state.get(run_id)
        if run is None:
            raise RuntimeError(f"unknown run_id={run_id}")

        existing_spec = run.specification or {}
        clarifications: list[dict[str, str]] = existing_spec.get("clarifications", [])

        user_prompt = (
            f"User's project brief:\n\n{run.spec_input}"
            f"{_format_clarifications(clarifications)}"
        )

        result = await self.call_groq_json(
            run_id=run_id,
            system_prompt=SYSTEM_PROMPT,
            user_prompt=user_prompt,
        )

        mode = result.get("mode")
        if mode == "clarify":
            return self._handle_clarify(run_id, result, clarifications)
        if mode == "spec":
            return self._handle_spec(run_id, result, clarifications)

        raise RuntimeError(f"intake agent: unknown mode in response: {mode!r}")

    # ---------- mode handlers ----------
    def _handle_clarify(
        self, run_id: str, result: dict[str, Any], clarifications: list[dict[str, str]]
    ) -> dict[str, Any]:
        questions = list(result.get("questions", []))[:MAX_QUESTIONS_PER_ROUND]
        reasoning = result.get("reasoning", "")

        self.state.set_specification(run_id, {
            "mode": "clarify",
            "clarifications": clarifications,
            "pending_questions": questions,
            "reasoning": reasoning,
        })
        self.state.update_run(run_id, status=RunStatus.awaiting_input)
        self.log(run_id,
                 f"awaiting {len(questions)} clarification(s)",
                 level="warn",
                 reasoning=reasoning)
        return {
            "mode": "awaiting_input",
            "summary": f"{len(questions)} clarifying question(s) pending",
            "questions": questions,
        }

    def _handle_spec(
        self, run_id: str, result: dict[str, Any], clarifications: list[dict[str, str]]
    ) -> dict[str, Any]:
        spec = dict(result.get("specification", {}))
        spec["mode"] = "spec"
        spec["clarifications"] = clarifications
        spec.setdefault("project_name", "untitled-project")
        spec.setdefault("features", [])
        spec.setdefault("constraints", [])
        spec.setdefault("tech_stack", {})
        spec.setdefault("acceptance_criteria", [])
        self.state.set_specification(run_id, spec)
        self.log(run_id,
                 f"spec ready · {spec.get('project_name')} · "
                 f"{len(spec.get('features', []))} features",
                 level="success")
        return {
            "mode": "spec",
            "summary": f"spec: {spec.get('project_name')}",
            "specification": spec,
        }
