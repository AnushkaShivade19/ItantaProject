import React from "react";
import { CheckCircle, CircleDashed, Spinner } from "@phosphor-icons/react";

export default function PhaseBanner({ phases = [] }) {
  const completed = phases.filter((p) => p.status === "complete").length;
  const total = phases.length;
  const progress = total ? Math.round((completed / total) * 100) : 0;

  return (
    <section
      data-testid="phase-banner"
      className="surface p-5 md:p-6 rounded-sm relative overflow-hidden"
    >
      <div className="bg-grid absolute inset-0 opacity-50 pointer-events-none" />
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="overline mb-2">build phases · {completed}/{total}</div>
          <h1 className="font-heading text-2xl md:text-3xl tracking-tight font-medium">
            Agentic Software Development Framework
          </h1>
          <p className="text-sm text-secondary-ink mt-1 max-w-xl">
            Multi-agent pipeline that turns a natural-language spec into a full
            working project via TDD-first autonomous generation.
          </p>
        </div>
        <div className="min-w-[220px]">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-4xl tracking-tight">
              {progress}
              <span className="text-muted-ink text-2xl">%</span>
            </span>
            <span className="overline">build progress</span>
          </div>
          <div
            className="mt-2 h-1 rounded-none"
            style={{ background: "var(--border)" }}
          >
            <div
              className="h-1"
              style={{
                width: `${progress}%`,
                background: "var(--state-running)",
                transition: "width .6s ease",
              }}
            />
          </div>
        </div>
      </div>

      <div className="relative mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-[1px]"
           style={{ background: "var(--border)" }}>
        {phases.map((p, i) => {
          const Icon =
            p.status === "complete"
              ? CheckCircle
              : p.status === "current"
              ? Spinner
              : CircleDashed;
          const color =
            p.status === "complete"
              ? "var(--state-success)"
              : p.status === "current"
              ? "var(--state-running)"
              : "var(--text-muted)";
          return (
            <div
              key={p.id}
              data-testid={`phase-${p.id}`}
              className="p-3 flex flex-col gap-1"
              style={{ background: "var(--surface)" }}
            >
              <div className="flex items-center gap-1.5">
                <span className="phase-dot" data-status={p.status} />
                <span className="overline">phase {i + 1}</span>
              </div>
              <div className="font-heading text-[13px] font-medium mt-1 flex items-center gap-1.5">
                <Icon
                  size={13}
                  weight={p.status === "current" ? "fill" : "regular"}
                  color={color}
                  className={p.status === "current" ? "animate-spin" : ""}
                  style={{ animationDuration: "3s" }}
                />
                {p.title}
              </div>
              <div className="text-[11px] text-secondary-ink leading-snug">
                {p.description}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
