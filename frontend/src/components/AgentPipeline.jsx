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
  CheckCircle,
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
  const DisplayIcon = status === "success" ? CheckCircle : Icon;
  return (
    <div className="flex items-center justify-between">
      <DisplayIcon size={24} weight={iconWeight(status)} color={agentColor(status)} />
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
      className={`agent-node flex flex-col gap-3 px-5 py-4 rounded-xl fade-in shadow-sm hover:shadow-md transition-all duration-300 relative z-10 bg-surface h-full transform ${status === 'running' ? 'scale-[1.02]' : ''}`}
      style={{
        width: AGENT_NODE_MIN_WIDTH_PX + 50,
        minWidth: AGENT_NODE_MIN_WIDTH_PX + 50,
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

function PipelineHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="font-heading text-2xl tracking-tight font-semibold">
          Agent Execution Graph
        </h2>
      </div>
    </div>
  );
}

const DEFAULT_PIPELINE = [
  { name: "intake", label: "Intake", desc: "Process requirements" },
  { name: "architect", label: "Architect", desc: "Design system" },
  { name: "planner", label: "Planner", desc: "Create plan" },
  { name: "qa", label: "QA", desc: "Write tests" },
  { name: "coder", label: "Coder", desc: "Implement code" },
  { name: "validator", label: "Validator", desc: "Verify code" }
];

export default function AgentPipeline({ pipeline = [], statuses = {} }) {
  const activePipeline = pipeline && pipeline.length > 0 ? pipeline : DEFAULT_PIPELINE;
  const isFinished = statuses.validator === "success" || statuses.recovery === "success";
  
  const baseNodes = activePipeline.filter(n => n.name !== "recovery").slice(0, 6);
  const mainNodes = [...baseNodes, {
    name: "completed",
    label: "Completed",
    desc: "Deployment ready"
  }];
  const displayStatuses = { ...statuses, completed: isFinished ? "success" : "idle" };
  
  const recoveryNode = pipeline.find(n => n.name === "recovery") || { name: "recovery", label: "Recovery", desc: "Fix errors" };
  const CARD_W = AGENT_NODE_MIN_WIDTH_PX + 50; // Accommodate larger text and padding
  const CONN_W = 50; 
  const CARD_H = 190;
  const ROW_GAP = 80;
  
  const totalWidth = 7 * CARD_W + 6 * CONN_W;
  const totalHeight = 2 * CARD_H + ROW_GAP;

  return (
    <section data-testid="agent-pipeline" className="surface p-6 md:p-8 rounded-2xl shadow-lg border border-[var(--border-subtle)] overflow-hidden">
      <PipelineHeader />
      <div className="overflow-x-auto pb-4 custom-scrollbar relative">
        <div className="relative" style={{ width: totalWidth, height: totalHeight }}>
          
          {/* Main Pipeline Row */}
          <div className="absolute top-0 left-0 flex items-stretch h-[190px] z-10">
            {mainNodes.map((node, i) => {
              const status = displayStatuses[node.name] || "idle";
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
                left: 5 * (CARD_W + CONN_W), // Exact left edge of Validator (index 5)
                width: CARD_W,
                height: CARD_H 
              }}
            >
              <AgentCard node={recoveryNode} index={6} status={statuses.recovery || "idle"} />
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
                d={`M ${5 * (CARD_W + CONN_W) + CARD_W/2} ${CARD_H} L ${5 * (CARD_W + CONN_W) + CARD_W/2} ${CARD_H + ROW_GAP - 10}`}
                stroke="var(--state-error)" 
                strokeWidth="2" 
                strokeDasharray="4 4"
                fill="none" 
                markerEnd="url(#arrowhead-down)" 
              />

              {/* Recovery to QA (Left & Up) */}
              <path 
                d={`M ${5 * (CARD_W + CONN_W) - 10} ${CARD_H + ROW_GAP + CARD_H/2} L ${3 * (CARD_W + CONN_W) + CARD_W/2} ${CARD_H + ROW_GAP + CARD_H/2} L ${3 * (CARD_W + CONN_W) + CARD_W/2} ${CARD_H + 10}`}
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
