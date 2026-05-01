import { useState } from "react";
import {
  ListChecks,
  CaretDown,
  CaretRight,
  TestTube,
  ArrowsClockwise,
  File,
} from "@phosphor-icons/react";

const TASK_STATUS_COLOR = {
  pending: "var(--text-muted)",
  in_progress: "var(--state-running)",
  passed: "var(--state-success)",
  failed: "var(--state-error)",
};

const taskColor = (status) =>
  TASK_STATUS_COLOR[status] || TASK_STATUS_COLOR.pending;

function StatusPip({ status }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider"
      style={{ color: taskColor(status) }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: taskColor(status) }}
      />
      {status}
    </span>
  );
}

function TaskMeta({ files, depends_on, test_focus }) {
  return (
    <div className="mt-2 space-y-1.5">
      {test_focus && (
        <div className="flex items-start gap-1.5 text-[11px]">
          <TestTube size={11} color="var(--state-running)" />
          <span className="text-secondary-ink leading-snug">{test_focus}</span>
        </div>
      )}
      {files?.length > 0 && (
        <div className="flex items-start gap-1.5 text-[11px]">
          <File size={11} color="var(--text-muted)" />
          <div className="flex flex-wrap gap-1">
            {files.map((f) => (
              <span
                key={f}
                className="font-mono text-secondary-ink px-1.5 py-0.5 rounded-sm"
                style={{ background: "var(--surface-elevated)" }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      )}
      {depends_on?.length > 0 && (
        <div className="flex items-start gap-1.5 text-[11px]">
          <ArrowsClockwise size={11} color="var(--text-muted)" />
          <span className="font-mono text-muted-ink">
            after · {depends_on.join(", ")}
          </span>
        </div>
      )}
    </div>
  );
}

function TaskRow({ task, expanded, onToggle }) {
  return (
    <div
      className="py-2 border-b last:border-0"
      style={{ borderColor: "var(--border)" }}
      data-testid={`task-row-${task.id}`}
    >
      <div
        className="flex items-start gap-2 cursor-pointer"
        onClick={onToggle}
      >
        {expanded ? (
          <CaretDown size={12} color="var(--text-muted)" className="mt-0.5" />
        ) : (
          <CaretRight size={12} color="var(--text-muted)" className="mt-0.5" />
        )}
        <span className="font-mono text-[11px] text-muted-ink shrink-0 mt-0.5">
          {task.id}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] text-primary-ink truncate">
              {task.title}
            </span>
            <StatusPip status={task.status} />
          </div>
          {expanded && task.detail && (
            <p className="text-[12px] text-secondary-ink mt-1 leading-relaxed">
              {task.detail}
            </p>
          )}
          {expanded && (
            <TaskMeta
              files={task.files}
              depends_on={task.depends_on}
              test_focus={task.test_focus}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TaskListHeader({ count, passed, failed }) {
  return (
    <div className="flex items-start justify-between mb-3 gap-3">
      <div>
        <div className="overline mb-1 flex items-center gap-1">
          <ListChecks size={10} weight="fill" color="var(--state-success)" />
          plan · ready
        </div>
        <h3 className="font-heading text-lg font-medium">Atomic Tasks</h3>
      </div>
      <div className="flex items-center gap-3 text-[10px] font-mono">
        <span className="text-muted-ink">total · {count}</span>
        {passed > 0 && (
          <span style={{ color: "var(--state-success)" }}>passed · {passed}</span>
        )}
        {failed > 0 && (
          <span style={{ color: "var(--state-error)" }}>failed · {failed}</span>
        )}
      </div>
    </div>
  );
}

export default function TaskListCard({ run }) {
  const tasks = run?.tasks || [];
  const [expandedId, setExpandedId] = useState(null);

  if (tasks.length === 0) return null;

  const passed = tasks.filter((t) => t.status === "passed").length;
  const failed = tasks.filter((t) => t.status === "failed").length;

  const toggle = (id) => setExpandedId((curr) => (curr === id ? null : id));

  return (
    <section
      className="surface p-5 rounded-sm fade-in"
      data-testid="task-list-card"
      style={{ borderColor: "rgba(16, 185, 129, 0.3)" }}
    >
      <TaskListHeader count={tasks.length} passed={passed} failed={failed} />
      <div>
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            expanded={expandedId === task.id}
            onToggle={() => toggle(task.id)}
          />
        ))}
      </div>
    </section>
  );
}
