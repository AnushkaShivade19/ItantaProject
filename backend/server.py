"""
FastAPI backend — exposes the Agentic Framework over HTTP.

Phase 2: full run lifecycle endpoints + event streaming (via polling).
"""
from __future__ import annotations

import asyncio
import logging
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import yaml
from dotenv import load_dotenv
from fastapi import APIRouter, BackgroundTasks, FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict
from starlette.middleware.cors import CORSMiddleware

from core.logger import event, read_events, read_events_since
from core.orchestrator import Orchestrator
from core.state_manager import RunStatus, state_manager

ROOT_DIR: Path = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# ---- Mongo ----
mongo_url: str = os.environ["MONGO_URL"]
client: AsyncIOMotorClient = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# ---- App + router ----
app: FastAPI = FastAPI(title="Agentic AI Framework", version="0.2.0")
api_router: APIRouter = APIRouter(prefix="/api")

# ---- Config loader ----
CONFIG_PATH: Path = ROOT_DIR / "config" / "config.yaml"


def _load_config() -> dict[str, Any]:
    with CONFIG_PATH.open("r", encoding="utf-8") as fh:
        return yaml.safe_load(fh)


_config_cache: dict[str, Any] = _load_config()
orchestrator: Orchestrator = Orchestrator(state=state_manager, config=_config_cache)


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


class ReloadResponse(BaseModel):
    reloaded: bool
    framework: dict[str, Any]


class RootResponse(BaseModel):
    message: str


class RunsResponse(BaseModel):
    runs: list[dict[str, Any]]


class CreateRunRequest(BaseModel):
    spec_input: str = ""


class CreateRunResponse(BaseModel):
    run: dict[str, Any]


class StartRunResponse(BaseModel):
    started: bool
    run_id: str


class RunDetailResponse(BaseModel):
    run: dict[str, Any]
    events: list[dict[str, Any]]


# ================= Endpoints =================
@api_router.get("/", response_model=RootResponse)
async def root() -> RootResponse:
    return RootResponse(message="Agentic AI Framework — Phase 2 orchestrator online.")


@api_router.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        framework=_config_cache["framework"]["name"],
        version=_config_cache["framework"]["version"],
        phase="phase-2-orchestrator",
        groq_key_configured=bool(os.environ.get("GROQ_API_KEY")),
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


@api_router.get("/config")
async def get_config() -> dict[str, Any]:
    return _config_cache


@api_router.post("/config/reload", response_model=ReloadResponse)
async def reload_config() -> ReloadResponse:
    global _config_cache, orchestrator  # noqa: PLW0603
    _config_cache = _load_config()
    orchestrator = Orchestrator(state=state_manager, config=_config_cache)
    return ReloadResponse(reloaded=True, framework=_config_cache["framework"])


@api_router.get("/pipeline", response_model=list[PipelineNode])
async def get_pipeline() -> list[PipelineNode]:
    return [PipelineNode(**node) for node in orchestrator.describe_pipeline()]


@api_router.get("/agents", response_model=list[AgentSpec])
async def list_agents() -> list[AgentSpec]:
    return [AgentSpec(name=name, **spec) for name, spec in _config_cache["agents"].items()]


@api_router.get("/phases", response_model=list[PhaseInfo])
async def list_phases() -> list[PhaseInfo]:
    return [
        PhaseInfo(id="phase-1-setup", title="Project Setup",
                  status="complete", description="Folders, deps, config, CLI, dashboard shell"),
        PhaseInfo(id="phase-2-orchestrator", title="Core Orchestrator",
                  status="complete",
                  description="State manager + workflow wiring + event logging"),
        PhaseInfo(id="phase-3-intake", title="Intake Agent",
                  status="current",
                  description="Clarifying questions, structured spec JSON"),
        PhaseInfo(id="phase-4-architect-planner", title="Architect + Planner",
                  status="pending", description="System design + atomic tasks"),
        PhaseInfo(id="phase-5-qa", title="QA Agent (TDD)",
                  status="pending", description="Failing pytest cases first"),
        PhaseInfo(id="phase-6-coder", title="Coder Agent",
                  status="pending", description="Implementation to pass tests"),
        PhaseInfo(id="phase-7-validator-recovery", title="Validator + Recovery",
                  status="pending", description="Run tests, lint, retry with feedback"),
        PhaseInfo(id="phase-8-e2e", title="End-to-End Execution",
                  status="pending", description="Full pipeline demo + summary report"),
    ]


# ---------------- Run lifecycle ----------------
@api_router.get("/runs", response_model=RunsResponse)
async def list_runs() -> RunsResponse:
    return RunsResponse(runs=[r.model_dump(mode="json") for r in state_manager.list()])


@api_router.post("/runs", response_model=CreateRunResponse)
async def create_run(req: CreateRunRequest) -> CreateRunResponse:
    run = state_manager.create(spec_input=req.spec_input)
    return CreateRunResponse(run=run.model_dump(mode="json"))


@api_router.post("/runs/{run_id}/start", response_model=StartRunResponse)
async def start_run(run_id: str, background_tasks: BackgroundTasks) -> StartRunResponse:
    run = state_manager.get(run_id)
    if run is None:
        raise HTTPException(status_code=404, detail="run not found")
    if run.status == RunStatus.running:
        raise HTTPException(status_code=409, detail="run already in progress")
    background_tasks.add_task(_execute_run, run_id)
    return StartRunResponse(started=True, run_id=run_id)


@api_router.get("/runs/{run_id}", response_model=RunDetailResponse)
async def get_run(run_id: str, since: str | None = None) -> RunDetailResponse:
    run = state_manager.get(run_id)
    if run is None:
        raise HTTPException(status_code=404, detail="run not found")
    events = read_events_since(run_id, since) if since else read_events(run_id)
    return RunDetailResponse(run=run.model_dump(mode="json"), events=events)


# ---------------- Background execution ----------------
async def _execute_run(run_id: str) -> None:
    try:
        await orchestrator.run(run_id)
    except asyncio.CancelledError:
        event(run_id, "warn", "orchestrator", "run cancelled")
        raise
    except Exception as exc:  # noqa: BLE001
        event(run_id, "error", "orchestrator", f"fatal: {exc}")
        state_manager.update_run(run_id, status=RunStatus.failed)


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
logger: logging.Logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client() -> None:
    client.close()
