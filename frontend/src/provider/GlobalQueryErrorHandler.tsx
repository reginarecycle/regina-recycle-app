import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "../lib/queryClient";

export function GlobalQueryErrorHandler() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const queryCache = queryClient.getQueryCache();
    const mutationCache = queryClient.getMutationCache();

    const queryUnsub = queryCache.subscribe((event) => {
      if (event.type === "updated" && event.action.type === "error") {
        toast.error(extractErrorMessage(event.action.error));
      }
    });

    const mutationUnsub = mutationCache.subscribe((event) => {
      if (
        event.type === "updated" &&
        event.mutation?.state.status === "error"
      ) {
        const { failureCount } = event.mutation.state;
        const maxRetries = event.mutation.options.retry ?? 0;
        const maxRetriesNum = typeof maxRetries === "number" ? maxRetries : 0;
        if (failureCount > maxRetriesNum) return;
        toast.error(extractErrorMessage(event.mutation.state.error));
      }
    });

    return () => {
      queryUnsub();
      mutationUnsub();
    };
  }, [queryClient]);

  return null;
}
