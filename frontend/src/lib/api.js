import axios from "axios";
import { API_TIMEOUT_MS } from "./constants";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
  timeout: API_TIMEOUT_MS,
});

export const fetchHealth = () => api.get("/health").then((r) => r.data);
export const fetchConfig = () => api.get("/config").then((r) => r.data);
export const fetchPipeline = () => api.get("/pipeline").then((r) => r.data);
export const fetchAgents = () => api.get("/agents").then((r) => r.data);
export const fetchPhases = () => api.get("/phases").then((r) => r.data);
export const fetchRuns = () => api.get("/runs").then((r) => r.data);
