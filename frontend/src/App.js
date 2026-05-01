import React from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import PhaseBanner from "./components/PhaseBanner";
import AgentPipeline from "./components/AgentPipeline";
import ConfigPanel from "./components/ConfigPanel";
import LogTerminal from "./components/LogTerminal";
import SpecEditor from "./components/SpecEditor";
import RunSummary from "./components/RunSummary";
import { useAgenticBoot } from "./hooks/useAgenticBoot";
import { useActiveRun } from "./hooks/useActiveRun";
import { EVENT_LEVEL_TO_LOG_LEVEL } from "./lib/constants";
import "./App.css";

const TIME_ONLY = (iso) =>
  iso ? iso.split("T")[1].replace("Z", "").slice(0, 12) : "";

const mapEventToLog = (ev) => ({
  id: `${ev.run_id}-${ev.ts}-${ev.agent}`,
  ts: TIME_ONLY(ev.ts),
  level: EVENT_LEVEL_TO_LOG_LEVEL[ev.level] || "info",
  agent: ev.agent,
  msg: ev.message,
});

function ErrorBanner({ error }) {
  if (!error) return null;
  return (
    <div
      data-testid="error-banner"
      className="surface p-3 text-sm"
      style={{ borderColor: "var(--state-error)", color: "var(--state-error)" }}
    >
      Backend unreachable: {error}
    </div>
  );
}

function DashboardFooter({ phaseStatus }) {
  return (
    <footer className="pt-4 pb-8 text-[11px] font-mono text-muted-ink flex items-center justify-between">
      <div>agentic.dev · FastAPI + Groq</div>
      <div>{phaseStatus}</div>
    </footer>
  );
}

const IS_BUSY = (run) =>
  run && (run.status === "pending" || run.status === "running");

const agentStatusesFromRun = (run, pipeline) => {
  const base = Object.fromEntries(pipeline.map((n) => [n.name, "idle"]));
  if (!run?.agents) return base;
  for (const [name, agent] of Object.entries(run.agents)) {
    base[name] = agent.status;
  }
  return base;
};

export default function App() {
  const [nav, setNav] = React.useState("dashboard");
  const [activeRunId, setActiveRunId] = React.useState(null);
  const { health, config, pipeline, agents, phases, logs, error } =
    useAgenticBoot();
  const { run: activeRun, events: runEvents, error: runError } =
    useActiveRun(activeRunId);

  const statuses = agentStatusesFromRun(activeRun, pipeline);
  const mergedLogs = React.useMemo(
    () => [...logs, ...runEvents.map(mapEventToLog)],
    [logs, runEvents]
  );

  const handleRunStarted = React.useCallback((runId) => {
    setActiveRunId(runId);
  }, []);

  const busy = IS_BUSY(activeRun);
  const phaseStatus = activeRun
    ? `run ${activeRun.id.slice(0, 8)} · ${activeRun.status}`
    : "phase-2 · orchestrator ready · awaiting phase-3 intake";

  return (
    <div className="App min-h-screen" data-testid="app-root">
      <Header health={health} />
      <div className="flex">
        <Sidebar active={nav} onSelect={setNav} />

        <main className="flex-1 p-4 md:p-6 space-y-6 relative">
          <ErrorBanner error={error || runError} />
          <PhaseBanner phases={phases} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <AgentPipeline pipeline={pipeline} statuses={statuses} />
              {config && <ConfigPanel config={config} agents={agents} />}
            </div>
            <div className="space-y-6">
              <RunSummary run={activeRun} />
              <SpecEditor onRunStarted={handleRunStarted} busy={busy} />
              <LogTerminal lines={mergedLogs} />
            </div>
          </div>

          <DashboardFooter phaseStatus={phaseStatus} />
        </main>
      </div>
    </div>
  );
}
