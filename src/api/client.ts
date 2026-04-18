import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const client = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
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
