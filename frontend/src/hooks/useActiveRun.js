import { useCallback, useEffect, useRef, useState } from "react";
import { fetchRun } from "../lib/api";
import { RUN_POLL_INTERVAL_MS } from "../lib/constants";

const TERMINAL_STATES = new Set(["completed", "failed"]);

/**
 * Polls /api/runs/{runId} while the run is active and surfaces the latest
 * RunState + events array. Stops polling once the run is in a terminal state.
 */
export function useActiveRun(runId) {
  const [run, setRun] = useState(null);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  const isMountedRef = useRef(true);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    setRun(null);
    setEvents([]);
    setError(null);

    if (!runId) {
      clearTimer();
      return () => {
        isMountedRef.current = false;
        clearTimer();
      };
    }

    const tick = async () => {
      try {
        const data = await fetchRun(runId);
        if (!isMountedRef.current) return;
        setRun(data.run);
        setEvents(data.events || []);
        if (TERMINAL_STATES.has(data.run?.status)) {
          clearTimer();
          return;
        }
      } catch (e) {
        if (!isMountedRef.current) return;
        setError(e?.message || String(e));
      }
      if (isMountedRef.current) {
        timerRef.current = setTimeout(tick, RUN_POLL_INTERVAL_MS);
      }
    };

    tick();

    return () => {
      isMountedRef.current = false;
      clearTimer();
    };
  }, [runId, clearTimer]);

  return { run, events, error };
}
