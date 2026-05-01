import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchHealth,
  fetchConfig,
  fetchPipeline,
  fetchAgents,
  fetchPhases,
} from "../lib/api";
import { HEALTH_REFRESH_INTERVAL_MS, MAX_LOG_LINES } from "../lib/constants";

const nowTs = () => new Date().toISOString().split("T")[1].replace("Z", "");

const makeLogEntry = (msg, level, agent) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  ts: nowTs(),
  level,
  agent,
  msg,
});

const appendCapped = (prev, entry) => {
  const next = [...prev, entry];
  return next.length > MAX_LOG_LINES ? next.slice(-MAX_LOG_LINES) : next;
};

const loadDashboardData = () =>
  Promise.all([
    fetchHealth(),
    fetchConfig(),
    fetchPipeline(),
    fetchAgents(),
    fetchPhases(),
  ]).then(([health, config, pipeline, agents, phases]) => ({
    health,
    config,
    pipeline,
    agents,
    phases,
  }));

const groqStatusLog = (groqOk) => ({
  msg: groqOk ? "groq key configured" : "groq key missing — add to backend/.env",
  level: groqOk ? "success" : "warn",
});

const runBootSequence = async (mountedRef, setters, addLog, setError) => {
  try {
    const payload = await loadDashboardData();
    if (!mountedRef.current) return;
    setters.setHealth(payload.health);
    setters.setConfig(payload.config);
    setters.setPipeline(payload.pipeline);
    setters.setAgents(payload.agents);
    setters.setPhases(payload.phases);
    addLog(`health=${payload.health.status} v${payload.health.version}`, "success", "health");
    const g = groqStatusLog(payload.health.groq_key_configured);
    addLog(g.msg, g.level, "groq");
    addLog(
      `loaded ${payload.pipeline.length} agents · ${payload.phases.length} phases`,
      "info",
      "orchestrator"
    );
    addLog("scaffold ready", "running", "phase");
  } catch (e) {
    if (!mountedRef.current) return;
    setError(String(e));
    addLog(`bootstrap failed: ${e.message}`, "error", "ui");
  }
};

const startHealthPoller = (mountedRef, setHealth) => {
  const refresh = async () => {
    try {
      const h = await fetchHealth();
      if (mountedRef.current) setHealth(h);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[health-refresh] failed:", err?.message || err);
      }
    }
  };
  return setInterval(refresh, HEALTH_REFRESH_INTERVAL_MS);
};

/**
 * Boots the dashboard once, then polls health on a fixed interval.
 * Exposes a capped log buffer with a stable `addLog` reference.
 */
export function useAgenticBoot() {
  const [health, setHealth] = useState(null);
  const [config, setConfig] = useState(null);
  const [pipeline, setPipeline] = useState([]);
  const [agents, setAgents] = useState([]);
  const [phases, setPhases] = useState([]);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  // addLog params (msg/level/agent) and module-level helpers (makeLogEntry,
  // appendCapped, MAX_LOG_LINES) are categorically not React deps.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const addLog = useCallback((msg, level = "info", agent = "system") => {
    setLogs((prev) => appendCapped(prev, makeLogEntry(msg, level, agent)));
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    addLog("bootstrapping dashboard ...", "info", "ui");
    const setters = { setHealth, setConfig, setPipeline, setAgents, setPhases };
    runBootSequence(mountedRef, setters, addLog, setError);
    const intervalId = startHealthPoller(mountedRef, setHealth);
    return () => {
      mountedRef.current = false;
      clearInterval(intervalId);
    };
  }, [addLog]);

  return { health, config, pipeline, agents, phases, logs, error, addLog };
}
