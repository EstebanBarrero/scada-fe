import axios from "axios";

// Empty string → relative URL → Vite proxy handles /api/* in dev (no CORS)
// Set VITE_API_BASE_URL in .env only when pointing to a remote backend
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

const client = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
  // FastAPI expects repeated keys: criticality=CRITICAL&criticality=HIGH
  // Axios default serializes arrays as criticality[]=CRITICAL which FastAPI ignores
  paramsSerializer: (params) => {
    const parts: string[] = [];
    for (const [key, val] of Object.entries(params)) {
      if (val === undefined || val === null) continue;
      if (Array.isArray(val)) {
        for (const v of val) {
          parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
        }
      } else {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`);
      }
    }
    return parts.join("&");
  },
});

// Response interceptor: normalize error format
// Backend returns { error: { message, detail } } or FastAPI default { detail }
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error?.message ??
      err.response?.data?.detail ??
      err.message ??
      "Unknown error";
    return Promise.reject(new Error(message));
  }
);

export default client;
