import { useCallback, useMemo, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import PhaseBanner from "./components/PhaseBanner";
import AgentPipeline from "./components/AgentPipeline";
import ConfigPanel from "./components/ConfigPanel";
import LogTerminal from "./components/LogTerminal";
import SpecEditor from "./components/SpecEditor";
import RunSummary from "./components/RunSummary";
import ClarificationCard from "./components/ClarificationCard";
import SpecificationCard from "./components/SpecificationCard";
import ArchitectureCard from "./components/ArchitectureCard";
import TaskListCard from "./components/TaskListCard";
import TestSuiteCard from "./components/TestSuiteCard";
import { useAgenticBoot } from "./hooks/useAgenticBoot";
import { useActiveRun } from "./hooks/useActiveRun";
import { EVENT_LEVEL_TO_LOG_LEVEL } from "./lib/constants";
import "./App.css";

const timeOnly = (iso) =>
  iso ? iso.split("T")[1].replace("Z", "").slice(0, 12) : "";

const mapEventToLog = (ev) => ({
  id: `${ev.run_id}-${ev.ts}-${ev.agent}`,
  ts: timeOnly(ev.ts),
  level: EVENT_LEVEL_TO_LOG_LEVEL[ev.level] || "info",
  agent: ev.agent,
  msg: ev.message,
});

const isRunBusy = (run) =>
  run && (run.status === "pending" || run.status === "running");

const agentStatusesFromRun = (run, pipeline) => {
  const base = Object.fromEntries(pipeline.map((n) => [n.name, "idle"]));
  if (!run?.agents) return base;
  for (const [name, agent] of Object.entries(run.agents)) {
    base[name] = agent.status;
  }
  return base;
};

const computePhaseStatus = (run) =>
  run
    ? `run ${run.id.slice(0, 8)} · ${run.status}`
    : "phase-4 · architect+planner ready · awaiting phase-5 qa";

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

function MainColumn({ pipeline, statuses, activeRun, config, agents }) {
  return (
    <div className="xl:col-span-2 space-y-6">
      <AgentPipeline pipeline={pipeline} statuses={statuses} />
      <SpecificationCard run={activeRun} />
      <ArchitectureCard run={activeRun} />
      <TaskListCard run={activeRun} />
      <TestSuiteCard run={activeRun} />
      {config && <ConfigPanel config={config} agents={agents} />}
    </div>
  );
}

function SideColumn({ activeRun, onRunStarted, onResumed, busy, logs }) {
  return (
    <div className="space-y-6">
      <RunSummary run={activeRun} />
      <ClarificationCard run={activeRun} onResumed={onResumed} />
      <SpecEditor onRunStarted={onRunStarted} busy={busy} />
      <LogTerminal lines={logs} />
    </div>
  );
}

export default function App() {
  const [nav, setNav] = useState("dashboard");
  const [activeRunId, setActiveRunId] = useState(null);
  const { health, config, pipeline, agents, phases, logs, error } =
    useAgenticBoot();
  const { run: activeRun, events: runEvents, error: runError } =
    useActiveRun(activeRunId);

  const statuses = agentStatusesFromRun(activeRun, pipeline);
  const mergedLogs = useMemo(
    () => [...logs, ...runEvents.map(mapEventToLog)],
    [logs, runEvents]
  );
  const handleRunStarted = useCallback((id) => setActiveRunId(id), []);
  const handleResumed = useCallback(() => {}, []);
  const busy = isRunBusy(activeRun);
  const phaseStatus = computePhaseStatus(activeRun);

  return (
    <div className="App min-h-screen" data-testid="app-root">
      <Header health={health} />
      <div className="flex">
        <Sidebar active={nav} onSelect={setNav} />
        <main className="flex-1 p-4 md:p-6 space-y-6 relative">
          <ErrorBanner error={error || runError} />
          <PhaseBanner phases={phases} />
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <MainColumn
              pipeline={pipeline}
              statuses={statuses}
              activeRun={activeRun}
              config={config}
              agents={agents}
            />
            <SideColumn
              activeRun={activeRun}
              onRunStarted={handleRunStarted}
              onResumed={handleResumed}
              busy={busy}
              logs={mergedLogs}
            />
          </div>
          <DashboardFooter phaseStatus={phaseStatus} />
        </main>
      </div>
    </div>
  );
}
