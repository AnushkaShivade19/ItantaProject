# Agentic AI Project Framework

This repository contains an **Agentic AI Software Development Framework**—a robust, multi-agent system designed to accept natural-language project specifications and autonomously drive the entire software development lifecycle. The framework coordinates specialized AI agents to clarify requirements, design architecture, generate test-driven code, run automated tests, and produce a verified codebase.

---

## 1. Problem Statement

Modern AI coding assistants significantly accelerate individual developer productivity by generating syntactically correct code snippets on command. However, these tools are fundamentally *reactive*. A human developer must manually decompose projects, provide step-by-step instructions, validate outputs, and integrate disparate pieces.

**The goal of this hackathon project is to introduce a proactive orchestration layer.** 

We aimed to design an Agentic Framework that can:
- Parse ambiguous, high-level project specifications.
- Autonomously ask targeted, clarifying questions to eliminate uncertainty.
- Decompose complex systems into ordered, atomic implementation tasks.
- Delegate tasks to specialized AI agents while enforcing Test-Driven Development (TDD).
- Autonomously validate generated code against automated test suites.
- Perform intelligent failure recovery before escalating to human engineers.

This framework shifts AI from a "coding assistant" into a "software engineering team," executing long-horizon tasks across multiple subsystems with high engineering rigor.

---

## 2. Project Structure

The repository is modularly designed with a backend orchestration server and a modern React frontend dashboard:

```text
/
├── backend/                       # Python FastAPI Backend
│   ├── agents/                    # Core AI Agents (Intake, Planner, QA, Coder, Validator, etc.)
│   ├── core/                      # Orchestrator & State Management
│   ├── output_projects/           # Directory where generated projects are saved and executed
│   ├── main.py & server.py        # Entry points for the FastAPI application
│   └── requirements.txt           # Python dependencies
│
├── frontend/                      # React User Interface
│   ├── src/                       # React source components (Dashboard, Tabs, Preview, etc.)
│   ├── package.json               # Node.js dependencies
│   └── ...
│
├── documentation/                 # Comprehensive Project Documentation
│   ├── PRD.md                     # Product Requirements Document & Project Milestones
│   ├── problem_statement.md       # Original detailed Hackathon Problem Statement
│   ├── execution_graph.md         # Visual/Textual Graph of Agent Interactions
│   └── how_to_execute.md          # Step-by-step guide to running the backend and frontend
│
├── docker-compose.yml             # Containerization instructions
└── README.md                      # This file
```

---

## 3. What Was Solved & Enhanced

During the development and debugging of this framework, several critical fixes and improvements were introduced to ensure cross-stack functionality and repository hygiene:

1. **Cross-Language Validation Support (The "Validator Test" Fix)**
   - **The Problem**: The `Validator Agent` was originally hardcoded to exclusively run `pytest`. When the framework was tasked with building frontend Javascript/React applications (e.g., a web-based calculator), the QA agent correctly generated `Jest` tests (`*.test.js`). However, the Validator Agent still blindly ran `pytest`, which detected zero Python tests, causing the validation to artificially fail and blocking the successful presentation of the Live Preview.
   - **The Solution**: The `validator_agent.py` was refactored to dynamically detect the test ecosystem. It now natively detects `.py` files and executes `pytest`, while detecting `.js` and `.jsx` files and dynamically executing `npx jest --passWithNoTests`. This ensures that frontend generation is accurately evaluated and passed, successfully populating the **Live Preview** tab with functional results.

2. **Extensive Codebase Cleanup**
   - Removed duplicate, unneeded virtual environments (such as the redundant `backend/venv/` vs `backend/.venv/`).
   - Cleaned out residual testing artifacts and scratch scripts from the repository root (e.g., `test_models.py`, `test_result.md`, `test_reports/`, `temp.json`, etc.).
   - Purged all unneeded `__pycache__` directories to keep the source tree pristine.

3. **Documentation Consolidation**
   - Restructured scattered root-level markdown and docx files into a dedicated and unified `/documentation` directory.
   - Separated distinct knowledge into dedicated, easy-to-read files (`PRD.md`, `problem_statement.md`, `execution_graph.md`, and `how_to_execute.md`), leaving the README to concisely explain the project overview.
