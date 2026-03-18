import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";
import { queryClient } from "../lib/queryClient";
import { AlertProvider } from "../lib/AlertContext";
import { AlertContainer } from "./AlertContainer";
import { GlobalQueryErrorHandler } from "./GlobalQueryErrorHandler";

interface AppProvidersProps {
  children: ReactNode;
}

// Wrap your entire app with this once in main.tsx / index.tsx
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AlertProvider>
        {/* Pipes all React Query errors → alert system */}
        <GlobalQueryErrorHandler />

        {/* Renders the floating alerts (top-right corner) */}
        <AlertContainer />

        {children}
      </AlertProvider>

      {/* Remove in production builds or gate behind env var */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
