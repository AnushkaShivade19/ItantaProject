import { ShieldCheck, CheckCircle, XCircle } from "@phosphor-icons/react";
import { TestFileRow } from "./TestFileRow";

const collectTestFiles = (tasks) =>
  (tasks || [])
    .filter((t) => t.test_file_path)
    .map((t) => ({
      task_id: t.id,
      title: t.title,
      path: t.test_file_path,
      status: t.status,
    }));

export default function ValidatorCard({ run }) {
  const results = run?.test_results;
  
  if (!results) {
    const files = collectTestFiles(run?.tasks);

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
          {files.length > 0 ? (
            <div className="text-left flex flex-col items-center">
              <p className="mb-3 w-full text-center">The following tests are queued for execution or currently running:</p>
              <div className="w-full mt-2">
                {files.map((f) => (
                  <TestFileRow key={f.task_id} runId={run.id} file={f} />
                ))}
              </div>
              <p className="mt-4 text-xs opacity-70">Waiting for Validator agent to finish...</p>
            </div>
          ) : (
            "No validation results available yet. The Validator agent will execute tests once code is generated."
          )}
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

      {collectTestFiles(run?.tasks).length > 0 && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          <h4 className="font-heading text-md font-medium mb-3">Executed Test Files</h4>
          <div className="w-full">
            {collectTestFiles(run?.tasks).map((f) => (
              <TestFileRow key={f.task_id} runId={run.id} file={f} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
