import axios, { type AxiosRequestConfig, AxiosError } from "axios";

export interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiResult<T> {
  data: T;
  message: string;
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(import.meta.env.AUTH_TOKEN ?? "acc_key");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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
    apiError.data = error.response?.data;
    return Promise.reject(apiError);
  }
);

// Unwraps the envelope — callers get T directly, not ApiResponse<T>
export async function apiFetch<T>(
  path: string,
  config?: AxiosRequestConfig
): Promise<ApiResult<T>> {
  const response = await apiClient.request<ApiResponse<T>>({ url: path, ...config });
  return {
    data: response.data.data,
    message: response.data.message,
  };
}