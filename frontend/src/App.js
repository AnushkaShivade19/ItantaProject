import React from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import PhaseBanner from "./components/PhaseBanner";
import AgentPipeline from "./components/AgentPipeline";
import ConfigPanel from "./components/ConfigPanel";
import LogTerminal from "./components/LogTerminal";
import SpecPlaceholder from "./components/SpecPlaceholder";
import { useAgenticBoot } from "./hooks/useAgenticBoot";
import "./App.css";

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

function DashboardFooter() {
  return (
    <footer className="pt-4 pb-8 text-[11px] font-mono text-muted-ink flex items-center justify-between">
      <div>agentic.dev · built on FastAPI + Groq</div>
      <div>phase-1 · scaffold complete · awaiting confirmation for phase-2</div>
    </footer>
  );
}

export default function App() {
  const [nav, setNav] = React.useState("dashboard");
  const { health, config, pipeline, agents, phases, logs, error } =
    useAgenticBoot();

  // Phase 1 — no run yet, all agents idle.
  const statuses = Object.fromEntries(pipeline.map((n) => [n.name, "idle"]));

  return (
    <div className="App min-h-screen" data-testid="app-root">
      <Header health={health} />
      <div className="flex">
        <Sidebar active={nav} onSelect={setNav} />

        <main className="flex-1 p-4 md:p-6 space-y-6 relative">
          <ErrorBanner error={error} />
          <PhaseBanner phases={phases} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <AgentPipeline pipeline={pipeline} statuses={statuses} />
              {config && <ConfigPanel config={config} agents={agents} />}
            </div>
            <div className="space-y-6">
              <SpecPlaceholder />
              <LogTerminal lines={logs} />
            </div>
          </div>

          <DashboardFooter />
        </main>
      </div>
    </div>
  );
}
