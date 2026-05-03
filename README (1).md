# ItantaProject

> An agentic AI framework that orchestrates a pipeline of specialized AI agents to autonomously plan, architect, code, validate, and recover software projects — driven by a single natural language spec.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

---

## Overview

ItantaProject is a two-part application consisting of a **FastAPI backend** that runs an agentic AI pipeline and a **React frontend** that provides a real-time dashboard to monitor agent activity, logs, and generated project files.

You describe a software project in plain English. The system's agent pipeline — Intake → Architect → Planner → Coder → QA → Validator → Recovery — handles the rest.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      React Frontend                      │
│          Dashboard · Agent Visualizer · Log Terminal     │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP / WebSocket
┌───────────────────────▼─────────────────────────────────┐
│                   FastAPI Backend                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Orchestrator (core/)                │   │
│  │                                                  │   │
│  │  Intake → Architect → Planner → Coder →          │   │
│  │  QA → Validator → Recovery                       │   │
│  └──────────────────────────────────────────────────┘   │
│                        │                                 │
│              Groq API (LLM calls)                        │
└───────────────────────┬─────────────────────────────────┘
                        │
                   MongoDB
```

---

## Tech Stack

| Layer     | Technology                                              |
|-----------|---------------------------------------------------------|
| Backend   | Python 3.11+, FastAPI, Uvicorn, Motor (async MongoDB)   |
| LLM       | Groq API                                                |
| Database  | MongoDB                                                 |
| Frontend  | React, Tailwind CSS, Radix UI, Framer Motion, CRACO     |

---

## Prerequisites

Make sure the following are installed before you begin:

- **Python 3.11+**
- **Node.js 18+** and **npm** (or **Yarn**)
- **MongoDB** — local instance or a remote URI (e.g. MongoDB Atlas)
- **A Groq API key** — get one at [console.groq.com](https://console.groq.com)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/ItantaProject.git
cd ItantaProject
```

---

### 2. Backend Setup

```bash
# Navigate to the backend folder
cd backend

# Create and activate a virtual environment
python -m venv .venv

# macOS / Linux
source .venv/bin/activate

# Windows (PowerShell)
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

#### Configure environment variables

Create a `.env` file inside the `backend/` folder:

```bash
# backend/.env

MONGO_URL=mongodb://localhost:27017
DB_NAME=agentic_framework
GROQ_API_KEY=your_groq_api_key_here
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

#### Start the backend server

```bash
uvicorn server:app --reload --host 127.0.0.1 --port 8000
```

Verify it's running: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

Interactive API docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### 3. Frontend Setup

Open a **new terminal window** (keep the backend running).

```bash
# Navigate to the frontend folder
cd frontend

# Install dependencies
yarn install
# or: npm install

# Start the development server
yarn start
# or: npm start
```

The app will open automatically at [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable        | Required | Description                                      |
|-----------------|----------|--------------------------------------------------|
| `MONGO_URL`     | ✅       | MongoDB connection string                        |
| `DB_NAME`       | ✅       | MongoDB database name                            |
| `GROQ_API_KEY`  | ✅       | Your Groq API key for LLM calls                  |
| `CORS_ORIGINS`  | ✅       | Comma-separated list of allowed frontend origins |

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## Running the App

Both the backend and frontend must be running simultaneously.

| Service   | Command                                     | URL                          |
|-----------|---------------------------------------------|------------------------------|
| Backend   | `uvicorn server:app --reload` (in backend/) | http://127.0.0.1:8000        |
| Frontend  | `yarn start` (in frontend/)                 | http://localhost:3000        |
| API Docs  | —                                           | http://127.0.0.1:8000/docs   |

You can also trigger the agent pipeline via the CLI:

```bash
# From the project root
python -m backend.main run "Build a REST API for a todo app with authentication"
python -m backend.main status
python -m backend.main config
```

---

## Project Structure

```
ItantaProject/
├── backend/
│   ├── agents/             # Individual agent implementations
│   ├── config/             # Configuration files (config.yaml)
│   ├── core/               # Orchestrator, state manager, logger
│   ├── logs/               # Runtime logs
│   ├── output_projects/    # Agent-generated project files
│   ├── main.py             # CLI entry point
│   ├── server.py           # FastAPI application
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/                # React components and pages
│   ├── package.json
│   ├── craco.config.js
│   └── tailwind.config.js
├── memory/                 # System memory / cache
├── tests/                  # Test suite
├── test_reports/           # Test output
└── README.md
```

---

## Available Scripts

### Backend

```bash
# Run server (from backend/)
uvicorn server:app --reload

# Run tests
pytest

# CLI commands (from project root)
python -m backend.main run "<project spec>"
python -m backend.main status
python -m backend.main config
```

### Frontend

```bash
# Start dev server
yarn start

# Build for production
yarn build

# Run tests
yarn test
```

---

## API Reference

| Method | Endpoint          | Description                        |
|--------|-------------------|------------------------------------|
| GET    | `/api/health`     | Health check                       |
| POST   | `/api/run`        | Submit a new project spec          |
| GET    | `/api/status`     | Get current pipeline status        |
| GET    | `/api/logs`       | Fetch recent log entries           |
| GET    | `/api/projects`   | List generated output projects     |

Full interactive docs available at `/docs` when the backend is running.

---

## Troubleshooting

**Frontend can't reach the backend**
- Confirm backend is running on `127.0.0.1:8000`
- Check that `CORS_ORIGINS` in `backend/.env` includes `http://localhost:3000`

**MongoDB connection error**
- Ensure MongoDB is running locally (`mongod`) or your Atlas URI is correct
- Verify the `MONGO_URL` value in `backend/.env`

**Package installation fails**
- Backend: confirm Python 3.11+ with `python --version`
- Frontend: confirm Node.js 18+ with `node --version` and Yarn with `yarn --version`

**Groq API errors**
- Double-check your `GROQ_API_KEY` value in `backend/.env`
- Ensure the key has not expired and has sufficient quota

---

## License

This project is private and proprietary. All rights reserved.
