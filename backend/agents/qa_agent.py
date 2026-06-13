"""
QA Agent — TDD-first failing test generator.

For every task produced by the Planner, this agent asks Groq to write a
pytest test file that:
  1. Imports the (yet-to-exist) modules referenced in ``task.files``.
  2. Asserts the behaviour declared in ``task.test_focus``.
  3. Will FAIL when first executed (because the implementation does not
     yet exist) — that's the whole point of TDD.

Each test file is persisted under
``output_projects/<run_id>/tests/test_<task_id>.py`` and recorded on
``task.test_file_path`` so the Coder Agent (Phase 6) can find them.
"""
from __future__ import annotations

import re
from pathlib import Path
from typing import Any

from core.state_manager import TaskStatus

from .base_agent import BaseAgent

OUTPUT_ROOT = Path(__file__).parent.parent / "output_projects"

SYSTEM_PROMPT = """You are the QA Agent in an autonomous TDD-first AI software-generation pipeline.

You receive ONE task from the planner plus the project architecture context.
Your job: write a test file that tests the task's behaviour BEFORE any implementation exists.

LANGUAGE AWARENESS:
- If the task is targeting Python files (.py), write a `pytest` test file.
- If the task is targeting Javascript/React files (.js, .jsx), write a `Jest` test file (using React Testing Library if appropriate).

Required JSON shape — return ONLY this object:
{
  "filename": "<test_filename>",
  "imports": ["<import statement 1>", ...],
  "code": "<complete test file content as a single string. THIS MUST NOT BE EMPTY!>",
  "rationale": "<1 sentence describing what's being verified>"
}

Rules for the `code` string:
- `filename`: MUST be `test_<task-id>.py` for Python, or `<task-id>.test.js` for Javascript.
- IMPORTANT: The `code` field MUST contain the actual test code. NEVER return an empty string.
- Real, complete, importable code. Imports should reference the files listed under the task.
- Define 2-4 test cases thoroughly covering the `test_focus`.
- Mock external dependencies where appropriate.
- Tests are EXPECTED to fail initially because the implementation does not yet exist.
- NEVER output anything outside the JSON object.
"""


def _slugify(s: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9_-]+", "_", s)
    return s.strip("_") or "task"


def _safe_filename(task_id: str, fallback_title: str) -> str:
    base = task_id.strip() or _slugify(fallback_title)
    return f"test_{_slugify(base)}.py"


def _arch_summary(arch: dict[str, Any]) -> dict[str, Any]:
    """Trim architecture to just what QA needs (keeps prompt small)."""
    return {
        "modules": arch.get("modules", []),
        "apis": arch.get("apis", []),
        "db_schema": arch.get("db_schema", []),
    }


class QAAgent(BaseAgent):
    name = "qa"

    async def execute(self, run_id: str, **kwargs: Any) -> dict[str, Any]:  # noqa: ARG002
        run = self.state.get(run_id)
        if run is None:
            raise RuntimeError(f"unknown run_id={run_id}")
        if not run.tasks:
            raise RuntimeError("qa agent requires planner tasks")
        arch = run.architecture or {}

        out_dir = OUTPUT_ROOT / run_id / "tests"
        out_dir.mkdir(parents=True, exist_ok=True)
        self.state.update_run(run_id, output_dir=str(OUTPUT_ROOT / run_id))

        written: list[dict[str, str]] = []
        for task in run.tasks:
            if getattr(task, "test_file_path", None):
                existing_path = OUTPUT_ROOT.parent / task.test_file_path
                if existing_path.exists():
                    written.append({"task_id": task.id, "path": task.test_file_path})
                    continue

            path = await self._write_test_for_task(run_id, task, arch, out_dir)
            written.append({"task_id": task.id, "path": path})
            # Sleep removed to improve execution speed
            # import asyncio
            # await asyncio.sleep(5.0)

        summary = f"qa: {len(written)} failing test files written"
        self.log(run_id, summary, level="success")
        return {"summary": summary, "files_written": len(written)}

    # ---------------- helpers ----------------
    async def _write_test_for_task(
        self,
        run_id: str,
        task: Any,
        arch: dict[str, Any],
        out_dir: Path,
    ) -> str:
        user_prompt = self._build_prompt(task, arch)
        result = await self.call_groq_json(
            run_id=run_id,
            system_prompt=SYSTEM_PROMPT,
            user_prompt=user_prompt,
        )
        code = str(result.get("code", "")).strip()
        if not code:
            raise RuntimeError(f"qa: empty code for task {task.id}")

        filename = str(result.get("filename", "")).strip()
        if not filename:
            filename = _safe_filename(task.id, task.title)
        path = out_dir / filename
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(code, encoding="utf-8")

        rel_path = str(path.relative_to(OUTPUT_ROOT.parent))
        self.state.set_task_test_file(run_id, task.id, rel_path)
        self.state.mark_task(run_id, task.id, TaskStatus.in_progress)
        self.log(
            run_id,
            f"test written · {filename} · {len(code.splitlines())} lines",
            task_id=task.id,
            rationale=str(result.get("rationale", ""))[:120],
        )
        return rel_path

    @staticmethod
    def _build_prompt(task: Any, arch: dict[str, Any]) -> str:
        import json
        payload = {
            "task": {
                "id": task.id,
                "title": task.title,
                "detail": task.detail,
                "files": task.files,
                "test_focus": task.test_focus,
                "depends_on": task.depends_on,
            },
            "architecture": _arch_summary(arch),
        }
        return (
            "Write the failing pytest test file for this task. "
            "Tests must reference the files listed under task.files.\n\n"
            f"```json\n{json.dumps(payload, indent=2)}\n```"
        )
