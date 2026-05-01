import React from "react";

/** Phase-1 log terminal shows scaffold / health events. */
export default function LogTerminal({ lines = [] }) {
  return (
    <section
      data-testid="log-terminal"
      className="log-terminal p-4 rounded-sm h-[260px] overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="overline">logs · framework.log</div>
        <span className="text-[10px] font-mono text-muted-ink">
          tail -f
        </span>
      </div>
      <div className="space-y-[2px]">
        {lines.map((l, i) => (
          <div key={i} className={`log-line log-line-${l.level}`}>
            <span className="text-muted-ink mr-2">{l.ts}</span>
            <span className="text-muted-ink mr-2">[{l.agent}]</span>
            <span>{l.msg}</span>
          </div>
        ))}
        <div className="log-line log-line-running caret-blink" />
      </div>
    </section>
  );
}
