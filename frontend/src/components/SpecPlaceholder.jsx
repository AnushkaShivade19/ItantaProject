import React from "react";

/**
 * Empty state right column — shown in Phase 1 until the spec editor
 * wakes up in Phase 3.
 */
export default function SpecPlaceholder() {
  return (
    <section className="surface p-5 rounded-sm" data-testid="spec-placeholder">
      <div className="overline mb-1">input</div>
      <h3 className="font-heading text-lg font-medium">Project Specification</h3>
      <p className="text-sm text-secondary-ink mt-2 leading-relaxed">
        The spec editor arrives in <span className="font-mono text-primary-ink">phase-3</span>.
        The Intake Agent will accept natural language, ask clarifying questions,
        and emit a structured JSON spec.
      </p>
      <textarea
        data-testid="spec-input"
        disabled
        placeholder="e.g. Build a FastAPI + React todo app with MongoDB…"
        className="input-base mt-4 h-28 resize-none opacity-60"
      />
      <button
        className="btn-primary mt-3 w-full justify-center"
        disabled
        data-testid="launch-pipeline-btn"
      >
        Launch Pipeline · locked until phase-3
      </button>
    </section>
  );
}
