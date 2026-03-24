import { QueryClient } from "@tanstack/react-query";

// Central place to parse error messages from any API error shape
export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Try to parse a JSON body if it was embedded in the message
    try {
      const parsed = JSON.parse(error.message);
      return parsed?.message ?? parsed?.error ?? error.message;
    } catch {
      return error.message;
    }
  }
  if (typeof error === "string") return error;
  return "An unexpected error occurred.";
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
