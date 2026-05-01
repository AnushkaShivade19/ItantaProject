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
- ZIP download: yes

## Architecture
- Backend: FastAPI (`/app/backend`), Groq SDK, MongoDB, PyYAML, pytest, rich (CLI)
- Frontend: React 19 + Tailwind + Phosphor Icons + shadcn primitives
- Agents live in `/app/backend/agents/*`; orchestration in `/app/backend/core/*`
- Runtime config: `/app/backend/config/config.yaml`
- Output projects: `/app/backend/output_projects/<run-id>/`
- Logs: `/app/backend/logs/framework.log` + JSONL event streams in `logs/events/`

## Personas
- Solo indie dev who wants to scaffold a microservice from a 1-paragraph brief
- Engineering lead prototyping an idea before handing to the team
- Educator demonstrating agentic AI / TDD workflows

## Phase Progress

### ✅ Phase 1 — Project Setup (2026-02-01)
- Folder structure: `agents/`, `core/`, `config/`, `logs/`, `output_projects/`
- `config.yaml` with LLM + retry + guardrail settings
- `main.py` CLI entry (`run`, `status`, `config` subcommands) with rich output
- `core/state_manager.py` (RunState, AgentState, singleton)
- `core/orchestrator.py` (scaffold — `run()` is NotImplementedError)
- `core/logger.py` (file + JSONL event logger)
- `agents/base_agent.py` (abstract contract, Groq key helper)
- 7 agent placeholder classes (all raise NotImplementedError for later phases)
- FastAPI endpoints: `/api/health`, `/api/config`, `/api/pipeline`, `/api/agents`, `/api/phases`, `/api/runs`
- React dashboard shell: Header, Sidebar, PhaseBanner, AgentPipeline, ConfigPanel, LogTerminal
- Fonts loaded: Cabinet Grotesk (heading), IBM Plex Sans (body), JetBrains Mono (code)
- GROQ key status indicator in header
- `backend/.env` adds `GROQ_API_KEY=""` (user to fill before Phase 3)

### 🟡 Phase 2 — Core Orchestrator (PENDING CONFIRMATION)
- Wire workflow: Intake → Architect → Planner → QA → Coder → Validator → Recovery
- Per-run state persistence
- Real-time event streaming endpoint (SSE) for dashboard logs
- Run lifecycle API: POST `/api/runs`, GET `/api/runs/{id}`, GET `/api/runs/{id}/events`

### Phase 3 — Intake Agent
- Groq call, clarifying questions, emits `specification` JSON
- Dashboard: spec editor enabled, clarification chat

### Phase 4 — Architect + Planner
- System design (folders, APIs, DB schema)
- Atomic testable tasks

### Phase 5 — QA Agent (TDD)
- Failing pytest cases first

### Phase 6 — Coder Agent
- Implementation to pass tests

### Phase 7 — Validator + Recovery
- Run pytest + lint, retry on failure, escalate to Recovery

### Phase 8 — End-to-End Execution
- Full pipeline demo, ZIP download, summary report

## Known Pending / Gaps
- **GROQ_API_KEY is empty** — dashboard header reflects this. User must add before Phase 3.
- Orchestrator `run()` raises NotImplementedError (intentional, Phase 2).

## Next Actions
1. Await user confirmation to proceed with **Phase 2 — Core Orchestrator**.
2. Add Groq API key to `/app/backend/.env` at any time before Phase 3.
