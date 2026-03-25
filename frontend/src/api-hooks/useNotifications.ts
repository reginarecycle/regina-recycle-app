import { useCreate, useGetOne, usePatch } from "@/lib/queryHelpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiFetch";

export interface NotificationItem {
    notificationId: string;
    userId?: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    updatedAt?: string;
    metadata?: Record<string, unknown> | null;
}

export interface NotificationsResponse {
    data: NotificationItem[];
    total: number;
    page: number;
    limit: number;
}

export interface NotificationQueryParams {
    page?: number;
    limit?: number;
    isRead?: boolean;
}

export interface NotificationUnreadCount {
    count: number;
}
// previously named NotificationsPreference
export interface NotificationPreferencesDto {
    emailPickupReminder?: boolean;
    emailAccountActivity?: boolean;
    emailMarketing?: boolean;
    emailPayment?: boolean;
    inAppPickupReminder?: boolean;
    inAppAlerts?: boolean;
}

export interface UpdateNotificationPreferencePayload {
    emailPickupReminder?: boolean;
    emailAccountActivity?: boolean;
    emailMarketing?: boolean;
    emailPayment?: boolean;
    inAppPickupReminder?: boolean;
    inAppAlerts?: boolean;
}

export function useNotificationsApi(query?: NotificationQueryParams) {
    const searchParams = new URLSearchParams();

    if (query?.page !== undefined) {
        searchParams.append("page", String(query.page));
    }

    if (query?.limit !== undefined) {
        searchParams.append("limit", String(query.limit));
    }

    if (query?.isRead !== undefined) {
        searchParams.append("isRead", String(query.isRead));
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
        ? `/notifications?${queryString}`
        : "/notifications";

    return useGetOne<NotificationsResponse>(
        ["notifications", query ?? {}],
        endpoint
    );
}

export function useUnreadNotificationCount() {
    return useGetOne<NotificationUnreadCount>(
        ["notifications", "unread-count"],
        "/notifications/unread-count"
    );
}

export function useNotificationsPreferences() {
    return useGetOne<NotificationPreferencesDto>(
        ["notifications", "preferences"],
        "/notifications/preferences"
    );
}

// export function useNotificationPreferences() {
//   return useGetOne<NotificationPreferencesDto >(
//     ["notification-preferences"],
//     "/notifications/preferences"
//   );
// }

// previously named useUpdateNotificationPreferences
export function useCreateNotificationPreferences() {
    return useCreate<
        NotificationPreferencesDto,
        UpdateNotificationPreferencePayload
    >("/notifications/preferences", ["notifications", "preferences"]);
}

export function useUpdateNotificationPreferences() {
  return usePatch<NotificationPreferencesDto , NotificationPreferencesDto >(
    "/notifications/preferences",
    ["notification-preferences"]
  );
}

export function useMarkAllNotificationsAsRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => apiClient.patch("/notifications/mark-all-read"),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
    });
}
