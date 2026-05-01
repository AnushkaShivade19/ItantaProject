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
- Backend: FastAPI (`/app/backend`), Groq SDK, MongoDB, PyYAML, pytest, rich (CLI)
- Frontend: React 19 + Tailwind + Phosphor Icons + shadcn primitives
- Agents: `/app/backend/agents/*` (base_agent + 7 placeholders)
- Orchestration: `/app/backend/core/*` (orchestrator, state_manager, logger)
- Runtime config: `/app/backend/config/config.yaml`
- Output projects: `/app/backend/output_projects/<run-id>/`
- Logs: `/app/backend/logs/framework.log` + JSONL events in `logs/events/` + run snapshots in `logs/runs/`

## Personas
- Solo indie dev who wants to scaffold a microservice from a 1-paragraph brief
- Engineering lead prototyping an idea before handing to the team
- Educator demonstrating agentic AI / TDD workflows

## Phase Progress

### ✅ Phase 1 — Project Setup (2026-02-01)
- Folder structure, config.yaml, CLI (`main.py`), empty agent placeholders
- FastAPI base endpoints: `/health`, `/config`, `/pipeline`, `/agents`, `/phases`, `/runs`
- React dashboard shell (Header, Sidebar, PhaseBanner, AgentPipeline, ConfigPanel, LogTerminal)

### ✅ Phase 2 — Core Orchestrator (2026-02-01)
- **State manager** with per-mutation disk persistence (`logs/runs/{run_id}.json`), automatic event emission, full setters (`set_specification`, `add_task`, `mark_task`, `set_test_results`, `set_summary`, `mark_agent`)
- **Orchestrator.run()** — iterates all 7 agents, respects retry policy (`max_attempts`, `backoff_seconds`, `hard_fail_after`), catches `NotImplementedError` → marks agent `skipped` (Phase 2 dry-run)
- **AgentStatus.skipped** enum + CSS state for muted skipped visualisation
- **Logging**: every state mutation emits a structured event via `core.logger.event()` → JSONL events + framework.log
- **New endpoints**: `POST /api/runs`, `POST /api/runs/{id}/start` (background task), `GET /api/runs/{id}?since=` (polling)
- **Frontend**: `SpecEditor` component (working launch button with sample pills), `RunSummary` (live run state panel), `useActiveRun` hook (polls every 700ms, stops on terminal state), live event stream merged into log terminal
- **Verified E2E**: POST spec → run completes in ~2s → all 7 agents `skipped` → 26 events logged → dashboard updates live
- Version bumped to **0.2.0**; `/api/phases` reflects Phase 1+2 complete, Phase 3 current

### 🟡 Phase 3 — Intake Agent (PENDING CONFIRMATION)
- Real Groq LLM calls: clarifying questions loop, structured JSON spec emission
- Requires GROQ_API_KEY in `/app/backend/.env`
- Dashboard: spec editor evolves into chat-style clarification UI

### Phase 4 — Architect + Planner
- System design (folders, APIs, DB schema) + atomic testable tasks

### Phase 5 — QA Agent (TDD)
- Failing pytest cases emitted first

### Phase 6 — Coder Agent
- Implementation to pass tests

### Phase 7 — Validator + Recovery
- Run pytest + lint, retry on failure, escalate to Recovery

### Phase 8 — End-to-End Execution
- Full pipeline demo, ZIP download, summary report

## Known Pending / Gaps
- **GROQ_API_KEY is empty** in `/app/backend/.env`. Dashboard header shows amber "unset". Required before Phase 3.
- All 7 agent `execute()` methods still raise NotImplementedError — intentional until their owning phase.

## Next Actions
1. Await user confirmation to proceed with **Phase 3 — Intake Agent**.
2. Add Groq API key to `/app/backend/.env` before Phase 3 starts.
