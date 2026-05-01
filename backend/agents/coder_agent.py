"""
Coder Agent — TDD-pass implementation generator.

For every task with a failing test file, this agent reads the test
content + architecture context and asks Groq to write the implementation
code that makes the tests pass.

Files are persisted under ``output_projects/<run_id>/<file_path>`` so
imports in the tests resolve. Empty ``__init__.py`` files are auto-seeded
for any Python package directory created by the agent.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from .base_agent import BaseAgent

OUTPUT_ROOT = Path(__file__).parent.parent / "output_projects"

SYSTEM_PROMPT = """You are the Coder Agent in a TDD-first AI software-generation pipeline.

You receive ONE task with:
- task.title, task.detail, task.test_focus
- task.files: target file paths the Coder must create or modify
- failing_test: the pytest content that MUST pass once you're done
- architecture_modules: high-level module map for context

Your job: write the implementation code that makes the failing tests pass.

Required JSON shape — return ONLY this object:
{
  "files": [
    {
      "path": "<relative path matching task.files entry>",
      "content": "<COMPLETE file content as a single string>"
    }
  ],
  "rationale": "<1 sentence describing what was implemented>"
}

Rules:
- HONOR the import paths used by `failing_test`. If it does
  `from backend.models import Bookmark`, place code at
  `backend/models.py` OR `backend/models/__init__.py` exporting `Bookmark`.
- Code must be runnable, idiomatic Python (PEP 8). No syntax errors.
- Include any `__init__.py` files needed so the imports resolve at test
  time (the framework also auto-seeds empty ones, but if you need
  re-exports, do it explicitly).
- Prefer simplicity over cleverness. No premature abstractions.
- Each file MUST be COMPLETE — do not output partial code or placeholders
  like `... # TODO`.
- NEVER output anything outside the JSON object.
"""


def _read_test_file(test_path: str | None) -> str:
    if not test_path:
        return ""
    full = OUTPUT_ROOT.parent / test_path
    if not full.exists():
        return ""
    return full.read_text(encoding="utf-8")


class CoderAgent(BaseAgent):
    name = "coder"

    async def execute(self, run_id: str, **kwargs: Any) -> dict[str, Any]:  # noqa: ARG002
        run = self.state.get(run_id)
        if run is None:
            raise RuntimeError(f"unknown run_id={run_id}")
        if not run.tasks:
            raise RuntimeError("coder requires planner tasks")
        arch = run.architecture or {}

        out_dir = OUTPUT_ROOT / run_id
        out_dir.mkdir(parents=True, exist_ok=True)

        total_files = 0
        for task in run.tasks:
            paths = await self._code_for_task(run_id, task, arch, out_dir)
            total_files += len(paths)
            # Spacing reduces 429s on Groq free-tier 70b TPM windows.
            import asyncio
            await asyncio.sleep(5.0)

        self._seed_init_files(out_dir)

        summary = f"coder: {total_files} files across {len(run.tasks)} tasks"
        self.log(run_id, summary, level="success")
        return {"summary": summary, "files_written": total_files}

    # ---------------- helpers ----------------
    async def _code_for_task(
        self,
        run_id: str,
        task: Any,
        arch: dict[str, Any],
        out_dir: Path,
    ) -> list[str]:
        test_content = _read_test_file(task.test_file_path)
        payload = {
            "task": {
                "id": task.id,
                "title": task.title,
                "detail": task.detail,
                "files": task.files,
                "test_focus": task.test_focus,
            },
            "failing_test": test_content,
            "architecture_modules": arch.get("modules", []),
        }
        result = await self.call_groq_json(
            run_id=run_id,
            system_prompt=SYSTEM_PROMPT,
            user_prompt=(
                "Implement the code that makes the failing tests pass.\n\n"
                f"```json\n{json.dumps(payload, indent=2)}\n```"
            ),
        )
        return self._persist_files(run_id, task, result, out_dir)

    def _persist_files(
        self,
        run_id: str,
        task: Any,
        result: dict[str, Any],
        out_dir: Path,
    ) -> list[str]:
        files = result.get("files") or []
        if not isinstance(files, list):
            raise RuntimeError(f"coder: invalid files payload for task {task.id}")

        written: list[str] = []
        for f in files:
            rel = str(f.get("path", "")).lstrip("/")
            content = f.get("content", "")
            if not rel or not isinstance(content, str) or not content.strip():
                continue
            target = (out_dir / rel).resolve()
            # Sandbox: ensure write stays inside this run's output dir.
            if not str(target).startswith(str(out_dir.resolve())):
                self.log(run_id,
                         f"refusing path outside sandbox: {rel}",
                         level="error", task_id=task.id)
                continue
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(content, encoding="utf-8")
            written.append(str(target.relative_to(OUTPUT_ROOT.parent)))

        if written:
            self.state.set_task_code_files(run_id, task.id, written)
            self.log(
                run_id,
                f"task {task.id} · {len(written)} file(s) written",
                rationale=str(result.get("rationale", ""))[:120],
            )
        return written

    def _seed_init_files(self, root: Path) -> None:
        """Empty __init__.py for any subdir that contains *.py files."""
        for path in root.rglob("*"):
            if not path.is_dir():
                continue
            if path.name == "tests":
                continue
            has_py = any(p.suffix == ".py" for p in path.iterdir() if p.is_file())
            if not has_py:
                continue
            init = path / "__init__.py"
            if not init.exists():
                init.write_text("", encoding="utf-8")
