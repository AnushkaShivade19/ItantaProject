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

/**
 * Bootstraps the dashboard: loads health/config/pipeline/agents/phases,
 * maintains a periodic health refresh, and surfaces a live log buffer.
 *
 * Returns { health, config, pipeline, agents, phases, logs, error, addLog }.
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

  const addLog = useCallback((msg, level = "info", agent = "system") => {
    setLogs((prev) => {
      const next = [...prev, makeLogEntry(msg, level, agent)];
      return next.length > MAX_LOG_LINES ? next.slice(-MAX_LOG_LINES) : next;
    });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    addLog("bootstrapping dashboard ...", "info", "ui");

    (async () => {
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
          `groq key ${
            h.groq_key_configured
              ? "configured"
              : "missing — add to backend/.env"
          }`,
          h.groq_key_configured ? "success" : "warn",
          "groq"
        );
        addLog(
          `loaded ${p.length} agents · ${ph.length} phases`,
          "info",
          "orchestrator"
        );
        addLog(
          "phase-1 scaffold ready · awaiting phase-2 confirmation",
          "running",
          "phase"
        );
      } catch (e) {
        setError(String(e));
        addLog(`bootstrap failed: ${e.message}`, "error", "ui");
      }
    })();

    const t = setInterval(async () => {
      try {
        const h = await fetchHealth();
        if (mountedRef.current) setHealth(h);
      } catch (err) {
        console.warn("[health-refresh] failed:", err?.message || err);
      }
    }, HEALTH_REFRESH_INTERVAL_MS);

    return () => {
      mountedRef.current = false;
      clearInterval(t);
    };
  }, [addLog]);

  return { health, config, pipeline, agents, phases, logs, error, addLog };
}
