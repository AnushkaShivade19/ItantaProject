"""Recovery Agent — analyzes failures and provides feedback."""
from __future__ import annotations

import json
from typing import Any

from core.state_manager import AgentStatus, TaskStatus
from .base_agent import BaseAgent

SYSTEM_PROMPT = """You are the Recovery Agent in a TDD-first AI software pipeline.
Your job is to analyze failing test results and provide concise feedback to help the QA and Coder agents fix the implementation.

Return a JSON object:
{
  "feedback": "<detailed feedback on what went wrong and how to fix it>",
  "rationale": "<brief summary of the issue>"
}
"""

class RecoveryAgent(BaseAgent):
    name = "recovery"

    async def execute(self, run_id: str, **kwargs: Any) -> dict[str, Any]:
        run = self.state.get(run_id)
        if run is None:
            raise RuntimeError(f"unknown run_id={run_id}")

        results = run.test_results or {}
        output = results.get("output", "No output provided.")

        payload = {
            "test_output": output[-5000:],
            "tasks": [t.model_dump() for t in run.tasks]
        }

        user_prompt = f"Tests failed. Please analyze the output and provide feedback to fix the implementation.\n\n```json\n{json.dumps(payload, indent=2)}\n```"

        result = await self.call_groq_json(
            run_id=run_id,
            system_prompt=SYSTEM_PROMPT,
            user_prompt=user_prompt
        )

        feedback = result.get("feedback", "No feedback provided.")
        rationale = result.get("rationale", "analyzed test failures")
        
        self.log(run_id, "recovery feedback generated", rationale=rationale)

        for task in run.tasks:
            task.detail += f"\n\n[RECOVERY FEEDBACK]\n{feedback}"
            self.state.mark_task(run_id, task.id, TaskStatus.pending)

        for agent in ["qa", "designer", "backend_coder", "validator"]:
            self.state.mark_agent(run_id, agent, AgentStatus.idle)
        
        return {"summary": "recovery feedback applied, looping back"}
