"""
Agentic AI Software Development Framework — CLI entry point.

Usage:
    python -m backend.main run "Build a todo app with FastAPI"
    python -m backend.main status
    python -m backend.main config

Phase 1 implementation: scaffolding only. Subsequent phases will wire
the orchestrator and agents into this CLI.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

import yaml
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

ROOT = Path(__file__).parent
CONFIG_PATH = ROOT / "config" / "config.yaml"

console = Console()


def load_config() -> dict:
    with CONFIG_PATH.open("r", encoding="utf-8") as fh:
        return yaml.safe_load(fh)


def cmd_config(_: argparse.Namespace) -> int:
    cfg = load_config()
    console.print(Panel.fit(f"[bold]{cfg['framework']['name']}[/] v{cfg['framework']['version']}",
                            border_style="white"))

    tbl = Table(title="Agent → Model assignments", show_lines=False)
    tbl.add_column("Agent", style="bold")
    tbl.add_column("Model")
    tbl.add_column("Temp")
    tbl.add_column("Description", style="dim")
    for name, spec in cfg["agents"].items():
        tbl.add_row(name, spec["model"], str(spec["temperature"]), spec["description"])
    console.print(tbl)
    return 0


def cmd_status(_: argparse.Namespace) -> int:
    console.print("[bold]Phase 1[/] — Project Setup ✅")
    console.print("Next: Phase 2 (Core Orchestrator)")
    return 0


def cmd_run(args: argparse.Namespace) -> int:
    console.print(Panel.fit(f"[yellow]Phase 1 scaffold only[/] — orchestrator not wired yet.\n"
                            f"Your spec: [white]{args.spec!r}[/]\n"
                            f"Run after Phase 8 to generate projects.",
                            title="not-yet-implemented", border_style="yellow"))
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="agentic-framework",
                                description="Agentic AI Software Development Framework")
    sub = p.add_subparsers(dest="cmd", required=True)

    run = sub.add_parser("run", help="Run the full agent pipeline on a spec")
    run.add_argument("spec", help="Natural-language project specification")
    run.set_defaults(func=cmd_run)

    status = sub.add_parser("status", help="Show current framework phase")
    status.set_defaults(func=cmd_status)

    cfg = sub.add_parser("config", help="Print resolved configuration")
    cfg.set_defaults(func=cmd_config)

    return p


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    ns = parser.parse_args(argv)
    return ns.func(ns)


if __name__ == "__main__":
    sys.exit(main())
