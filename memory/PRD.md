# Agentic AI Software Development Framework — PRD

## Original Problem Statement
Multi-agent autonomous software-generation framework. Natural-language spec →
clarifications → architecture → atomic tasks → failing pytest → implementation →
validation → ZIP export. TDD-FIRST is mandatory. 8 phases, strictly confirmed
one at a time.

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
- Orchestration: `/app/backend/core/*`
- Output projects: `/app/backend/output_projects/<run_id>/`
- Logs: framework.log + per-run JSONL events + run snapshots

## Phase Progress

### ✅ Phase 1 — Project Setup (2026-02-01)
### ✅ Phase 2 — Core Orchestrator (2026-02-01)
### ✅ Phase 3 — Intake Agent (2026-02-01)
### ✅ Phase 4 — Architect + Planner (2026-02-01)

### ✅ Phase 5 — QA Agent (TDD-FIRST) (2026-02-01)
- **QA Agent**: iterates over planner tasks, asks Groq (forced JSON) for a
  pytest test file per task. Each test file imports the (yet-to-exist) modules
  from `task.files`, asserts behaviour from `task.test_focus`, includes 2-4
  test functions covering happy path + edge cases, mocks externals via
  `unittest.mock` (no extra packages).
- **Persistence**: writes to `output_projects/<run_id>/tests/test_<task_id>.py`.
  Updates `task.test_file_path` and marks `task.status = in_progress`.
- **State extension**: Task gained `test_file_path`, `code_file_paths` fields.
  StateManager gained `set_task_test_file()`, `set_task_code_files()` methods.
- **Server**: new `GET /api/runs/{id}/file?path=...` with sandbox enforcement
  (paths constrained to `output_projects/<run_id>/`).
- **Frontend**: `TestSuiteCard` (TDD badge, file count, expandable rows, lazy
  code load on expand, terminal-style code preview). TaskListCard rows show
  `in_progress` status for tasks with tests.
- **Verified TDD-first behaviour**: ran `pytest` on a generated test file — it
  fails with `ModuleNotFoundError: No module named 'models'` (because Coder
  hasn't built it yet). EXACTLY the TDD philosophy. 8-9 tests per project,
  ~80 events per run.
- Version **0.5.0**; Phase 5 complete in `/api/phases`, Phase 6 current.

### 🟡 Phase 6 — Coder Agent (PENDING CONFIRMATION)
For each task, generate implementation code that makes the QA tests pass.
Write under `output_projects/<run_id>/<file_path>` matching the
architecture's folder structure.

### Phase 7 — Validator + Recovery
Run pytest + lint, retry on failure, escalate to Recovery.

### Phase 8 — End-to-End Execution
Full pipeline demo, ZIP download, summary report.

## Known Pending / Gaps
- Coder/Validator/Recovery agents still raise NotImplementedError (intentional).
- First Groq call after backend restart can take 60-90s due to occasional
  rate-limit retry; subsequent calls fast (~30-50s for full 5-agent run).

## Next Actions
Await user confirmation to proceed with **Phase 6 — Coder Agent**.
