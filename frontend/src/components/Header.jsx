import { Terminal, GithubLogo } from "@phosphor-icons/react";
import StatusPill from "./StatusPill";
import { HEADER_ICON_SIZE } from "../lib/constants";

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-7 h-7 grid place-items-center"
        style={{ background: "var(--brand)", color: "var(--brand-fg)" }}
      >
        <Terminal size={HEADER_ICON_SIZE} weight="bold" />
      </div>
      <div className="flex items-baseline gap-3">
        <span className="font-heading font-medium tracking-tight text-[15px]">
          agentic.dev
        </span>
        <span className="overline">Software Generation Framework</span>
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

function GroqPill({ configured }) {
  const color = configured ? "var(--state-success)" : "var(--state-warning)";
  const value = configured ? "configured" : "unset";
  return (
    <StatusPill
      label="GROQ"
      value={value}
      color={color}
      testId="groq-status-dot"
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
      <div className="flex items-center justify-between px-6 h-14">
        <Brand />
        <div className="flex items-center gap-5">
          <HealthPill health={health} />
          <GroqPill configured={!!health?.groq_key_configured} />
          <a
            href="https://console.groq.com/keys"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary text-xs"
            data-testid="groq-key-link"
          >
            <GithubLogo size={14} />
            Get API Key
          </a>
        </div>
      </div>
    </header>
  );
}
