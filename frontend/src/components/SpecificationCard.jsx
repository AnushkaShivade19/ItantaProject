import { FileText, ListBullets, Wall, CheckSquare, Stack } from "@phosphor-icons/react";

const isReady = (spec) => spec && spec.mode === "spec" && spec.project_name;

function SectionHeading({ Icon, label, count }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-1.5">
        <Icon size={12} weight="fill" color="var(--text-secondary)" />
        <span className="overline">{label}</span>
      </div>
      {typeof count === "number" && (
        <span className="text-[10px] font-mono text-muted-ink">{count}</span>
      )}
    </div>
  );
}

function BulletList({ items, testId }) {
  if (!items || items.length === 0) {
    return <div className="text-[12px] text-muted-ink font-mono">—</div>;
  }
  return (
    <ul className="space-y-1" data-testid={testId}>
      {items.map((item, i) => (
        <li key={`${testId}-${i}`} className="text-[13px] text-secondary-ink leading-snug flex gap-2">
          <span className="text-muted-ink font-mono shrink-0">·</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function TechStack({ stack }) {
  if (!stack) return null;
  const entries = Object.entries(stack).filter(([, v]) =>
    Array.isArray(v) ? v.length > 0 : !!v
  );
  if (entries.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
      {entries.map(([k, v]) => (
        <div key={k} className="flex items-baseline gap-2">
          <span className="text-[10px] font-mono text-muted-ink uppercase tracking-wider shrink-0">
            {k}
          </span>
          <span className="text-[12px] font-mono text-primary-ink truncate">
            {Array.isArray(v) ? v.join(", ") : v}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Renders the final structured specification emitted by the Intake
 * Agent (mode: "spec"). Stays hidden until the spec is ready.
 */
export default function SpecificationCard({ run }) {
  const spec = run?.specification;
  if (!isReady(spec)) return null;

  return (
    <section
      className="surface p-5 rounded-sm fade-in"
      data-testid="specification-card"
      style={{ borderColor: "rgba(16, 185, 129, 0.3)" }}
    >
      <div className="flex items-start justify-between mb-3 gap-3">
        <div>
          <div className="overline mb-1 flex items-center gap-1">
            <FileText size={10} weight="fill" color="var(--state-success)" />
            specification · ready
          </div>
          <h3 className="font-heading text-lg font-medium">
            {spec.project_name}
          </h3>
          {spec.description && (
            <p className="text-[12px] text-secondary-ink mt-1 leading-relaxed">
              {spec.description}
            </p>
          )}
        </div>
        <span className="text-[10px] font-mono text-muted-ink whitespace-nowrap">
          intake · v1
        </span>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <SectionHeading Icon={Stack} label="tech stack" />
          <TechStack stack={spec.tech_stack} />
        </div>

        <div>
          <SectionHeading
            Icon={ListBullets}
            label="features"
            count={spec.features?.length}
          />
          <BulletList items={spec.features} testId="spec-features" />
        </div>

        {spec.constraints?.length > 0 && (
          <div>
            <SectionHeading
              Icon={Wall}
              label="constraints"
              count={spec.constraints.length}
            />
            <BulletList items={spec.constraints} testId="spec-constraints" />
          </div>
        )}

        <div>
          <SectionHeading
            Icon={CheckSquare}
            label="acceptance criteria"
            count={spec.acceptance_criteria?.length}
          />
          <BulletList
            items={spec.acceptance_criteria}
            testId="spec-acceptance"
          />
        </div>

        {spec.clarifications?.length > 0 && (
          <div>
            <SectionHeading
              Icon={FileText}
              label="clarifications"
              count={spec.clarifications.length}
            />
            <div className="space-y-2">
              {spec.clarifications.map((c, i) => (
                <div key={i} className="text-[12px]">
                  <div className="text-muted-ink font-mono">Q: {c.question}</div>
                  <div className="text-primary-ink">A: {c.answer}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
