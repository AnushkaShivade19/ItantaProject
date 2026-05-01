# Agentic AI Software Development Framework — PRD

## Original Problem Statement
Build an "Agentic AI Software Development Framework" that takes a natural-language
project specification and autonomously generates a working software project using
multiple AI agents. TDD-first. 8 phases, strictly confirmed one at a time.

## User Choices (Feb 2026)
- LLM provider: **Groq** (llama-3.3-70b smart / llama-3.1-8b fast)
- UI: **Full React dashboard** (Swiss / terminal aesthetic)
- Delivery: Strict phased delivery
- Scope: Full-stack, any-language project generation
- ZIP download: yes (Phase 8)

## Architecture
- Backend: FastAPI, Groq async SDK, MongoDB, PyYAML, pytest
- Frontend: React 19 + Tailwind + Phosphor Icons + shadcn primitives
- Agents: `/app/backend/agents/*` (base + 7 agents)
- Orchestration: `/app/backend/core/*` (orchestrator, state_manager, logger)
- Logs: `logs/framework.log` + per-run JSONL events + run snapshots

## Phase Progress

### ✅ Phase 1 — Project Setup (2026-02-01)
Folder structure, config.yaml, CLI, FastAPI base, React dashboard shell.

### ✅ Phase 2 — Core Orchestrator (2026-02-01)
State manager with disk persistence, run lifecycle, retry policy, dry-run skip,
event logging, live-polling dashboard.

### ✅ Phase 3 — Intake Agent (2026-02-01)
Real Groq calls with forced JSON mode. Multi-round clarification loop.
Pause/resume orchestrator (`awaiting_input` status). Frontend ClarificationCard
+ SpecificationCard.

### ✅ Phase 4 — Architect + Planner (2026-02-01)
- **Architect Agent**: consumes `specification` → emits architecture JSON with
  `folder_structure` (recursive tree), `apis` (HTTP method/path/purpose/req/resp),
  `db_schema` (tables/fields/indexes), `modules` (name/responsibility).
- **Planner Agent**: consumes spec + architecture → emits 6-15 atomic tasks with
  `id`, `title`, `detail`, `depends_on`, `files`, `test_focus`. Each task is
  small, testable, file-scoped.
- **State extension**: `Task` model gained `depends_on`, `files`, `test_focus`
  fields (preserved across disk persistence).
- **Frontend**: `ArchitectureCard` (collapsible tree, API list with method colour
  coding, table cards with field types/indexes, module chips), `TaskListCard`
  (expandable rows showing detail + test_focus + files + dependency graph).
- **Babel workaround**: replaced recursive `FolderNode` with iterative `flattenTree`
  helper after hitting `Maximum call stack size exceeded` in babel-traverse.
- **Verified E2E** with `noterly` spec: 7 APIs, 1 table, 4 modules, 19 tree rows,
  9 atomic tasks generated. Run completes in ~5s (post-warmup).
- Version bumped to **0.4.0**; `/api/phases` reflects Phase 4 complete, Phase 5 current.

### 🟡 Phase 5 — QA Agent (TDD) (PENDING CONFIRMATION)
For each task, generate FAILING pytest test cases first. Tests must cover the
`test_focus` declared by the planner.

### Phase 6 — Coder Agent
Implementation to pass the QA tests.

### Phase 7 — Validator + Recovery
Run pytest + lint, retry on failure, escalate to Recovery.

### Phase 8 — End-to-End Execution
Full pipeline demo, ZIP download, summary report.

## Known Pending / Gaps
- QA/Coder/Validator/Recovery agents still raise NotImplementedError (intentional).
- First Groq call after backend restart can take 60-90s due to occasional rate-limit
  retry; subsequent calls are fast (≤5s for full architect+planner run).

## Next Actions
Await user confirmation to proceed with **Phase 5 — QA Agent (TDD)**.
