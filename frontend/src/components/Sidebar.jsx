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
import {
  NAV_ICON_SIZE,
  SIDEBAR_ICON_SIZE,
  SIDEBAR_WIDTH_PX,
} from "../lib/constants";

const NAV_ITEMS = [
  { id: "dashboard", label: "Pipeline", icon: Cube },
  { id: "runs", label: "Runs", icon: ClockCounterClockwise },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "config", label: "Config", icon: Gear },
];

const AGENT_ITEMS = [
  { id: "intake", label: "Intake", icon: GitBranch },
  { id: "architect", label: "Architect", icon: Cube },
  { id: "planner", label: "Planner", icon: ListChecks },
  { id: "qa", label: "QA · TDD", icon: TestTube },
  { id: "coder", label: "Coder", icon: FileCode },
  { id: "validator", label: "Validator", icon: ShieldCheck },
  { id: "recovery", label: "Recovery", icon: Lifebuoy },
];

function NavButton({ item, active, onSelect }) {
  const Icon = item.icon;
  const isActive = active === item.id;
  return (
    <button
      data-testid={`nav-${item.id}`}
      onClick={() => onSelect?.(item.id)}
      className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm transition-colors"
      style={{
        background: isActive ? "var(--surface-elevated)" : "transparent",
        color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
      }}
    >
      <Icon size={NAV_ICON_SIZE} weight={isActive ? "fill" : "regular"} />
      {item.label}
    </button>
  );
}

function AgentRow({ item }) {
  const Icon = item.icon;
  return (
    <li
      className="flex items-center gap-2 px-2 py-1 text-[13px] text-secondary-ink"
      data-testid={`sidebar-agent-${item.id}`}
    >
      <Icon size={SIDEBAR_ICON_SIZE} />
      <span>{item.label}</span>
    </li>
  );
}

function SidebarFooter() {
  return (
    <div
      className="mt-auto p-4 border-t text-[11px] font-mono text-muted-ink"
      style={{ borderColor: "var(--border)" }}
    >
      <div>$ agentic --phase 1</div>
      <div className="opacity-60">scaffold complete</div>
    </div>
  );
}

export default function Sidebar({ active = "dashboard", onSelect }) {
  return (
    <aside
      data-testid="app-sidebar"
      className="hidden md:flex flex-col border-r h-[calc(100vh-3.5rem)]"
      style={{
        borderColor: "var(--border)",
        width: SIDEBAR_WIDTH_PX,
        background: "var(--bg)",
      }}
    >
      <div className="p-4">
        <div className="overline mb-3">workspace</div>
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <NavButton item={item} active={active} onSelect={onSelect} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-2 p-4 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="overline mb-3">agents</div>
        <ul className="space-y-0.5">
          {AGENT_ITEMS.map((item) => (
            <AgentRow key={item.id} item={item} />
          ))}
        </ul>
      </div>

      <SidebarFooter />
    </aside>
  );
}
