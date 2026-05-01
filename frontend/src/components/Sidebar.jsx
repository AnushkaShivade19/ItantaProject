import React from "react";
import {
  Cube,
  GitBranch,
  ListChecks,
  TestTube,
  FileCode,
  ShieldCheck,
  Lifebuoy,
  Gear,
  FolderOpen,
  ClockCounterClockwise,
} from "@phosphor-icons/react";

const items = [
  { id: "dashboard", label: "Pipeline", icon: Cube },
  { id: "runs", label: "Runs", icon: ClockCounterClockwise },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "config", label: "Config", icon: Gear },
];

const agentList = [
  { id: "intake", label: "Intake", icon: GitBranch },
  { id: "architect", label: "Architect", icon: Cube },
  { id: "planner", label: "Planner", icon: ListChecks },
  { id: "qa", label: "QA · TDD", icon: TestTube },
  { id: "coder", label: "Coder", icon: FileCode },
  { id: "validator", label: "Validator", icon: ShieldCheck },
  { id: "recovery", label: "Recovery", icon: Lifebuoy },
];

export default function Sidebar({ active = "dashboard", onSelect }) {
  return (
    <aside
      data-testid="app-sidebar"
      className="hidden md:flex flex-col border-r h-[calc(100vh-3.5rem)]"
      style={{ borderColor: "var(--border)", width: 240, background: "var(--bg)" }}
    >
      <div className="p-4">
        <div className="overline mb-3">workspace</div>
        <ul className="space-y-1">
          {items.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                data-testid={`nav-${id}`}
                onClick={() => onSelect?.(id)}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm transition-colors"
                style={{
                  background:
                    active === id ? "var(--surface-elevated)" : "transparent",
                  color:
                    active === id ? "var(--text-primary)" : "var(--text-secondary)",
                }}
              >
                <Icon size={14} weight={active === id ? "fill" : "regular"} />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-2 p-4 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="overline mb-3">agents</div>
        <ul className="space-y-0.5">
          {agentList.map(({ id, label, icon: Icon }) => (
            <li
              key={id}
              className="flex items-center gap-2 px-2 py-1 text-[13px] text-secondary-ink"
              data-testid={`sidebar-agent-${id}`}
            >
              <Icon size={13} />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto p-4 border-t text-[11px] font-mono text-muted-ink"
           style={{ borderColor: "var(--border)" }}>
        <div>$ agentic --phase 1</div>
        <div className="opacity-60">scaffold complete</div>
      </div>
    </aside>
  );
}
