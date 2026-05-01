import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import PhaseBanner from "./components/PhaseBanner";
import AgentPipeline from "./components/AgentPipeline";
import ConfigPanel from "./components/ConfigPanel";
import LogTerminal from "./components/LogTerminal";
import {
  fetchHealth,
  fetchConfig,
  fetchPipeline,
  fetchAgents,
  fetchPhases,
} from "./lib/api";
import "./App.css";

function nowTs() {
  return new Date().toISOString().split("T")[1].replace("Z", "");
}

export default function App() {
  const [health, setHealth] = useState(null);
  const [config, setConfig] = useState(null);
  const [pipeline, setPipeline] = useState([]);
  const [agents, setAgents] = useState([]);
  const [phases, setPhases] = useState([]);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);
  const [nav, setNav] = useState("dashboard");

  const addLog = (msg, level = "info", agent = "system") =>
    setLogs((prev) => [
      ...prev.slice(-200),
      { ts: nowTs(), level, agent, msg },
    ]);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      addLog("bootstrapping dashboard ...", "info", "ui");
      try {
        const [h, c, p, a, ph] = await Promise.all([
          fetchHealth(),
          fetchConfig(),
          fetchPipeline(),
          fetchAgents(),
          fetchPhases(),
        ]);
        if (cancelled) return;
        setHealth(h);
        setConfig(c);
        setPipeline(p);
        setAgents(a);
        setPhases(ph);
        addLog(`health=${h.status} v${h.version}`, "success", "health");
        addLog(
          `groq key ${h.groq_key_configured ? "configured" : "missing — add to backend/.env"}`,
          h.groq_key_configured ? "success" : "warn",
          "groq"
        );
        addLog(`loaded ${p.length} agents · ${ph.length} phases`, "info", "orchestrator");
        addLog("phase-1 scaffold ready · awaiting phase-2 confirmation", "running", "phase");
      } catch (e) {
        setError(String(e));
        addLog(`bootstrap failed: ${e.message}`, "error", "ui");
      }
    }
    boot();
    const t = setInterval(async () => {
      try {
        const h = await fetchHealth();
        if (!cancelled) setHealth(h);
      } catch (_) {
        /* noop */
      }
    }, 15000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  // Phase 1 — no run yet, all agents idle.
  const statuses = Object.fromEntries(pipeline.map((n) => [n.name, "idle"]));

  return (
    <div className="App min-h-screen" data-testid="app-root">
      <Header health={health} />
      <div className="flex">
        <Sidebar active={nav} onSelect={setNav} />

        <main className="flex-1 p-4 md:p-6 space-y-6 relative">
          {error && (
            <div
              data-testid="error-banner"
              className="surface p-3 text-sm"
              style={{ borderColor: "var(--state-error)", color: "var(--state-error)" }}
            >
              Backend unreachable: {error}
            </div>
          )}

          <PhaseBanner phases={phases} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <AgentPipeline pipeline={pipeline} statuses={statuses} />

              {config && <ConfigPanel config={config} agents={agents} />}
            </div>

            <div className="space-y-6">
              <section className="surface p-5 rounded-sm" data-testid="spec-placeholder">
                <div className="overline mb-1">input</div>
                <h3 className="font-heading text-lg font-medium">
                  Project Specification
                </h3>
                <p className="text-sm text-secondary-ink mt-2 leading-relaxed">
                  The spec editor arrives in <span className="font-mono text-primary-ink">phase-3</span>.
                  The Intake Agent will accept natural language, ask clarifying
                  questions, and emit a structured JSON spec.
                </p>
                <textarea
                  data-testid="spec-input"
                  disabled
                  placeholder="e.g. Build a FastAPI + React todo app with MongoDB…"
                  className="input-base mt-4 h-28 resize-none opacity-60"
                />
                <button className="btn-primary mt-3 w-full justify-center" disabled>
                  Launch Pipeline · locked until phase-3
                </button>
              </section>

              <LogTerminal lines={logs} />
            </div>
          </div>

          <footer className="pt-4 pb-8 text-[11px] font-mono text-muted-ink flex items-center justify-between">
            <div>agentic.dev · built on FastAPI + Groq</div>
            <div>
              phase-1 · scaffold complete · awaiting confirmation for phase-2
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
