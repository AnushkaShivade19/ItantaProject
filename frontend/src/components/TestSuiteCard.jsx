import { useState } from "react";
import {
  TestTube,
  Code,
  CaretDown,
  CaretRight,
  CheckCircle,
} from "@phosphor-icons/react";
import { fetchRunFile } from "../lib/api";

const collectTestFiles = (tasks) =>
  (tasks || [])
    .filter((t) => t.test_file_path)
    .map((t) => ({
      task_id: t.id,
      title: t.title,
      path: t.test_file_path,
      status: t.status,
    }));

function TestFileHeader({ file, expanded, onToggle, loading }) {
  const Caret = expanded ? CaretDown : CaretRight;
  return (
    <div
      className="flex items-center gap-2 cursor-pointer py-1.5"
      onClick={onToggle}
      data-testid={`test-file-row-${file.task_id}`}
    >
      <Caret size={12} color="var(--text-muted)" />
      <TestTube size={12} color="var(--state-running)" />
      <span className="font-mono text-[11px] text-muted-ink shrink-0">
        {file.task_id}
      </span>
      <span className="text-[12px] text-primary-ink truncate flex-1">
        {file.title}
      </span>
      <span className="text-[10px] font-mono text-muted-ink shrink-0">
        {file.path.split("/").slice(-1)[0]}
      </span>
      {loading && (
        <span className="text-[10px] font-mono text-muted-ink">loading…</span>
      )}
    </div>
  );
}

function TestFileBody({ content, error }) {
  if (error) {
    return (
      <div
        className="text-[11px] font-mono p-3 rounded-sm"
        style={{ background: "#1a0a0a", color: "var(--state-error)" }}
      >
        × {error}
      </div>
    );
  }
  return (
    <pre
      className="text-[11px] font-mono p-3 rounded-sm overflow-x-auto"
      style={{
        background: "#050505",
        color: "var(--text-secondary)",
        maxHeight: "320px",
        overflowY: "auto",
        border: "1px solid var(--border)",
      }}
    >
      <code>{content}</code>
    </pre>
  );
}

function TestFileRow({ runId, file }) {
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggle = async () => {
    const next = !expanded;
    setExpanded(next);
    if (next && content == null && !loading) {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchRunFile(runId, file.path);
        setContent(data.content);
      } catch (e) {
        setError(e?.response?.data?.detail || e?.message || "failed to load");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="border-b last:border-0"
      style={{ borderColor: "var(--border)" }}
    >
      <TestFileHeader
        file={file}
        expanded={expanded}
        onToggle={toggle}
        loading={loading}
      />
      {expanded && (
        <div className="pb-3">
          <TestFileBody content={content || ""} error={error} />
        </div>
      )}
    </div>
  );
}

function TestSuiteHeader({ count }) {
  return (
    <div className="flex items-start justify-between mb-3 gap-3">
      <div>
        <div className="overline mb-1 flex items-center gap-1">
          <CheckCircle size={10} weight="fill" color="var(--state-success)" />
          tdd · failing tests written
        </div>
        <h3 className="font-heading text-lg font-medium">Test Suite</h3>
        <p className="text-[12px] text-secondary-ink mt-1 leading-relaxed">
          One pytest file per task — these will fail until the Coder Agent
          implements them.
        </p>
      </div>
      <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-ink whitespace-nowrap">
        <Code size={10} />
        <span>{count} files</span>
      </div>
    </div>
  );
}

export default function TestSuiteCard({ run }) {
  const files = collectTestFiles(run?.tasks);
  if (!run || files.length === 0) return null;

  return (
    <section
      className="surface p-5 rounded-sm fade-in"
      data-testid="test-suite-card"
      style={{ borderColor: "rgba(16, 185, 129, 0.3)" }}
    >
      <TestSuiteHeader count={files.length} />
      <div className="mt-2">
        {files.map((f) => (
          <TestFileRow key={f.task_id} runId={run.id} file={f} />
        ))}
      </div>
    </section>
  );
}
