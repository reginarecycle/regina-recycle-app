// Base API client — extend headers, auth tokens, base URL, interceptors here.
// All hooks should use this so error shapes stay uniform.

import axios, { type AxiosRequestConfig, AxiosError } from "axios";

export interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor — attach auth token, etc. ────────────────────────────
apiClient.interceptors.request.use((config) => {
  // const token = getToken();
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor — normalize error shape ─────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      "An unexpected error occurred.";

    const apiError = new Error(message) as ApiError;
    apiError.status = error.response?.status;
    apiError.data   = error.response?.data;
    return Promise.reject(apiError);
  }
);

// ── Typed wrapper used by all hooks ──────────────────────────────────────────
export async function apiFetch<T>(
  path: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.request<T>({ url: path, ...config });
  return response.data;
}
