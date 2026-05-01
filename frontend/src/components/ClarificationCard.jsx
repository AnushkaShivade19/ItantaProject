import { useState } from "react";
import { PaperPlaneRight, Question, Spinner } from "@phosphor-icons/react";
import { answerRun } from "../lib/api";

const allAnswered = (questions, answers) =>
  questions.every((q) => (answers[q.id] || "").trim().length > 0);

const extractErrorMessage = (err) =>
  err?.response?.data?.detail || err?.message || "failed to send";

function ClarifyHeader({ reasoning, count }) {
  return (
    <div className="flex items-start justify-between mb-3 gap-3">
      <div>
        <div className="overline mb-1 flex items-center gap-1">
          <Question size={10} weight="fill" color="var(--state-running)" />
          awaiting input
        </div>
        <h3 className="font-heading text-lg font-medium">
          Clarifying questions
        </h3>
        {reasoning && (
          <p className="text-[12px] text-secondary-ink mt-1 leading-relaxed">
            {reasoning}
          </p>
        )}
      </div>
      <span className="text-[10px] font-mono text-muted-ink whitespace-nowrap">
        {count} · round
      </span>
    </div>
  );
}

function OptionButton({ qid, opt, selected, disabled, onPick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onPick(opt)}
      className="text-[12px] font-mono px-2 py-1 rounded-sm transition-colors"
      style={{
        background: selected ? "var(--text-primary)" : "var(--surface-elevated)",
        color: selected ? "var(--brand-fg)" : "var(--text-secondary)",
        border: "1px solid var(--border)",
      }}
      data-testid={`clarify-option-${qid}-${opt}`}
    >
      {opt}
    </button>
  );
}

function QuestionOptions({ question, value, onChange, disabled }) {
  const opts = question.options;
  if (Array.isArray(opts) && opts.length > 0) {
    return (
      <div className="flex flex-wrap gap-1.5 mt-2">
        {opts.map((opt) => (
          <OptionButton
            key={opt}
            qid={question.id}
            opt={opt}
            selected={value === opt}
            disabled={disabled}
            onPick={onChange}
          />
        ))}
      </div>
    );
  }
  return (
    <input
      type="text"
      value={value || ""}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type your answer…"
      className="input-base mt-2"
      data-testid={`clarify-input-${question.id}`}
    />
  );
}

function QuestionRow({ question, value, onChange, disabled, index }) {
  return (
    <div
      className="py-3 border-b last:border-0"
      style={{ borderColor: "var(--border)" }}
      data-testid={`clarify-question-${question.id}`}
    >
      <div className="flex items-start gap-2">
        <span className="overline shrink-0 mt-0.5">q{index + 1}</span>
        <div className="flex-1">
          <div className="text-sm text-primary-ink">{question.text}</div>
          <QuestionOptions
            question={question}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}

function QuestionList({ questions, answers, onAnswer, disabled }) {
  return (
    <div>
      {questions.map((q, i) => (
        <QuestionRow
          key={q.id}
          question={q}
          index={i}
          value={answers[q.id]}
          onChange={(v) => onAnswer(q.id, v)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

function SubmitButton({ canSubmit, submitting, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!canSubmit}
      className="btn-primary mt-4 w-full justify-center"
      data-testid="clarification-submit-btn"
    >
      {submitting ? (
        <>
          <Spinner size={14} className="animate-spin" />
          Resuming pipeline…
        </>
      ) : (
        <>
          <PaperPlaneRight size={14} weight="fill" />
          Submit answers · resume
        </>
      )}
    </button>
  );
}

/** Local state controller for the clarification form. */
function useClarificationForm(runId, questions, onResumed) {
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const setAnswer = (id, val) =>
    setAnswers((prev) => ({ ...prev, [id]: val }));

  const submit = async () => {
    if (!allAnswered(questions, answers) || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload = questions.map((q) => ({
        id: q.id,
        question: q.text,
        answer: answers[q.id],
      }));
      await answerRun(runId, payload);
      setAnswers({});
      onResumed?.();
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return { answers, setAnswer, submit, submitting, error };
}

/**
 * Clarification card — shown whenever `run.status == "awaiting_input"`.
 */
export default function ClarificationCard({ run, onResumed }) {
  const spec = run?.specification || {};
  const questions = spec.pending_questions || [];
  const { answers, setAnswer, submit, submitting, error } =
    useClarificationForm(run?.id, questions, onResumed);

  if (!run || run.status !== "awaiting_input" || questions.length === 0) {
    return null;
  }

  const canSubmit = !submitting && allAnswered(questions, answers);

  return (
    <section
      className="surface p-5 rounded-sm"
      data-testid="clarification-card"
      style={{ borderColor: "rgba(255, 176, 0, 0.4)" }}
    >
      <ClarifyHeader reasoning={spec.reasoning} count={questions.length} />
      <QuestionList
        questions={questions}
        answers={answers}
        onAnswer={setAnswer}
        disabled={submitting}
      />
      {error && (
        <div
          className="mt-3 text-xs font-mono"
          style={{ color: "var(--state-error)" }}
          data-testid="clarification-error"
        >
          × {error}
        </div>
      )}
      <SubmitButton
        canSubmit={canSubmit}
        submitting={submitting}
        onClick={submit}
      />
    </section>
  );
}
