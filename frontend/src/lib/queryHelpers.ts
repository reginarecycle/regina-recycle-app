import {
  useQuery,
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { apiFetch, type ApiResult } from "./apiFetch";


export function useGetList<T>(
  queryKey: QueryKey,
  endpoint: string,
  options?: Omit<UseQueryOptions<ApiResult<T[]>>, "queryKey" | "queryFn">
) {
  return useQuery<ApiResult<T[]>>({
    queryKey,
    queryFn: () => apiFetch<T[]>(endpoint),
    ...options,
  });
}

export function useGetOne<T>(
  queryKey: QueryKey,
  endpoint: string,
  options?: Omit<UseQueryOptions<ApiResult<T>>, "queryKey" | "queryFn">
) {
  return useQuery<ApiResult<T>>({
    queryKey,
    queryFn: () => apiFetch<T>(endpoint),
    ...options,
  });
}

export function useCreate<TData, TBody = Partial<TData>>(
  endpoint: string,
  invalidateKey: QueryKey,
  options?: UseMutationOptions<ApiResult<TData>, Error, TBody>
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResult<TData>, Error, TBody>({
    mutationFn: (body) => apiFetch<TData>(endpoint, { method: "POST", data: body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invalidateKey });
    },
    ...options,
  });
}

export function usePatch<TData, TBody = Partial<TData>>(
  endpoint: string,
  invalidateKey: QueryKey,
  options?: UseMutationOptions<ApiResult<TData>, Error, TBody>
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResult<TData>, Error, TBody>({
    mutationFn: (body) => apiFetch<TData>(endpoint, { method: "PATCH", data: body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invalidateKey });
    },
    ...options,
  });
}

export function useUpdate<TData, TBody = Partial<TData>>(
  endpointFn: (id: string) => string,
  invalidateKey: QueryKey,
  detailKeyFn?: (id: string) => QueryKey,
  options?: UseMutationOptions<ApiResult<TData>, Error, { id: string; body: TBody }>
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResult<TData>, Error, { id: string; body: TBody }>({
    mutationFn: ({ id, body }) =>
      apiFetch<TData>(endpointFn(id), { method: "PATCH", data: body }),
    onSuccess: (result, variables) => {
      if (detailKeyFn) {
        queryClient.setQueryData(detailKeyFn(variables.id), result);
      }
      queryClient.invalidateQueries({ queryKey: invalidateKey });
    },
    ...options,
  });
}

export function useRemove<TData = void>(
  endpointFn: (id: string) => string,
  invalidateKey: QueryKey,
  detailKeyFn?: (id: string) => QueryKey,
  options?: UseMutationOptions<ApiResult<TData>, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResult<TData>, Error, string>({
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