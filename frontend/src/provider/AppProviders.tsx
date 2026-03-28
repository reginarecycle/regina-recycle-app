import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { queryClient } from "../lib/queryClient";
import { GlobalQueryErrorHandler } from "./GlobalQueryErrorHandler";
import { TooltipProvider } from "@/components/ui/tooltip";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GlobalQueryErrorHandler />
        <Toaster position="top-right" richColors />
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
