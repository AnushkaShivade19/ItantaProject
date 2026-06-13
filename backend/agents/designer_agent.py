"""
Designer Agent — Generates UI layouts, styles, and frontend components.

This agent reads the task specification and UI requirements to output frontend files
like React components, CSS, HTML, etc., focusing entirely on layout and design.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from .base_agent import BaseAgent

OUTPUT_ROOT = Path(__file__).parent.parent / "output_projects"

SYSTEM_PROMPT = """You are the Designer Agent in an AI software-generation pipeline.

You receive ONE task with:
- task.title, task.detail
- task.files: target file paths for UI/Frontend components
- architecture_modules: high-level module map

Your job: write the frontend implementation (HTML, CSS, React components) that satisfy the design requirements. Provide visually excellent, modern UI code.

Required JSON shape — return ONLY this object:
{
  "files": [
    {
      "path": "<relative path matching task.files entry>",
      "content": "<COMPLETE file content as a single string>"
    }
  ],
  "rationale": "<1 sentence describing the design choices>"
}

LANGUAGE AWARENESS & RULES:
- Write modern, idiomatic React functional components, HTML, and vanilla CSS or Tailwind as appropriate.
- Each file MUST be COMPLETE — do not output partial code or placeholders like `... # TODO`.
- NEVER output anything outside the JSON object.
"""

class DesignerAgent(BaseAgent):
    name = "designer"

    async def execute(self, run_id: str, **kwargs: Any) -> dict[str, Any]:  # noqa: ARG002
        run = self.state.get(run_id)
        if run is None:
            raise RuntimeError(f"unknown run_id={run_id}")
        if not run.tasks:
            raise RuntimeError("designer requires planner tasks")
        arch = run.architecture or {}

        out_dir = OUTPUT_ROOT / run_id
        out_dir.mkdir(parents=True, exist_ok=True)

        total_files = 0
        for task in run.tasks:
            if getattr(task, "code_file_paths", None):
                # If code files were already generated for this task by the designer, skip to save tokens
                has_existing = any((OUTPUT_ROOT.parent / p).exists() for p in task.code_file_paths)
                if has_existing:
                    total_files += len(task.code_file_paths)
                    continue

            paths = await self._design_for_task(run_id, task, arch, out_dir)
            total_files += len(paths)
            import asyncio
            await asyncio.sleep(5.0)

        summary = f"designer: {total_files} files across {len(run.tasks)} tasks"
        self.log(run_id, summary, level="success")
        return {"summary": summary, "files_written": total_files}

    async def _design_for_task(
        self,
        run_id: str,
        task: Any,
        arch: dict[str, Any],
        out_dir: Path,
    ) -> list[str]:
        payload = {
            "task": {
                "id": task.id,
                "title": task.title,
                "detail": task.detail,
                "files": task.files,
            },
            "architecture_modules": arch.get("modules", []),
        }
        result = await self.call_groq_json(
            run_id=run_id,
            system_prompt=SYSTEM_PROMPT,
            user_prompt=(
                "Implement the UI/frontend code for this task if applicable. If it's purely a backend task, return an empty files list.\n\n"
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
            raise RuntimeError(f"designer: invalid files payload for task {task.id}")

        written: list[str] = []
        for f in files:
            rel = str(f.get("path", "")).lstrip("/")
            content = f.get("content", "")
            if not rel or not isinstance(content, str) or not content.strip():
                continue
            target = (out_dir / rel).resolve()
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
                f"task {task.id} · {len(written)} file(s) designed",
                rationale=str(result.get("rationale", ""))[:120],
            )
        return written
