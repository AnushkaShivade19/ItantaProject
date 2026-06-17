import axios from "axios";
import { API_TIMEOUT_MS } from "./constants";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
  timeout: API_TIMEOUT_MS,
});

api.interceptors.response.use((response) => {
  if (typeof response.data === 'string' && response.data.trim().startsWith('<')) {
    throw new Error("API returned HTML instead of JSON. Is the backend URL configured correctly?");
  }
  return response;
});

// ---- read ----
export const fetchHealth = () => api.get("/health").then((r) => r.data);
export const fetchConfig = () => api.get("/config").then((r) => r.data);
export const fetchPipeline = () => api.get("/pipeline").then((r) => r.data);
export const fetchAgents = () => api.get("/agents").then((r) => r.data);
export const fetchPhases = () => api.get("/phases").then((r) => r.data);
export const fetchRuns = () => api.get("/runs").then((r) => r.data);

export const fetchRun = (runId, since = null) => {
  const params = since ? { since } : {};
  return api.get(`/runs/${runId}`, { params }).then((r) => r.data);
};

// ---- write ----
export const createRun = (specInput) =>
  api.post("/runs", { spec_input: specInput }).then((r) => r.data);

export const startRun = (runId) =>
  api.post(`/runs/${runId}/start`).then((r) => r.data);

export const answerRun = (runId, answers) =>
  api.post(`/runs/${runId}/answer`, { answers }).then((r) => r.data);

export const fetchRunFile = (runId, path) =>
  api.get(`/runs/${runId}/file`, { params: { path } }).then((r) => r.data);

export const fetchAllRunFiles = (runId) =>
  api.get(`/runs/${runId}/files/all`).then((r) => r.data);
