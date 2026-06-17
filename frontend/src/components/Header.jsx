import { Terminal, GithubLogo } from "@phosphor-icons/react";
import StatusPill from "./StatusPill";
import { HEADER_ICON_SIZE } from "../lib/constants";

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 grid place-items-center rounded-sm"
        style={{ background: "var(--brand)", color: "var(--brand-fg)" }}
      >
        <Terminal size={HEADER_ICON_SIZE + 4} weight="bold" />
      </div>
      <div className="flex items-baseline gap-3">
        <span className="font-heading font-black tracking-tight text-3xl">
          Skynet
        </span>
      </div>
    </div>
  );
}

function HealthPill({ health }) {
  const connected = !!health && health.status === "ok";
  const color = connected ? "var(--state-success)" : "var(--state-error)";
  const value = connected ? `v${health.version}` : "offline";
  return <StatusPill value={value} color={color} testId="health-pill" />;
}

function SkynetPill({ configured }) {
  const color = configured ? "var(--state-success)" : "var(--state-warning)";
  const value = configured ? "configured" : "unset";
  return (
    <StatusPill
      label="SKYNET"
      value={value}
      color={color}
      testId="skynet-status-dot"
    />
  );
}

export default function Header({ health }) {
  return (
    <header
      data-testid="app-header"
      className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/80 border-b"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between px-6 h-16">
        <Brand />
        <div className="flex items-center gap-5">
          <HealthPill health={health} />
          <SkynetPill configured={!!health?.groq_key_configured} />
        </div>
      </div>
    </header>
  );
}
