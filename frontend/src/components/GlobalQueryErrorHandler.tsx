// This component sits inside both QueryClientProvider and AlertProvider.
// It subscribes to the queryClient's global error cache and pipes every
// query/mutation error into the uniform alert system automatically.

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAlert } from "../lib/AlertContext";
import { extractErrorMessage } from "../lib/queryClient";

export function GlobalQueryErrorHandler() {
  const queryClient = useQueryClient();
  const { addAlert } = useAlert();

  useEffect(() => {
    // Listen to ALL query errors globally
    const queryCache = queryClient.getQueryCache();
    const mutationCache = queryClient.getMutationCache();

    const queryUnsub = queryCache.subscribe((event) => {
      if (event.type === "updated" && event.action.type === "error") {
        addAlert(extractErrorMessage(event.action.error), "error");
      }
    });

    const mutationUnsub = mutationCache.subscribe((event) => {
      if (event.type === "updated" && event.mutation?.state.status === "error") {
        // Only alert on the final failure (after retries)
        const { failureCount } = event.mutation.state;
        const maxRetries = event.mutation.options.retry ?? 0;
        const maxRetriesNum = typeof maxRetries === "number" ? maxRetries : 0;
        if (failureCount > maxRetriesNum) return; // already alerted
        addAlert(extractErrorMessage(event.mutation.state.error), "error");
      }
    });

    return () => {
      queryUnsub();
      mutationUnsub();
    };
  }, [queryClient, addAlert]);

  return null;
}
