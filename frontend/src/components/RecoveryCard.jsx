import { Lifebuoy, WarningCircle } from "@phosphor-icons/react";

const extractFeedback = (tasks) => {
  const feedbacks = [];
  for (const t of tasks || []) {
    const match = t.detail?.match(/\[RECOVERY FEEDBACK\]\n([\s\S]+)$/);
    if (match) {
      feedbacks.push({ task_id: t.id, title: t.title, feedback: match[1].trim() });
    }
  }
  return feedbacks;
};

export default function RecoveryCard({ run }) {
  const feedbacks = extractFeedback(run?.tasks);

  if (feedbacks.length === 0) {
    return (
      <section className="surface p-5 rounded-sm fade-in border border-[var(--border)]">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="overline mb-1 flex items-center gap-1">
              <Lifebuoy size={12} color="var(--text-muted)" />
              recovery · pending
            </div>
            <h3 className="font-heading text-lg font-medium">Recovery Feedback</h3>
          </div>
        </div>
        <div className="text-muted-ink text-sm p-4 text-center border border-dashed rounded-sm" style={{ borderColor: "var(--border)" }}>
          No recovery feedback available. The Recovery agent only triggers if tests fail.
        </div>
      </section>
    );
  }

  return (
    <section className="surface p-5 rounded-sm fade-in" style={{ borderColor: "var(--state-warning)", borderWidth: '1px' }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="overline mb-1 flex items-center gap-1">
            <WarningCircle size={12} color="var(--state-warning)" />
            recovery · analysis complete
          </div>
          <h3 className="font-heading text-lg font-medium">Recovery Feedback</h3>
          <p className="text-[12px] text-secondary-ink mt-1 leading-relaxed">
            LLM diagnostic feedback based on test failures, passed to the QA and Coder agents.
          </p>
        </div>
      </div>
      
      <div className="space-y-4 mt-4">
        {feedbacks.map((item, idx) => (
          <div key={idx} className="border p-4 rounded-sm" style={{ borderColor: "var(--border)", background: "rgba(245, 158, 11, 0.05)" }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[10px] text-muted-ink shrink-0">{item.task_id}</span>
              <span className="text-[12px] font-mono text-primary-ink truncate flex-1">{item.title}</span>
            </div>
            <pre className="text-[11px] font-mono whitespace-pre-wrap text-secondary-ink">
              {item.feedback}
            </pre>
          </div>
        ))}
      </div>
    </section>
  );
}
