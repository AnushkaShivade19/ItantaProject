# Project Documentation & Setup Guide

This document provides an overview of the project's architecture, its directory structure, and step-by-step instructions on how to set up and run the application on your local device.

## 🏗️ Project Structure

The project is divided into two main parts: a Python **Backend** (FastAPI) and a React **Frontend**.

```text
ItantaProject/
├── backend/                  # The core Agentic AI Framework (Python/FastAPI)
│   ├── agents/               # Implementations of various AI agents
│   ├── config/               # Configuration files (e.g., config.yaml)
│   ├── core/                 # Core logic (orchestrator, state manager, logger)
│   ├── logs/                 # System logs
│   ├── output_projects/      # Output sandbox where agents generate project files
│   ├── main.py               # Command Line Interface (CLI) entry point
│   ├── requirements.txt      # Python dependencies
│   └── server.py             # FastAPI web server application
├── frontend/                 # The User Interface (React)
│   ├── public/               # Static assets
│   ├── src/                  # React source code and components
│   ├── package.json          # Node.js dependencies and scripts
│   ├── craco.config.js       # Create React App Configuration Override (for custom builds)
│   └── tailwind.config.js    # Tailwind CSS configuration
├── memory/                   # System memory or cache storage
├── tests/                    # Project test suite
├── test_reports/             # Output directory for test results
└── test_result.md            # Markdown file containing recent test outcomes
```

### Technology Stack
- **Backend:** Python, FastAPI, Motor (Async MongoDB Driver), Groq API (for LLMs).
- **Frontend:** React, Tailwind CSS, Radix UI (for accessible components), Framer Motion, and React Router.
- **Database:** MongoDB.

---

## 🚀 How to Run the Project Locally

Follow these instructions starting from scratch to get both the backend and frontend up and running.

### Prerequisites
1. **Python 3.9+** installed on your system.
2. **Node.js (v16+) and npm** (or yarn) installed.
3. **MongoDB** installed and running locally, or a remote MongoDB URI (like MongoDB Atlas).

### Part 1: Backend Setup

1. **Navigate to the Backend Directory:**
   Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```

2. **Create a Virtual Environment (Recommended):**
   ```bash
   python -m venv venv
   ```
   Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`

3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables Configuration:**
   Create a new file named `.env` **inside the `backend` folder** (`ItantaProject/backend/.env`). Add the following keys to it:
   ```env
   MONGO_URL=mongodb://localhost:27017   # Replace with your actual Mongo URI if different
   DB_NAME=agentic_framework             # Desired database name
   GROQ_API_KEY=your_groq_api_key_here   # Your Groq API key (from your existing .env)
   ```
   *(Note: You have a `.env` file on your Desktop (`Itanta 2/.env`) with your Groq API key. You will need to copy those contents into `backend/.env` along with the MongoDB variables).*

5. **Run the Backend Server:**
   Start the FastAPI server using Uvicorn:
   ```bash
   uvicorn server:app --reload
   ```
   The backend API will now be running, typically at `http://localhost:8000`. You can view the API documentation at `http://localhost:8000/docs`.

---

### Part 2: Frontend Setup

1. **Navigate to the Frontend Directory:**
   Open a **new** terminal window (leave the backend running in the first one) and navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. **Install Node Dependencies:**
   Run the following command to download all frontend packages:
   ```bash
   npm install
   # or if you prefer yarn:
   yarn install
   ```

3. **Run the Frontend Application:**
   Start the development server:
   ```bash
   npm start
   # or:
   yarn start
   ```
   This will run `craco start` and automatically open your default web browser to the application (usually at `http://localhost:3000`).

---

### Verifying the Setup

Once both servers are running:
1. Ensure MongoDB is actively running.
2. Check the Backend terminal for any connection errors.
3. The Frontend should successfully connect to the backend APIs.
