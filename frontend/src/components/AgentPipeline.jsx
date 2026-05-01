import { Fragment } from "react";
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
import { AGENT_NODE_MIN_WIDTH_PX, agentColor } from "../lib/constants";

const AGENT_ICON = {
  intake: GitBranch,
  architect: Cube,
  planner: ListChecks,
  qa: TestTube,
  coder: FileCode,
  validator: ShieldCheck,
  recovery: Lifebuoy,
};

const resolveIcon = (name) => AGENT_ICON[name] || Cube;
const iconWeight = (status) => (status === "running" ? "fill" : "regular");
const stepLabel = (i) => `0${i + 1}`;

function AgentCardHeader({ Icon, status, index }) {
  return (
    <div className="flex items-center justify-between">
      <Icon size={18} weight={iconWeight(status)} color={agentColor(status)} />
      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-ink">
        {stepLabel(index)}
      </span>
    </div>
  );
}

function AgentCardStatus({ status }) {
  return (
    <div className="flex items-center gap-1.5 mt-1">
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: agentColor(status) }}
      />
      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-ink">
        {status}
      </span>
    </div>
  );
}

function AgentCard({ node, index, status }) {
  const Icon = resolveIcon(node.name);
  return (
    <div
      data-testid={`agent-node-${node.name}`}
      data-status={status}
      className="agent-node flex flex-col gap-2 px-4 py-3 rounded-sm fade-in"
      style={{
        minWidth: AGENT_NODE_MIN_WIDTH_PX,
        animationDelay: `${index * 60}ms`,
      }}
    >
      <AgentCardHeader Icon={Icon} status={status} index={index} />
      <div className="font-heading text-[13px] font-medium">{node.label}</div>
      <div className="text-[11px] text-secondary-ink leading-snug">{node.desc}</div>
      <AgentCardStatus status={status} />
    </div>
  );
}

function PipelineConnector({ active }) {
  return (
    <div className="flex items-center px-1">
      <div className="pipeline-connector w-6 md:w-8" data-active={active} />
      <CaretRight size={12} color="var(--text-muted)" className="-ml-1" />
    </div>
  );
}

function PipelineHeader({ count }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <div className="overline mb-1">pipeline</div>
        <h2 className="font-heading text-xl tracking-tight font-medium">
          Agent Execution Graph
        </h2>
      </div>
      <span className="text-xs font-mono text-muted-ink">
        TDD-first · {count} agents
      </span>
    </div>
  );
}

export default function AgentPipeline({ pipeline = [], statuses = {} }) {
  return (
    <section data-testid="agent-pipeline" className="surface p-5 md:p-6 rounded-sm">
      <PipelineHeader count={pipeline.length} />
      <div className="flex items-stretch overflow-x-auto pb-2">
        {pipeline.map((node, i) => {
          const status = statuses[node.name] || "idle";
          const isLast = i === pipeline.length - 1;
          return (
            <Fragment key={node.name}>
              <AgentCard node={node} index={i} status={status} />
              {!isLast && <PipelineConnector active={status === "running"} />}
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}
