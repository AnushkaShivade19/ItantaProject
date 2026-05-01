import { useState } from "react";
import { PaperPlaneRight, Spinner } from "@phosphor-icons/react";
import { createRun, startRun } from "../lib/api";

const SAMPLE_SPECS = [
  "Build a FastAPI + React todo app with MongoDB persistence and JWT auth.",
  "Create a Python CLI that converts markdown → PDF with a table of contents.",
  "Build a URL shortener with FastAPI, PostgreSQL, and hit-count analytics.",
];

const canLaunch = (spec, submitting, busy) =>
  spec.trim().length > 0 && !submitting && !busy;

const extractErrorMessage = (err) =>
  err?.response?.data?.detail || err?.message || "failed to launch";

function SamplePill({ text, onUse, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onUse(text)}
      className="text-[11px] font-mono px-2 py-1 rounded-sm transition-colors"
      style={{
        background: "var(--surface-elevated)",
        color: "var(--text-secondary)",
        border: "1px solid var(--border)",
      }}
      data-testid="sample-spec-pill"
    >
      {text.slice(0, 42)}…
    </button>
  );
}

function LaunchButtonContent({ isLocked }) {
  if (isLocked) {
    return (
      <>
        <Spinner size={14} className="animate-spin" />
        Pipeline running…
      </>
    );
  }
  return (
    <>
      <PaperPlaneRight size={14} weight="fill" />
      Launch Pipeline
    </>
  );
}

function EditorHeader() {
  return (
    <div className="flex items-center justify-between mb-2">
      <div>
        <div className="overline mb-1">input</div>
        <h3 className="font-heading text-lg font-medium">Project Specification</h3>
      </div>
      <span className="text-[10px] font-mono text-muted-ink">
        phase-2 · dry-run
      </span>
    </div>
  );
}

function EditorHelp() {
  return (
    <p className="text-sm text-secondary-ink mt-1 leading-relaxed">
      Describe your project in natural language. The orchestrator will cycle
      through all 7 agents — real LLM behaviour lands in Phase 3+.
    </p>
  );
}

function EditorError({ message }) {
  if (!message) return null;
  return (
    <div
      data-testid="spec-editor-error"
      className="mt-3 text-xs font-mono"
      style={{ color: "var(--state-error)" }}
    >
      × {message}
    </div>
  );
}

function SamplePillRow({ onUse, disabled }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {SAMPLE_SPECS.map((s) => (
        <SamplePill key={s} text={s} onUse={onUse} disabled={disabled} />
      ))}
    </div>
  );
}

function SpecTextarea({ value, onChange, disabled }) {
  return (
    <textarea
      data-testid="spec-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder="e.g. Build a FastAPI + React todo app with MongoDB…"
      className="input-base mt-4 h-28 resize-none"
    />
  );
}

function useSpecEditor(busy, onRunStarted) {
  const [spec, setSpec] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const launch = async () => {
    if (!canLaunch(spec, submitting, busy)) return;
    setSubmitting(true);
    setError(null);
    try {
      const { run } = await createRun(spec.trim());
      await startRun(run.id);
      onRunStarted?.(run.id);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return { spec, setSpec, submitting, error, launch };
}

export default function SpecEditor({ onRunStarted, busy }) {
  const { spec, setSpec, submitting, error, launch } = useSpecEditor(
    busy,
    onRunStarted
  );
  const isLocked = submitting || busy;
  const enabled = canLaunch(spec, submitting, busy);

  return (
    <section className="surface p-5 rounded-sm" data-testid="spec-editor">
      <EditorHeader />
      <EditorHelp />
      <SpecTextarea value={spec} onChange={setSpec} disabled={isLocked} />
      <SamplePillRow onUse={setSpec} disabled={isLocked} />
      <EditorError message={error} />
      <button
        type="button"
        onClick={launch}
        disabled={!enabled}
        className="btn-primary mt-3 w-full justify-center"
        data-testid="launch-pipeline-btn"
      >
        <LaunchButtonContent isLocked={isLocked} />
      </button>
    </section>
  );
}
