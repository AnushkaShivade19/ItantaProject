"""
Planner Agent — turns specification + architecture into atomic, testable tasks.

Each task is a small unit a coder can complete in 1-3 functions plus tests.
Tasks reference concrete files and a clear test_focus so the QA agent can
emit failing pytest cases first.
"""
from __future__ import annotations

import json
from typing import Any

from .base_agent import BaseAgent

SYSTEM_PROMPT = """You are the Planner Agent in an autonomous AI software-generation pipeline.

Given a project specification + system architecture, break the project into
ATOMIC, TESTABLE tasks. Each task must:
- Be small (~1-3 functions, ~30-100 LOC).
- Have ONE clear responsibility.
- Reference specific files it will create or modify.
- Specify a test_focus — exactly what behaviour the QA agent should verify.
- Declare dependencies on prior task ids.
- Be implementable BEFORE its dependents (topological order).

Required JSON shape — return ONLY this object:
{
  "tasks": [
    {
      "id": "t-001",
      "title": "<short imperative>",
      "detail": "<2-4 sentences of what to build>",
      "depends_on": [],
      "files": ["backend/main.py", "backend/routers/links.py"],
      "test_focus": "<single sentence: which behaviour to assert>"
    }
  ]
}

Rules:
- 6 to 15 tasks total. Cover ALL features and acceptance_criteria in the spec.
- ids are kebab-case (t-001, t-002, ...). NO duplicates.
- Use depends_on to model real dependencies (e.g. routes depend on models).
- Files must match the architecture's folder_structure.
- Test_focus is mandatory — never blank.
- NEVER output anything outside the JSON object.
"""


def _shape_payload(spec: dict[str, Any], arch: dict[str, Any]) -> str:
    safe_spec = {k: v for k, v in spec.items() if k not in {"clarifications", "mode"}}
    payload = {"specification": safe_spec, "architecture": arch}
    return json.dumps(payload, indent=2)


class PlannerAgent(BaseAgent):
    name = "planner"

    async def execute(self, run_id: str, **kwargs: Any) -> dict[str, Any]:  # noqa: ARG002
        run = self.state.get(run_id)
        if run is None:
            raise RuntimeError(f"unknown run_id={run_id}")
        spec = run.specification or {}
        arch = run.architecture or {}
        if not spec or not arch:
            raise RuntimeError("planner requires both specification and architecture")

        user_prompt = (
            "Break this project into atomic testable tasks:\n\n"
            f"```json\n{_shape_payload(spec, arch)}\n```"
        )

        result = await self.call_groq_json(
            run_id=run_id,
            system_prompt=SYSTEM_PROMPT,
            user_prompt=user_prompt,
        )
        raw_tasks = result.get("tasks") or []
        if not isinstance(raw_tasks, list) or not raw_tasks:
            raise RuntimeError("planner returned no tasks")

        added_ids = self._persist_tasks(run_id, raw_tasks)
        summary = f"plan: {len(added_ids)} atomic tasks"
        self.log(run_id, summary, level="success")
        return {"summary": summary, "task_count": len(added_ids)}

    # ---------- helpers ----------
    def _persist_tasks(self, run_id: str, raw_tasks: list[dict[str, Any]]) -> list[str]:
        added_ids: list[str] = []
        for raw in raw_tasks:
            extras = {
                "id": str(raw.get("id") or _next_task_id(len(added_ids) + 1)),
                "depends_on": list(raw.get("depends_on", []) or []),
                "files": list(raw.get("files", []) or []),
                "test_focus": str(raw.get("test_focus", "") or ""),
            }
            task = self.state.add_task(
                run_id,
                title=str(raw.get("title", "untitled task")),
                detail=str(raw.get("detail", "")),
                **extras,
            )
            added_ids.append(task.id)
        return added_ids


def _next_task_id(n: int) -> str:
    return f"t-{n:03d}"
