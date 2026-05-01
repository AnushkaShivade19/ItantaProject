"""
Structured logger for the Agentic Framework.

Writes human-readable lines to logs/framework.log AND appends JSONL
events to logs/events/<run_id>.jsonl (one per run) for later replay
by the dashboard.
"""
from __future__ import annotations

import json
import logging
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).parent.parent
LOGS_DIR = ROOT / "logs"
EVENTS_DIR = LOGS_DIR / "events"
LOGS_DIR.mkdir(parents=True, exist_ok=True)
EVENTS_DIR.mkdir(parents=True, exist_ok=True)

_LOG_PATH = LOGS_DIR / "framework.log"

_ALLOWED_PY_LEVELS = {"info", "warning", "error", "debug"}


def _root_logger() -> logging.Logger:
    logger = logging.getLogger("agentic")
    if logger.handlers:
        return logger
    logger.setLevel(logging.INFO)
    fmt = logging.Formatter("%(asctime)s | %(levelname)-5s | %(name)s | %(message)s")

    fh = logging.FileHandler(_LOG_PATH, encoding="utf-8")
    fh.setFormatter(fmt)
    logger.addHandler(fh)

    sh = logging.StreamHandler(sys.stdout)
    sh.setFormatter(fmt)
    logger.addHandler(sh)
    return logger


log = _root_logger()


def _events_file(run_id: str) -> Path:
    return EVENTS_DIR / f"{run_id}.jsonl"


def event(run_id: str, level: str, agent: str, message: str, **extra: Any) -> dict[str, Any]:
    """Emit a structured event — logs to stdout + events file + returns dict."""
    ev: dict[str, Any] = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "run_id": run_id,
        "level": level,
        "agent": agent,
        "message": message,
        **extra,
    }
    py_level = level.lower() if level.lower() in _ALLOWED_PY_LEVELS else "info"
    getattr(log, py_level)(f"[{run_id[:8]}][{agent}] {message}")
    with _events_file(run_id).open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(ev) + "\n")
    return ev


def read_events(run_id: str) -> list[dict[str, Any]]:
    path = _events_file(run_id)
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8") as fh:
        return [json.loads(line) for line in fh if line.strip()]


def read_events_since(run_id: str, since_ts: str | None = None) -> list[dict[str, Any]]:
    """Return events strictly newer than `since_ts` (ISO string)."""
    events = read_events(run_id)
    if not since_ts:
        return events
    return [e for e in events if e["ts"] > since_ts]
