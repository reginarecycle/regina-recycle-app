// ─────────────────────────────────────────────────────────────────────────────
// useUsers.ts — example resource hook using the base query helpers
//
// Note: For every new resource you create you only need to define:
//   1. The resource type
//   2. The query keys
//   3. Call the right helper with the endpoint
// ─────────────────────────────────────────────────────────────────────────────

import { useGetList, useGetOne, useCreate, useUpdate, useRemove } from "../lib/queryHelpers";

// ── 1. Type ───────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
}

// ── 2. Query keys ─────────────────────────────────────────────────────────────
export const userKeys = {
  all:    ()           => ["users"]               as const,
  lists:  ()           => ["users", "list"]        as const,
  detail: (id: string) => ["users", "detail", id]  as const,
};

// ── 3. Hooks ──────────────────────────────────────────────────────────────────
export const useGetUsers   = ()           => useGetList<User>(userKeys.lists(), "/users");
export const useGetUser    = (id: string) => useGetOne<User>(userKeys.detail(id), `/users/${id}`, { enabled: Boolean(id) });
export const useCreateUser = ()           => useCreate<User, Omit<User, "id">>("/users", userKeys.lists());
export const useUpdateUser = ()           => useUpdate<User, Partial<User>>((id) => `/users/${id}`, userKeys.lists(), userKeys.detail);
export const useDeleteUser = ()           => useRemove((id) => `/users/${id}`, userKeys.lists(), userKeys.detail);


// --- Profile & Account Hooks ---

export interface UpdateUserProfileDto {
  name?: string;
  email?: string;
  phoneNumber?: string;
}

// Update profile
export const useUpdateUserProfile = () =>
  useUpdate<unknown, UpdateUserProfileDto>(
    () => "/users/profile",
    ["users", "profile"]
  );

// Check delete eligibility
export const useCheckDeleteEligibility = () =>
  useGetOne<unknown>(
    ["users", "delete-check"],
    "/users/delete/check"
  );

// Delete account
export const useDeleteUserAccount = () =>
  useRemove(
    () => "/users/delete",
    ["users", "profile"]
  );