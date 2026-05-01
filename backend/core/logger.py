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
LOGS_DIR.mkdir(parents=True, exist_ok=True)
(LOGS_DIR / "events").mkdir(parents=True, exist_ok=True)

_LOG_PATH = LOGS_DIR / "framework.log"


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


def event(run_id: str, level: str, agent: str, message: str, **extra: Any) -> dict:
    """Emit a structured event -> stdout + events file + returns dict."""
    ev = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "run_id": run_id,
        "level": level,
        "agent": agent,
        "message": message,
        **extra,
    }
    getattr(log, level.lower() if level.lower() in {"info", "warning", "error", "debug"} else "info")(
        f"[{run_id[:8]}][{agent}] {message}"
    )
    path = LOGS_DIR / "events" / f"{run_id}.jsonl"
    with path.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(ev) + "\n")
    return ev


def read_events(run_id: str) -> list[dict]:
    path = LOGS_DIR / "events" / f"{run_id}.jsonl"
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8") as fh:
        return [json.loads(line) for line in fh if line.strip()]
