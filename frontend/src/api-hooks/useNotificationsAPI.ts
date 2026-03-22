import { useCreate, useGetOne } from "@/lib/queryHelpers";

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

export interface NotificationsPreference {
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

export interface NotificationActionResponse {
    message: string;
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
    return useGetOne<NotificationsPreference>(
        ["notifications", "preferences"],
        "/notifications/preferences"
    );
}

export function useUpdateNotificationPreferences() {
    return useCreate<
        NotificationsPreference,
        UpdateNotificationPreferencePayload
    >("/notifications/preferences", ["notifications", "preferences"]);
}

export function useMarkAllNotificationsAsRead() {
    return useCreate<NotificationActionResponse, undefined>(
        "/notifications/mark-all-read",
        ["notifications"]
    );
}

export function useMarkNotificationAsRead(notificationId: string) {
    return useCreate<NotificationActionResponse, undefined>(
        `/notifications/${notificationId}/read`,
        ["notifications"]
    );
}