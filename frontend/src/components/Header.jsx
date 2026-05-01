import React from "react";
import { Terminal, GithubLogo, Circle } from "@phosphor-icons/react";

export default function Header({ health }) {
  const connected = !!health && health.status === "ok";
  return (
    <header
      data-testid="app-header"
      className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/80 border-b"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 grid place-items-center"
            style={{ background: "var(--brand)", color: "var(--brand-fg)" }}
          >
            <Terminal size={16} weight="bold" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-heading font-medium tracking-tight text-[15px]">
              agentic.dev
            </span>
            <span className="overline">Software Generation Framework</span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 text-xs font-mono">
            <Circle
              size={8}
              weight="fill"
              color={connected ? "var(--state-success)" : "var(--state-error)"}
            />
            <span className="text-secondary-ink">
              {connected ? `v${health.version}` : "offline"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-muted-ink">GROQ</span>
            <Circle
              size={8}
              weight="fill"
              color={
                health?.groq_key_configured
                  ? "var(--state-success)"
                  : "var(--state-warning)"
              }
              data-testid="groq-status-dot"
            />
            <span className="text-secondary-ink">
              {health?.groq_key_configured ? "configured" : "unset"}
            </span>
          </div>
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
