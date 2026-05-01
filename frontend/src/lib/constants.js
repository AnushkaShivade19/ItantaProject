/**
 * Shared constants for the Agentic dashboard.
 * Centralising magic numbers so they can be tuned in one place.
 */

export const API_TIMEOUT_MS = 20_000;
export const HEALTH_REFRESH_INTERVAL_MS = 15_000;
export const MAX_LOG_LINES = 200;

export const SIDEBAR_WIDTH_PX = 240;
export const SIDEBAR_ICON_SIZE = 13;
export const NAV_ICON_SIZE = 14;
export const HEADER_ICON_SIZE = 16;
export const AGENT_NODE_MIN_WIDTH_PX = 160;
export const STATUS_DOT_SIZE_PX = 8;

export const AGENT_STATE_COLOR = {
  idle: "var(--text-secondary)",
  running: "var(--state-running)",
  success: "var(--state-success)",
  error: "var(--state-error)",
};

export const PHASE_STATUS_COLOR = {
  complete: "var(--state-success)",
  current: "var(--state-running)",
  pending: "var(--text-muted)",
};

export const agentColor = (status) =>
  AGENT_STATE_COLOR[status] ?? AGENT_STATE_COLOR.idle;

export const phaseColor = (status) =>
  PHASE_STATUS_COLOR[status] ?? PHASE_STATUS_COLOR.pending;
