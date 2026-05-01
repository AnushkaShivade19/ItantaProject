import { useEffect, useRef, useState } from "react";
import { fetchRun } from "../lib/api";
import { RUN_POLL_INTERVAL_MS } from "../lib/constants";

const TERMINAL_STATES = new Set(["completed", "failed"]);

const isTerminal = (status) => TERMINAL_STATES.has(status);

/** Single fetch cycle — returns true when polling should stop. */
const pollOnce = async (runId, apply) => {
  const data = await fetchRun(runId);
  apply(data);
  return isTerminal(data.run?.status);
};

/**
 * Polls /api/runs/{runId} while the run is active. Stops once the run
 * reaches a terminal state (completed | failed). Depends only on `runId`.
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
      return () => {
        mountedRef.current = false;
        clearTimer();
      };
    }

    const apply = (data) => {
      if (!mountedRef.current) return;
      setRun(data.run);
      setEvents(data.events || []);
    };

    const loop = async () => {
      try {
        const stop = await pollOnce(runId, apply);
        if (stop) return clearTimer();
      } catch (e) {
        if (!mountedRef.current) return;
        setError(e?.message || String(e));
      }
      if (mountedRef.current) {
        timerRef.current = setTimeout(loop, RUN_POLL_INTERVAL_MS);
      }
    };

    loop();

    return () => {
      mountedRef.current = false;
      clearTimer();
    };
  }, [runId]);

  return { run, events, error };
}
