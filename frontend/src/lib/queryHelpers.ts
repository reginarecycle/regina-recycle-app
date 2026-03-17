// ─────────────────────────────────────────────────────────────────────────────
// BASE QUERY HELPERS
// Shared abstractions for all resource hooks.
// Should use these instead of writing raw useQuery/useMutation.
// ─────────────────────────────────────────────────────────────────────────────

import {
  useQuery,
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { apiFetch } from "./apiFetch";

// ── GET list ──────────────────────────────────────────────────────────────────
export function useGetList<T>(
  queryKey: QueryKey,
  endpoint: string,
  options?: Omit<UseQueryOptions<T[]>, "queryKey" | "queryFn">
) {
  return useQuery<T[]>({
    queryKey,
    queryFn: () => apiFetch<T[]>(endpoint),
    ...options,
  });
}

// ── GET single ────────────────────────────────────────────────────────────────
export function useGetOne<T>(
  queryKey: QueryKey,
  endpoint: string,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">
) {
  return useQuery<T>({
    queryKey,
    queryFn: () => apiFetch<T>(endpoint),
    ...options,
  });
}

// ── CREATE ────────────────────────────────────────────────────────────────────
export function useCreate<TData, TBody = Partial<TData>>(
  endpoint: string,
  invalidateKey: QueryKey,
  options?: UseMutationOptions<TData, Error, TBody>
) {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TBody>({
    mutationFn: (body) => apiFetch<TData>(endpoint, { method: "POST", data: body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invalidateKey });
    },
    ...options,
  });
}

// ── UPDATE ────────────────────────────────────────────────────────────────────
export function useUpdate<TData, TBody = Partial<TData>>(
  endpointFn: (id: string) => string,
  invalidateKey: QueryKey,
  detailKeyFn?: (id: string) => QueryKey,
  options?: UseMutationOptions<TData, Error, { id: string; body: TBody }>
) {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, { id: string; body: TBody }>({
    mutationFn: ({ id, body }) =>
      apiFetch<TData>(endpointFn(id), { method: "PATCH", data: body }),
    onSuccess: (updated, variables) => {
      if (detailKeyFn) {
        queryClient.setQueryData(detailKeyFn(variables.id), updated);
      }
      queryClient.invalidateQueries({ queryKey: invalidateKey });
    },
    ...options,
  });
}

// ── DELETE ────────────────────────────────────────────────────────────────────
export function useRemove<TData = void>(
  endpointFn: (id: string) => string,
  invalidateKey: QueryKey,
  detailKeyFn?: (id: string) => QueryKey,
  options?: UseMutationOptions<TData, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, string>({
    mutationFn: (id) => apiFetch<TData>(endpointFn(id), { method: "DELETE" }),
    onSuccess: (_, id) => {
      if (detailKeyFn) {
        queryClient.removeQueries({ queryKey: detailKeyFn(id) });
      }
      queryClient.invalidateQueries({ queryKey: invalidateKey });
    },
    ...options,
  });
}
