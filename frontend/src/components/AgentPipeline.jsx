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
      <Icon size={24} weight={iconWeight(status)} color={agentColor(status)} />
      <span className="text-xs font-mono uppercase tracking-wider text-muted-ink">
        {stepLabel(index)}
      </span>
    </div>
  );
}

function AgentCardStatus({ status }) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <span
        className="w-2.5 h-2.5 rounded-full"
        style={{ background: agentColor(status) }}
      />
      <span className="text-xs font-mono uppercase tracking-wider text-muted-ink font-semibold">
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
      className="agent-node flex flex-col gap-3 px-5 py-4 rounded-xl fade-in shadow-sm hover:shadow-md transition-shadow duration-300 relative z-10 bg-surface h-full"
      style={{
        width: AGENT_NODE_MIN_WIDTH_PX + 40,
        minWidth: AGENT_NODE_MIN_WIDTH_PX + 40,
        animationDelay: `${index * 60}ms`,
      }}
    >
      <AgentCardHeader Icon={Icon} status={status} index={index} />
      <div className="font-heading text-lg font-semibold">{node.label}</div>
      <div className="text-sm text-secondary-ink leading-relaxed flex-1">{node.desc}</div>
      <AgentCardStatus status={status} />
    </div>
  );
}

function PipelineConnector({ active }) {
  return (
    <div className="flex items-center justify-center w-full h-full relative z-10 px-1">
      <div className="pipeline-connector w-full" data-active={active} />
      <CaretRight size={12} color="var(--text-muted)" className="-ml-1 flex-shrink-0" />
    </div>
  );
}

function PipelineHeader({ count }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <div className="overline mb-2 text-sm tracking-widest">pipeline</div>
        <h2 className="font-heading text-2xl tracking-tight font-semibold">
          Agent Execution Graph
        </h2>
      </div>
      <span className="text-sm font-mono text-muted-ink bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full">
        TDD-first · {count} agents
      </span>
    </div>
  );
}

export default function AgentPipeline({ pipeline = [], statuses = {} }) {
  const mainNodes = pipeline.slice(0, 7);
  const recoveryNode = pipeline.find(n => n.name === "recovery");
  const CARD_W = AGENT_NODE_MIN_WIDTH_PX + 40; // 200px
  const CONN_W = 40; // 40px
  const CARD_H = 160;
  const ROW_GAP = 60;
  
  const totalWidth = 7 * CARD_W + 6 * CONN_W;
  const totalHeight = 2 * CARD_H + ROW_GAP;

  return (
    <section data-testid="agent-pipeline" className="surface p-6 md:p-8 rounded-2xl shadow-lg border border-[var(--border-subtle)] overflow-hidden">
      <PipelineHeader count={pipeline.length} />
      <div className="overflow-x-auto pb-4 custom-scrollbar relative">
        <div className="relative" style={{ width: totalWidth, height: totalHeight }}>
          
          {/* Main Pipeline Row */}
          <div className="absolute top-0 left-0 flex items-stretch h-[160px] z-10">
            {mainNodes.map((node, i) => {
              const status = statuses[node.name] || "idle";
              const isLast = i === mainNodes.length - 1;
              return (
                <Fragment key={node.name}>
                  <AgentCard node={node} index={i} status={status} />
                  {!isLast && (
                    <div style={{ width: CONN_W, minWidth: CONN_W }} className="flex justify-center items-center">
                      <PipelineConnector active={status === "running"} />
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>

          {/* Recovery Node Row */}
          {recoveryNode && (
            <div 
              className="absolute z-10" 
              style={{ 
                top: CARD_H + ROW_GAP, 
                left: 6 * (CARD_W + CONN_W), // Exact left edge of Validator
                width: CARD_W,
                height: CARD_H 
              }}
            >
              <AgentCard node={recoveryNode} index={7} status={statuses.recovery || "idle"} />
            </div>
          )}

          {/* SVG Arrows Layer */}
          {recoveryNode && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ minHeight: totalHeight }}>
              <defs>
                <marker id="arrowhead-down" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="var(--state-error)" />
                </marker>
                <marker id="arrowhead-up" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="var(--state-warning)" />
                </marker>
              </defs>
              
              {/* Validator to Recovery (Down) */}
              <path 
                d={`M ${6 * (CARD_W + CONN_W) + CARD_W/2} ${CARD_H} L ${6 * (CARD_W + CONN_W) + CARD_W/2} ${CARD_H + ROW_GAP - 10}`}
                stroke="var(--state-error)" 
                strokeWidth="2" 
                strokeDasharray="4 4"
                fill="none" 
                markerEnd="url(#arrowhead-down)" 
              />

              {/* Recovery to QA (Left & Up) */}
              <path 
                d={`M ${6 * (CARD_W + CONN_W) - 10} ${CARD_H + ROW_GAP + CARD_H/2} L ${3 * (CARD_W + CONN_W) + CARD_W/2} ${CARD_H + ROW_GAP + CARD_H/2} L ${3 * (CARD_W + CONN_W) + CARD_W/2} ${CARD_H + 10}`}
                stroke="var(--state-warning)" 
                strokeWidth="2" 
                strokeDasharray="4 4"
                fill="none" 
                markerEnd="url(#arrowhead-up)" 
              />
            </svg>
          )}
        </div>
      </div>
    </section>
  );
}
