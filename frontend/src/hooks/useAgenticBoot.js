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

/**
 * Boots the dashboard: loads static metadata once, then polls health
 * on a fixed interval. Exposes a capped log buffer with a stable
 * `addLog` reference.
 *
 * Effect runs exactly once on mount — `addLog` is stable (useCallback
 * with empty deps) and the interval depends only on a module-level
 * constant, so no hidden deps to track.
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

  // Parameters (msg/level/agent) can never be React deps. setLogs and
  // the module-level helpers are stable. Empty deps is correct here.
  const addLog = useCallback((msg, level = "info", agent = "system") => {
    setLogs((prev) => appendCapped(prev, makeLogEntry(msg, level, agent)));
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    addLog("bootstrapping dashboard ...", "info", "ui");

    const runBoot = async () => {
      try {
        const [h, c, p, a, ph] = await Promise.all([
          fetchHealth(),
          fetchConfig(),
          fetchPipeline(),
          fetchAgents(),
          fetchPhases(),
        ]);
        if (!mountedRef.current) return;
        setHealth(h);
        setConfig(c);
        setPipeline(p);
        setAgents(a);
        setPhases(ph);
        addLog(`health=${h.status} v${h.version}`, "success", "health");
        addLog(
          h.groq_key_configured
            ? "groq key configured"
            : "groq key missing — add to backend/.env",
          h.groq_key_configured ? "success" : "warn",
          "groq"
        );
        addLog(
          `loaded ${p.length} agents · ${ph.length} phases`,
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

    runBoot();

    const refreshHealth = async () => {
      try {
        const h = await fetchHealth();
        if (mountedRef.current) setHealth(h);
      } catch (err) {
        console.warn("[health-refresh] failed:", err?.message || err);
      }
    };
    const intervalId = setInterval(refreshHealth, HEALTH_REFRESH_INTERVAL_MS);

    return () => {
      mountedRef.current = false;
      clearInterval(intervalId);
    };
  }, [addLog]);

  return { health, config, pipeline, agents, phases, logs, error, addLog };
}
