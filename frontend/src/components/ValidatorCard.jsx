import { ShieldCheck, CheckCircle, XCircle } from "@phosphor-icons/react";

export default function ValidatorCard({ run }) {
  const results = run?.test_results;
  
  if (!results) {
    return (
      <section className="surface p-5 rounded-sm fade-in border border-[var(--border)]">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="overline mb-1 flex items-center gap-1">
              <ShieldCheck size={12} color="var(--text-muted)" />
              validator · pending
            </div>
            <h3 className="font-heading text-lg font-medium">Test Results</h3>
          </div>
        </div>
        <div className="text-muted-ink text-sm p-4 text-center border border-dashed rounded-sm" style={{ borderColor: "var(--border)" }}>
          No validation results available yet. The Validator agent will execute tests once code is generated.
        </div>
      </section>
    );
  }

  const isPassed = results.passed;

  return (
    <section className="surface p-5 rounded-sm fade-in" style={{ borderColor: isPassed ? "var(--state-success)" : "var(--state-error)", borderWidth: '1px' }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="overline mb-1 flex items-center gap-1">
            {isPassed ? (
              <CheckCircle size={12} color="var(--state-success)" />
            ) : (
              <XCircle size={12} color="var(--state-error)" />
            )}
            validator · test execution
          </div>
          <h3 className="font-heading text-lg font-medium">Test Results</h3>
          <p className="text-[12px] text-secondary-ink mt-1 leading-relaxed">
            Raw output from the pytest execution suite.
          </p>
        </div>
      </div>
      
      <pre className="text-[11px] font-mono p-4 rounded-sm overflow-x-auto whitespace-pre-wrap"
           style={{ background: "#050505", color: isPassed ? "var(--state-success)" : "var(--state-error)", border: "1px solid var(--border)", maxHeight: "500px", overflowY: "auto" }}>
        {results.output || "No output provided."}
      </pre>
    </section>
  );
}
