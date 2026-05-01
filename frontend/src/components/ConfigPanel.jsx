import React from "react";
import { Cpu, Thermometer } from "@phosphor-icons/react";

export default function ConfigPanel({ config, agents }) {
  if (!config) return null;
  return (
    <section
      data-testid="config-panel"
      className="surface p-5 md:p-6 rounded-sm"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="overline mb-1">runtime configuration</div>
          <h2 className="font-heading text-xl tracking-tight font-medium">
            LLM Agents · Groq
          </h2>
        </div>
        <div className="text-xs font-mono text-muted-ink">
          mode = {config.framework?.mode} · retries = {config.retry?.max_attempts}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px]"
           style={{ background: "var(--border)" }}>
        {agents.map((a) => (
          <div
            key={a.name}
            data-testid={`agent-config-${a.name}`}
            className="p-4 flex flex-col gap-2"
            style={{ background: "var(--surface)" }}
          >
            <div className="flex items-center justify-between">
              <span className="font-heading text-[13px] font-medium uppercase tracking-wide">
                {a.name}
              </span>
              <span className="text-[10px] font-mono text-muted-ink">
                agent
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] font-mono text-secondary-ink">
              <Cpu size={12} />
              <span className="truncate">{a.model}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] font-mono text-muted-ink">
              <Thermometer size={12} />
              <span>temp · {a.temperature}</span>
            </div>
            <p className="text-[11px] text-secondary-ink leading-snug mt-1">
              {a.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
