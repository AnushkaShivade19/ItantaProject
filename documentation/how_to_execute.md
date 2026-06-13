# Execution Guide

This document outlines the standard operating procedures for initializing and executing the Agentic AI Software Development Framework. The system is composed of a FastAPI Python backend and a React-based frontend dashboard. Both environments must be active for the system to operate correctly.

---

## 1. Initializing the Backend Server

The backend orchestration server requires Python and operates within an isolated virtual environment. 

### Windows Instructions
```bash
cd backend
.venv\Scripts\activate
uvicorn server:app --host 0.0.0.0 --port 8000
```

### macOS / Linux Instructions
```bash
cd backend
source .venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8000
```

*Note: Ensure your environment variables (e.g., API keys, database connections) are properly configured in the backend `.env` file before starting the server.*

---

## 2. Initializing the Frontend Dashboard

The user interface relies on a standard Node.js ecosystem.

```bash
cd frontend
npm install
npm run start
```

Upon successful initialization, the development server will launch, and the interactive dashboard will be accessible via your default web browser at `http://localhost:3000`.

---

## 3. Executing an Autonomous Pipeline

Once the system is online, follow these steps to trigger the AI generation pipeline:

1. **Submit a Specification**: Navigate to the Dashboard's Intake UI. Provide a high-level natural language description of the application you wish to build (e.g., *"Build a responsive web-based calculator using HTML, CSS, and vanilla Javascript"*).
2. **Resolve Clarifications**: The **Intake Agent** will parse the specification. If any requirements are ambiguous, it will pause execution and prompt you with clarifying questions. Provide answers to resume the pipeline.
3. **Autonomous Execution**: The framework will sequentially engage its agent roster:
   - **Architect Agent**: Designs the system layout and component hierarchy.
   - **Planner Agent**: Synthesizes the architecture into a list of atomic, sequential tasks.
   - **QA Agent**: Enforces Test-Driven Development (TDD) by generating failing test files corresponding to the planned tasks.
   - **Coder Agent**: Authors the production logic required to fulfill the test assertions.
   - **Validator Agent**: Automatically executes the test suite (supporting dynamic test runners like `pytest` and `jest`).
4. **Review & Validation**: Upon completion, the finalized codebase can be reviewed in the **Code Files** tab. The raw test outputs are displayed in the **Validator** tab, and the running application is rendered interactively within the **Live Preview** tab.
