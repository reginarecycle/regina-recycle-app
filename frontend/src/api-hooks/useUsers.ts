import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/apiFetch";
import { useGetList, useGetOne, useCreate, useUpdate, useRemove } from "../lib/queryHelpers";

export interface User {
  id: string;
  name: string;
  email: string;
}

export const userKeys = {
  all:    ()           => ["users"]               as const,
  lists:  ()           => ["users", "list"]        as const,
  detail: (id: string) => ["users", "detail", id]  as const,
  deleteCheck: () => ["users", "delete-check"] as const,
};


export const useGetUsers   = ()           => useGetList<User>(userKeys.lists(), "/users");
export const useGetUser    = (id: string) => useGetOne<User>(userKeys.detail(id), `/users/${id}`, { enabled: Boolean(id) });
export const useCreateUser = ()           => useCreate<User, Omit<User, "id">>("/users", userKeys.lists());
export const useUpdateUser = ()           => useUpdate<User, Partial<User>>((id) => `/users/${id}`, userKeys.lists(), userKeys.detail);
export const useDeleteUser = ()           => useRemove((id) => `/users/${id}`, userKeys.lists(), userKeys.detail);


export interface UpdateUserProfileDto {
  name?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateUserProfileDto) =>
      apiFetch("/users/profile", { method: "PATCH", data: body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["users", "profile"] });
    },
  });
};

export interface DeleteEligibility {
  canDelete: boolean;
  pendingPickups?: number;
  walletBalance?: number;
}

export const useCheckDeleteEligibility = () =>
 useGetOne<DeleteEligibility>(userKeys.deleteCheck(), "/users/delete/check");
export const useDeleteUserAccount = () => {
  return useMutation({
    mutationFn: () => apiFetch("/users/delete", { method: "DELETE" }),
    onSuccess: async () => {
      const { clearAuth } = await import("@/lib/helper");
      clearAuth();
      window.location.href = "/auth/login";
    },
  });
};
  