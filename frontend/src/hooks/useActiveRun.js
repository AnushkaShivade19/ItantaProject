import { useEffect, useRef, useState } from "react";
import { fetchRun } from "../lib/api";
import { RUN_POLL_INTERVAL_MS } from "../lib/constants";

const TERMINAL_STATES = new Set(["completed", "failed"]);
const isTerminal = (status) => TERMINAL_STATES.has(status);

/** Drives a setTimeout-based poll loop; stops when `shouldStop` returns true. */
function usePolling(runId, fetcher, onData, shouldStop, intervalMs) {
  const timerRef = useRef(null);
  const mountedRef = useRef(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    mountedRef.current = true;
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
    const tick = async () => {
      try {
        const data = await fetcher(runId);
        if (!mountedRef.current) return;
        onData(data);
        if (shouldStop(data)) return clearTimer();
      } catch (e) {
        if (mountedRef.current) setError(e?.message || String(e));
      }
      if (mountedRef.current) {
        timerRef.current = setTimeout(tick, intervalMs);
      }
    };
    tick();
    return () => {
      mountedRef.current = false;
      clearTimer();
    };
    // fetcher / onData / shouldStop are stable refs from caller scope.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId]);

  return error;
}

/**
 * Polls /api/runs/{runId} while the run is active. Stops once it reaches
 * a terminal state. Returns the latest run, events, and any error.
 */
export function useActiveRun(runId) {
  const [run, setRun] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setRun(null);
    setEvents([]);
  }, [runId]);

  const onData = (data) => {
    setRun(data.run);
    setEvents(data.events || []);
  };
  const shouldStop = (data) => isTerminal(data.run?.status);
  const error = usePolling(runId, fetchRun, onData, shouldStop, RUN_POLL_INTERVAL_MS);

  return { run, events, error };
}
