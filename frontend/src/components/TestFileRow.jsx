import { useState } from "react";
import {
  TestTube,
  CaretDown,
  CaretRight,
} from "@phosphor-icons/react";
import { fetchRunFile } from "../lib/api";

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

export function TestFileRow({ runId, file }) {
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
