"""
Architect Agent — turns a structured specification into a system design.

Emits a single JSON architecture object with:
- ``folder_structure``: nested dir/file tree
- ``apis``: list of HTTP endpoints (method/path/purpose/request/response)
- ``db_schema``: tables/collections with fields and indexes
- ``modules``: high-level code modules with responsibilities
"""
from __future__ import annotations

from typing import Any

from .base_agent import BaseAgent

SYSTEM_PROMPT = """You are the Architect Agent in an autonomous AI software-generation pipeline.

Given a project specification (project_name, features, tech_stack, constraints,
acceptance_criteria), produce a pragmatic system design as a SINGLE JSON object.

Required JSON shape — return ONLY this object, no commentary:
{
  "folder_structure": {
    "name": "<project-root>",
    "type": "dir",
    "children": [
      {"name": "backend/", "type": "dir", "children": [
        {"name": "main.py", "type": "file", "purpose": "FastAPI app entrypoint"}
      ]},
      {"name": "frontend/", "type": "dir", "children": [...]},
      {"name": "README.md", "type": "file", "purpose": "..."}
    ]
  },
  "apis": [
    {
      "method": "POST",
      "path": "/api/links",
      "purpose": "create a shortened URL",
      "request": {"long_url": "string", "alias": "string?"},
      "response": {"id": "uuid", "alias": "string", "short_url": "string"}
    }
  ],
  "db_schema": [
    {
      "name": "links",
      "fields": [
        {"name": "id", "type": "uuid", "constraints": ["pk"]},
        {"name": "long_url", "type": "text", "constraints": ["not_null"]}
      ],
      "indexes": ["alias"]
    }
  ],
  "modules": [
    {"name": "auth", "responsibility": "JWT issuance + verification"},
    {"name": "links", "responsibility": "CRUD for shortened URLs"}
  ]
}

Rules:
- Match the spec's tech_stack (frontend, backend, database, other).
- Keep it pragmatic — small, idiomatic, no over-engineering.
- Folder tree should reflect a real, runnable project (entrypoint, tests, configs).
- Define 3-12 APIs covering all features in the spec.
- Define 1-6 tables/collections.
- Define 2-8 modules that map to the implementation.
- NEVER output anything outside the JSON object.
"""


def _summarize_arch(arch: dict[str, Any]) -> str:
    apis = len(arch.get("apis", []))
    tables = len(arch.get("db_schema", []))
    modules = len(arch.get("modules", []))
    return f"arch: {apis} APIs · {tables} tables · {modules} modules"


class ArchitectAgent(BaseAgent):
    name = "architect"

    async def execute(self, run_id: str, **kwargs: Any) -> dict[str, Any]:  # noqa: ARG002
        run = self.state.get(run_id)
        if run is None:
            raise RuntimeError(f"unknown run_id={run_id}")
        spec = run.specification or {}
        if not spec or spec.get("mode") != "spec":
            raise RuntimeError("architect requires a finalised specification (mode=spec)")

        user_prompt = (
            "Design the system for this specification:\n\n"
            f"```json\n{_dump_spec(spec)}\n```"
        )

        arch = await self.call_groq_json(
            run_id=run_id,
            system_prompt=SYSTEM_PROMPT,
            user_prompt=user_prompt,
        )

        # Lightly defensive defaults so downstream agents don't KeyError.
        arch.setdefault("folder_structure", {"name": spec.get("project_name", "root"),
                                             "type": "dir", "children": []})
        arch.setdefault("apis", [])
        arch.setdefault("db_schema", [])
        arch.setdefault("modules", [])

        self.state.set_architecture(run_id, arch)
        summary = _summarize_arch(arch)
        self.log(run_id, summary, level="success")
        return {"summary": summary, "architecture": arch}


def _dump_spec(spec: dict[str, Any]) -> str:
    import json  # local import keeps top of file clean
    safe = {k: v for k, v in spec.items() if k not in {"clarifications", "mode"}}
    return json.dumps(safe, indent=2)
