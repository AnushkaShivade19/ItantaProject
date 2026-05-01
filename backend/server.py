"""
FastAPI backend — exposes the Agentic Framework over HTTP.

Phase 1: surface configuration, pipeline metadata, and run list so
the React dashboard can render. Later phases add POST /runs, SSE log
streaming, and ZIP downloads.
"""
from __future__ import annotations

import logging
import os
from datetime import datetime, timezone
from pathlib import Path

import yaml
from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict
from starlette.middleware.cors import CORSMiddleware

from core.orchestrator import Orchestrator
from core.state_manager import state_manager

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# ---- Mongo ----
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# ---- App + router ----
app = FastAPI(title="Agentic AI Framework", version="0.1.0")
api_router = APIRouter(prefix="/api")

# ---- Config loader (reads at startup; reloadable via endpoint) ----
CONFIG_PATH = ROOT_DIR / "config" / "config.yaml"


def _load_config() -> dict:
    with CONFIG_PATH.open("r", encoding="utf-8") as fh:
        return yaml.safe_load(fh)


_config_cache: dict = _load_config()
orchestrator = Orchestrator(state=state_manager)


# ================= Models =================
class HealthResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    status: str
    framework: str
    version: str
    phase: str
    groq_key_configured: bool
    timestamp: str


class PhaseInfo(BaseModel):
    id: str
    title: str
    status: str  # complete | current | pending
    description: str


class PipelineNode(BaseModel):
    name: str
    label: str
    desc: str


class AgentSpec(BaseModel):
    name: str
    model: str
    temperature: float
    description: str


# ================= Endpoints =================
@api_router.get("/")
async def root():
    return {"message": "Agentic AI Framework — Phase 1 scaffold online."}


@api_router.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="ok",
        framework=_config_cache["framework"]["name"],
        version=_config_cache["framework"]["version"],
        phase="phase-1-setup",
        groq_key_configured=bool(os.environ.get("GROQ_API_KEY")),
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


@api_router.get("/config")
async def get_config():
    """Return the sanitised config (secrets already live in env)."""
    return _config_cache


@api_router.post("/config/reload")
async def reload_config():
    global _config_cache  # noqa: PLW0603
    _config_cache = _load_config()
    return {"reloaded": True, "framework": _config_cache["framework"]}


@api_router.get("/pipeline", response_model=list[PipelineNode])
async def get_pipeline():
    return [PipelineNode(**node) for node in orchestrator.describe_pipeline()]


@api_router.get("/agents", response_model=list[AgentSpec])
async def list_agents():
    return [AgentSpec(name=name, **spec) for name, spec in _config_cache["agents"].items()]


@api_router.get("/phases")
async def list_phases():
    """Static metadata about the 8 implementation phases (for dashboard)."""
    return [
        PhaseInfo(id="phase-1-setup", title="Project Setup",
                  status="complete", description="Folders, deps, config, CLI, dashboard shell").model_dump(),
        PhaseInfo(id="phase-2-orchestrator", title="Core Orchestrator",
                  status="current", description="State manager + workflow wiring + logging").model_dump(),
        PhaseInfo(id="phase-3-intake", title="Intake Agent",
                  status="pending", description="Clarifying questions, structured spec JSON").model_dump(),
        PhaseInfo(id="phase-4-architect-planner", title="Architect + Planner",
                  status="pending", description="System design + atomic tasks").model_dump(),
        PhaseInfo(id="phase-5-qa", title="QA Agent (TDD)",
                  status="pending", description="Failing pytest cases first").model_dump(),
        PhaseInfo(id="phase-6-coder", title="Coder Agent",
                  status="pending", description="Implementation to pass tests").model_dump(),
        PhaseInfo(id="phase-7-validator-recovery", title="Validator + Recovery",
                  status="pending", description="Run tests, lint, retry with feedback").model_dump(),
        PhaseInfo(id="phase-8-e2e", title="End-to-End Execution",
                  status="pending", description="Full pipeline demo + summary report").model_dump(),
    ]


@api_router.get("/runs")
async def list_runs():
    """Empty until Phase 3. Shape is stable so frontend can render now."""
    return {"runs": [r.model_dump() for r in state_manager.list()]}


# ---- wire router + CORS ----
app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
