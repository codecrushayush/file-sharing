import axios from "axios";

/**
 * When empty, requests use relative `/api` (Vite dev proxy or same-origin in production).
 * When set, must be absolute base without trailing slash, e.g. `https://api.example.com`
 * (requests go to `{VITE_API_URL}/api/...`).
 */
const rawBase = import.meta.env.VITE_API_URL || "";

export function getApiBaseUrl() {
  if (!rawBase) return "/api";
  return `${rawBase.replace(/\/$/, "")}/api`;
}

export const TOKEN_KEY = "fss_token";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function normalizeErrorMessage(data) {
  if (data == null) return null;
  if (typeof data === "string") return data || null;
  if (typeof data === "object" && data.message) return String(data.message);
  return null;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const res = error.response;
    const fromBody =
      normalizeErrorMessage(res?.data) ||
      (typeof res?.data === "string" ? res.data : null);
    const message =
      fromBody || error.message || "Request failed";
    const err = new Error(message);
    err.status = res?.status;
    return Promise.reject(err);
  }
);

export async function fetchHealth() {
  const { data } = await api.get("/health");
  return data;
}
