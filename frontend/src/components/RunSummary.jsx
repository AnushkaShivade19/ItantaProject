import React from "react";
import { Clock, Hash } from "@phosphor-icons/react";
import { runStatusColor } from "../lib/constants";

const formatTs = (iso) =>
  iso ? new Date(iso).toLocaleTimeString([], { hour12: false }) : "—";

const shortId = (id) => (id ? id.slice(0, 8) : "—");

function StatusRow({ label, value, color }) {
  return (
    <div className="flex items-center justify-between text-[12px] font-mono">
      <span className="text-muted-ink">{label}</span>
      <span style={{ color: color || "var(--text-primary)" }}>{value}</span>
    </div>
  );
}

/**
 * Right-rail summary of the currently-executing run.
 * Surfaces id, status, timings — feels like a CI dashboard tile.
 */
export default function RunSummary({ run }) {
  if (!run) {
    return (
      <section className="surface p-5 rounded-sm" data-testid="run-summary-empty">
        <div className="overline mb-1">active run</div>
        <h3 className="font-heading text-lg font-medium">No run yet</h3>
        <p className="text-sm text-secondary-ink mt-2 leading-relaxed">
          Enter a spec below and launch the pipeline — you'll see agents
          cycle through their states in real time.
        </p>
      </section>
    );
  }

  const color = runStatusColor(run.status);

  return (
    <section className="surface p-5 rounded-sm" data-testid="run-summary">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="overline mb-1">active run</div>
          <h3 className="font-heading text-lg font-medium flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: color }}
              data-testid="run-status-dot"
            />
            <span style={{ color }}>{run.status}</span>
          </h3>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-muted-ink">
          <Hash size={10} />
          <span data-testid="run-id-short">{shortId(run.id)}</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <StatusRow label="phase" value={run.phase} />
        <StatusRow
          label="created"
          value={formatTs(run.created_at)}
          color="var(--text-secondary)"
        />
        <StatusRow
          label="updated"
          value={formatTs(run.updated_at)}
          color="var(--text-secondary)"
        />
        <StatusRow
          label="tasks"
          value={run.tasks?.length ?? 0}
          color="var(--text-secondary)"
        />
      </div>

      {run.spec_input && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="overline mb-1 flex items-center gap-1">
            <Clock size={10} /> spec
          </div>
          <p className="text-[12px] font-mono text-secondary-ink leading-relaxed line-clamp-4">
            {run.spec_input}
          </p>
        </div>
      )}
    </section>
  );
}
