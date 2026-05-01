import { Circle } from "@phosphor-icons/react";
import { STATUS_DOT_SIZE_PX } from "../lib/constants";

/**
 * Small status pill used in the header (connection, Groq key, etc.).
 */
export default function StatusPill({ label, value, color, testId }) {
  return (
    <div className="flex items-center gap-2 text-xs font-mono" data-testid={testId}>
      {label && <span className="text-muted-ink">{label}</span>}
      <Circle size={STATUS_DOT_SIZE_PX} weight="fill" color={color} />
      <span className="text-secondary-ink">{value}</span>
    </div>
  );
}
