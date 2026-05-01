import { useState } from "react";
import {
  Code,
  CaretDown,
  CaretRight,
  FileCode,
  CheckCircle,
} from "@phosphor-icons/react";
import { fetchRunFile } from "../lib/api";

const collectCodeFiles = (tasks) => {
  const out = [];
  for (const t of tasks || []) {
    if (!t.code_file_paths || t.code_file_paths.length === 0) continue;
    for (const p of t.code_file_paths) {
      out.push({ task_id: t.id, task_title: t.title, path: p });
    }
  }
  return out;
};

function FileBody({ content, error }) {
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

function FileHeader({ file, expanded, onToggle, loading }) {
  const Caret = expanded ? CaretDown : CaretRight;
  const filename = file.path.split("/").slice(-1)[0];
  return (
    <div
      className="flex items-center gap-2 cursor-pointer py-1.5"
      onClick={onToggle}
      data-testid={`code-file-row-${file.path}`}
    >
      <Caret size={12} color="var(--text-muted)" />
      <FileCode size={12} color="var(--state-success)" />
      <span className="font-mono text-[11px] text-muted-ink shrink-0">
        {file.task_id}
      </span>
      <span className="text-[12px] font-mono text-primary-ink truncate flex-1">
        {file.path.replace(/^output_projects\/[^/]+\//, "")}
      </span>
      <span className="text-[10px] font-mono text-muted-ink shrink-0">
        {filename}
      </span>
      {loading && (
        <span className="text-[10px] font-mono text-muted-ink">loading…</span>
      )}
    </div>
  );
}

function FileRow({ runId, file }) {
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
      <FileHeader file={file} expanded={expanded} onToggle={toggle} loading={loading} />
      {expanded && (
        <div className="pb-3">
          <FileBody content={content || ""} error={error} />
        </div>
      )}
    </div>
  );
}

function CardHeader({ count, taskCount }) {
  return (
    <div className="flex items-start justify-between mb-3 gap-3">
      <div>
        <div className="overline mb-1 flex items-center gap-1">
          <CheckCircle size={10} weight="fill" color="var(--state-success)" />
          coder · implementation written
        </div>
        <h3 className="font-heading text-lg font-medium">Generated Code</h3>
        <p className="text-[12px] text-secondary-ink mt-1 leading-relaxed">
          One implementation per task — written to make the failing tests pass.
        </p>
      </div>
      <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-ink whitespace-nowrap">
        <Code size={10} />
        <span>
          {count} files · {taskCount} tasks
        </span>
      </div>
    </div>
  );
}

export default function CodeFilesCard({ run }) {
  const files = collectCodeFiles(run?.tasks);
  if (!run || files.length === 0) return null;
  const taskCount = new Set(files.map((f) => f.task_id)).size;
  return (
    <section
      className="surface p-5 rounded-sm fade-in"
      data-testid="code-files-card"
      style={{ borderColor: "rgba(16, 185, 129, 0.3)" }}
    >
      <CardHeader count={files.length} taskCount={taskCount} />
      <div className="mt-2">
        {files.map((f) => (
          <FileRow key={f.path} runId={run.id} file={f} />
        ))}
      </div>
    </section>
  );
}
