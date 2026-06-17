import { useState } from "react";
import {
  TestTube,
  Code,
  CaretDown,
  CaretRight,
  CheckCircle,
} from "@phosphor-icons/react";
import { fetchRunFile } from "../lib/api";
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

function TestSuiteHeader({ count }) {
  return (
    <div className="flex items-start justify-between mb-3 gap-3">
      <div>
        <div className="overline mb-1 flex items-center gap-1">
          <CheckCircle size={10} weight="fill" color="var(--state-success)" />
          tdd · failing tests written
        </div>
        <h3 className="font-heading text-lg font-medium">Test Suite</h3>
        <p className="text-[12px] text-secondary-ink mt-1 leading-relaxed">
          One pytest file per task — these will fail until the Coder Agent
          implements them.
        </p>
      </div>
      <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-ink whitespace-nowrap">
        <Code size={10} />
        <span>{count} files</span>
      </div>
    </div>
  );
}

export default function TestSuiteCard({ run }) {
  const files = collectTestFiles(run?.tasks);
  if (!run || files.length === 0) return null;

  return (
    <section
      className="surface p-5 rounded-sm fade-in"
      data-testid="test-suite-card"
      style={{ borderColor: "rgba(16, 185, 129, 0.3)" }}
    >
      <TestSuiteHeader count={files.length} />
      <div className="mt-2">
        {files.map((f) => (
          <TestFileRow key={f.task_id} runId={run.id} file={f} />
        ))}
      </div>
    </section>
  );
}
