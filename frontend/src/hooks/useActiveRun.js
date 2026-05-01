import { useEffect, useRef, useState } from "react";
import { fetchRun } from "../lib/api";
import { RUN_POLL_INTERVAL_MS } from "../lib/constants";

const TERMINAL_STATES = new Set(["completed", "failed"]);

const isTerminal = (status) => TERMINAL_STATES.has(status);

/**
 * Polls /api/runs/{runId} while the run is active and surfaces the latest
 * RunState + events array. Stops polling once the run reaches a terminal
 * state (completed | failed).
 *
 * The effect depends on `runId` only — `timerRef` is a ref (stable),
 * and all module-level constants never change at runtime.
 */
export function useActiveRun(runId) {
  const [run, setRun] = useState(null);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    setRun(null);
    setEvents([]);
    setError(null);

    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    if (!runId) {
      clearTimer();
      return () => {
        mountedRef.current = false;
        clearTimer();
      };
    }

    const tick = async () => {
      try {
        const data = await fetchRun(runId);
        if (!mountedRef.current) return;
        setRun(data.run);
        setEvents(data.events || []);
        if (isTerminal(data.run?.status)) {
          clearTimer();
          return;
        }
      } catch (e) {
        if (!mountedRef.current) return;
        setError(e?.message || String(e));
      }
      if (mountedRef.current) {
        timerRef.current = setTimeout(tick, RUN_POLL_INTERVAL_MS);
      }
    };

    tick();

    return () => {
      mountedRef.current = false;
      clearTimer();
    };
  }, [runId]);

  return { run, events, error };
}
