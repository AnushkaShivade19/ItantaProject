# Agentic AI Software Development Framework — PRD

## Original Problem Statement

Build a complete "Agentic AI Software Development Framework" step-by-step.
The system must take a natural-language project specification and autonomously
generate a full working software project using multiple AI agents.

Core requirements:
- Multi-agent architecture: Intake, Architect, Planner, QA (TDD-first), Coder, Validator, Recovery
- TDD-first mandatory (failing tests first, then code)
- Ask clarifying questions → structured JSON spec → atomic plan → code → tests → retry
- Backend: Python (FastAPI)
- Output: generated code, test suite, logs, summary report
- 8 phases, strictly confirmed one at a time

## User Choices (Feb 2026)
- LLM provider: **Groq** (llama-3.3-70b smart / llama-3.1-8b fast)
- UI: **Full React dashboard** (Swiss / terminal aesthetic)
- Delivery: **Strict phased delivery** — pause after each phase
- Scope: Full-stack, any-language project generation
- ZIP download: yes (Phase 8)

## Architecture
- Backend: FastAPI (`/app/backend`), Groq async SDK, MongoDB, PyYAML, pytest, rich (CLI)
- Frontend: React 19 + Tailwind + Phosphor Icons + shadcn primitives
- Agents: `/app/backend/agents/*` (base_agent + 7 agents)
- Orchestration: `/app/backend/core/*` (orchestrator, state_manager, logger)
- Runtime config: `/app/backend/config/config.yaml`
- Output projects: `/app/backend/output_projects/<run-id>/`
- Logs: `/app/backend/logs/framework.log` + JSONL events in `logs/events/` + run snapshots in `logs/runs/`

## Phase Progress

### ✅ Phase 1 — Project Setup (2026-02-01)
Folder structure, config.yaml, CLI, FastAPI base, React dashboard shell.

### ✅ Phase 2 — Core Orchestrator (2026-02-01)
State manager with disk persistence, full run lifecycle, orchestrator run()
with retry/dry-run, structured event logging, live-polling dashboard.

### ✅ Phase 3 — Intake Agent (2026-02-01)
- **base_agent.py**: `call_groq_json()` helper with forced JSON mode, configurable model/temp/tokens, structured error logging
- **intake_agent.py**: analyzes spec, returns EITHER up-to-3 clarifying questions OR full structured JSON spec. Accumulates prior Q&A across rounds.
- **Orchestrator**: pause/resume aware — `run()` returns early on `awaiting_input`, re-entries skip already-completed agents and resume where paused
- **Server**: `POST /api/runs/{id}/answer` endpoint — stores answers, resets intake to idle, re-queues orchestrator
- **Frontend**: `ClarificationCard` (live question renderer with text/option inputs, submit-to-resume), `SpecificationCard` (renders final JSON spec with tech stack, features, constraints, acceptance criteria, clarifications preserved)
- **Verified E2E**: Real Groq calls produced clarifying questions, accepted 3 answers via `/answer`, returned full structured spec (project_name, description, features[3], tech_stack, constraints, acceptance_criteria[1]). 43 events logged.
- Version bumped to **0.3.0**; GROQ_API_KEY now configured; `/api/phases` marks Phase 3 complete, Phase 4 current.

### 🟡 Phase 4 — Architect + Planner (PENDING CONFIRMATION)
- Architect Agent: consumes `specification`, emits `architecture` (folder structure, API endpoints, DB schema)
- Planner Agent: turns architecture into atomic testable tasks list (with task_id, title, detail, dependencies)
- Dashboard additions: architecture card (tree/list view), tasks card (checklist with statuses)

### Phase 5 — QA Agent (TDD)
Failing pytest cases emitted first, one test file per task.

### Phase 6 — Coder Agent
Implementation to pass tests.

### Phase 7 — Validator + Recovery
Run pytest + lint, retry on failure, escalate to Recovery.

### Phase 8 — End-to-End Execution
Full pipeline demo, ZIP download, summary report.

## Known Pending / Gaps
- Agents architect/planner/qa/coder/validator/recovery still raise NotImplementedError (intentional; dry-run skip).

## Next Actions
1. Await user confirmation to proceed with **Phase 4 — Architect + Planner**.
