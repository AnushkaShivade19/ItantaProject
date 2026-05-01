import React from "react";
import {
  GitBranch,
  Cube,
  ListChecks,
  TestTube,
  FileCode,
  ShieldCheck,
  Lifebuoy,
  CaretRight,
} from "@phosphor-icons/react";

const iconFor = {
  intake: GitBranch,
  architect: Cube,
  planner: ListChecks,
  qa: TestTube,
  coder: FileCode,
  validator: ShieldCheck,
  recovery: Lifebuoy,
};

export default function AgentPipeline({ pipeline = [], statuses = {} }) {
  return (
    <section
      data-testid="agent-pipeline"
      className="surface p-5 md:p-6 rounded-sm"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="overline mb-1">pipeline</div>
          <h2 className="font-heading text-xl tracking-tight font-medium">
            Agent Execution Graph
          </h2>
        </div>
        <span className="text-xs font-mono text-muted-ink">
          TDD-first · {pipeline.length} agents
        </span>
      </div>

      <div className="flex items-stretch overflow-x-auto pb-2">
        {pipeline.map((node, i) => {
          const Icon = iconFor[node.name] || Cube;
          const status = statuses[node.name] || "idle";
          return (
            <React.Fragment key={node.name}>
              <div
                data-testid={`agent-node-${node.name}`}
                data-status={status}
                className="agent-node flex flex-col gap-2 px-4 py-3 min-w-[160px] rounded-sm fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center justify-between">
                  <Icon
                    size={18}
                    weight={status === "running" ? "fill" : "regular"}
                    color={
                      status === "running"
                        ? "var(--state-running)"
                        : status === "success"
                        ? "var(--state-success)"
                        : status === "error"
                        ? "var(--state-error)"
                        : "var(--text-secondary)"
                    }
                  />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-ink">
                    0{i + 1}
                  </span>
                </div>
                <div className="font-heading text-[13px] font-medium">
                  {node.label}
                </div>
                <div className="text-[11px] text-secondary-ink leading-snug">
                  {node.desc}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background:
                        status === "running"
                          ? "var(--state-running)"
                          : status === "success"
                          ? "var(--state-success)"
                          : status === "error"
                          ? "var(--state-error)"
                          : "var(--text-muted)",
                    }}
                  />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-ink">
                    {status}
                  </span>
                </div>
              </div>
              {i < pipeline.length - 1 && (
                <div className="flex items-center px-1">
                  <div
                    className="pipeline-connector w-6 md:w-8"
                    data-active={statuses[node.name] === "running"}
                  />
                  <CaretRight
                    size={12}
                    color="var(--text-muted)"
                    className="-ml-1"
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}
