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
import CodeFilesCard from "./components/CodeFilesCard";
import LivePreviewCard from "./components/LivePreviewCard";
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
      <div>Skynet · FastAPI + Groq</div>
      <div>{phaseStatus}</div>
    </footer>
  );
}

function AppContent({ nav, activeRun, busy, onRunStarted, onResumed, logs, pipeline, statuses, config, agents }) {
  // If we are on the default dashboard or intake, show the centered Launch Pipeline UX
  if (nav === "dashboard" || nav === "intake") {
    return (
      <div className="max-w-4xl mx-auto space-y-8 mt-10">
        <AgentPipeline pipeline={pipeline} statuses={statuses} />
        <SpecEditor onRunStarted={onRunStarted} busy={busy} />
        <RunSummary run={activeRun} />
        <ClarificationCard run={activeRun} onResumed={onResumed} />
      </div>
    );
  }

  // Handle specific agent tabs using full width
  if (nav === "architect") return <div className="max-w-6xl mx-auto"><ArchitectureCard run={activeRun} /></div>;
  if (nav === "planner") return <div className="max-w-6xl mx-auto space-y-6"><SpecificationCard run={activeRun} /><TaskListCard run={activeRun} /></div>;
  if (nav === "qa") return <div className="max-w-6xl mx-auto"><TestSuiteCard run={activeRun} /></div>;
  if (nav === "coder") return <div className="max-w-6xl mx-auto"><CodeFilesCard run={activeRun} /></div>;
  if (nav === "preview") return <div className="max-w-6xl mx-auto"><LivePreviewCard run={activeRun} /></div>;
  
  if (nav === "config") return <div className="max-w-6xl mx-auto">{config && <ConfigPanel config={config} agents={agents} />}</div>;

  return (
    <div className="flex items-center justify-center h-64 text-muted-ink">
      <p>Select a tab from the sidebar to view its content.</p>
    </div>
  );
}

export default function App() {
  const [nav, setNav] = useState("intake");
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
        <main className="flex-1 p-4 md:p-8 relative overflow-y-auto h-[calc(100vh-3.5rem)]">
          <AppContent 
            nav={nav} 
            activeRun={activeRun} 
            busy={busy} 
            onRunStarted={handleRunStarted} 
            onResumed={handleResumed} 
            logs={mergedLogs} 
            pipeline={pipeline} 
            statuses={statuses}
            config={config}
            agents={agents}
          />
          
          <div className="mt-16">
            <DashboardFooter phaseStatus={phaseStatus} />
          </div>
        </main>
      </div>
    </div>
  );
}
