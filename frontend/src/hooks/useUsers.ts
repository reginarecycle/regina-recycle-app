// ─────────────────────────────────────────────────────────────────────────────
// HOOK TEMPLATE — copy this file and replace types/endpoints for every resource
//
// Pattern:
//   useGet<Resource>      → useQuery  (fetching)
//   useCreate<Resource>   → useMutation (POST)
//   useUpdate<Resource>   → useMutation (PUT/PATCH)
//   useDelete<Resource>   → useMutation (DELETE)
// ─────────────────────────────────────────────────────────────────────────────

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/apiFetch";

// ── Types ────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
}

// ── Query keys (keep in one place per resource) ───────────────────────────────
export const userKeys = {
  all: () => ["users"] as const,
  lists: () => ["users", "list"] as const,
  detail: (id: string) => ["users", "detail", id] as const,
};

// ── GET all users ─────────────────────────────────────────────────────────────
export function useGetUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: () => apiFetch<User[]>("/users"),
    // Errors auto-surface in the global alert — no extra handling needed here.
  });
}

// ── GET one user ──────────────────────────────────────────────────────────────
export function useGetUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => apiFetch<User>(`/users/${id}`),
    enabled: Boolean(id),
  });
}

// ── CREATE user ───────────────────────────────────────────────────────────────
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Omit<User, "id">) =>
      apiFetch<User>("/users", {
        method: "POST",
        data: body,
      }),
    onSuccess: () => {
      // Invalidate the list so it refetches with the new item
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    // onError is optional — the global handler already shows the alert.
    // Add it only if you need resource-specific side effects on failure.
  });
}

// ── UPDATE user ───────────────────────────────────────────────────────────────
export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Partial<User>) =>
      apiFetch<User>(`/users/${id}`, {
        method: "PATCH",
        data: body,
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData(userKeys.detail(id), updated);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

// ── DELETE user ───────────────────────────────────────────────────────────────
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/users/${id}`, { method: "DELETE" }),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
