import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { apiClient } from "@/lib/apiFetch";
import { usePusherNotifications } from "./usePusherNotifications";
import {
    useNotificationsApi,
    useUnreadNotificationCount,
    useMarkAllNotificationsAsRead,
    type NotificationItem,
    type NotificationQueryParams,
} from "@/api-hooks/useNotifications";
import type { Notification } from "@/types/notification";
import type { ViewMode } from "@/types/notification";

function mapToFrontend(n: NotificationItem): Notification {
    const typeMap: Record<string, Notification["type"]> = {
        PICKUP_SCHEDULED: "info",
        ACCOUNT_ACTIVITY: "success",
        ALERT: "warning",
        WALLET_UPDATED_CREDIT: "success",
        WALLET_UPDATED_DEBIT: "warning",
        MATERIAL_PRICING_UPDATED: "info",
    };

    const categoryMap: Record<string, Notification["category"]> = {
    PICKUP_SCHEDULED: "pickups",
    IN_APP_PICKUP_REMINDER: "pickups",
    EMAIL_PICKUP_REMINDER: "pickups",
    ACCOUNT_ACTIVITY: "account",
    PAYMENT_ACTIVITY: "payments",
    MARKETING: "marketing",
    ALERT: "alerts",
    WALLET_UPDATED_CREDIT: "account",
    WALLET_UPDATED_DEBIT: "account",
    MATERIAL_PRICING_UPDATED: "alerts",
};

    return {
        id: n.notificationId,
        type: typeMap[n.type] ?? "info",
        category: categoryMap[n.type] ?? "alerts",
        title: n.title,
        message: n.message,
        timestamp: new Date(n.createdAt),
        read: n.isRead,
        icon: <Bell size={16} />,
    };
}

export function useNotifications(
    userId?: string,
    query?: NotificationQueryParams
) {
    const { data, ...apiState } = useNotificationsApi(query);
    const { data: unreadData } = useUnreadNotificationCount();
    const markAllAsReadMutation = useMarkAllNotificationsAsRead();

    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get("notif") ?? "all";

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>("all");
    const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

    useEffect(() => {
        if (!data?.data?.data) return;
        setNotifications(data.data.data.map(mapToFrontend));
    }, [data]);

    // realtime notifications
    usePusherNotifications(userId, (newNotification) => {
        setNotifications((prev) => {
            const exists = prev.some((item) => item.id === newNotification.id);
            if (exists) return prev;
            return [newNotification, ...prev];
        });
    });

    const unreadCount =
        unreadData?.data?.count ??
        notifications.filter((n) => !n.read).length;

    const processedNotifications = useMemo(() => {
        let result = [...notifications];

        if (activeTab !== "all") {
            result = result.filter((n) => n.category === activeTab);
        }

        if (viewMode === "unread") {
            result = result.filter((n) => !n.read);
        } else if (viewMode === "read") {
            result = result.filter((n) => n.read);
        }

        result.sort((a, b) =>
            sortBy === "newest"
                ? b.timestamp.getTime() - a.timestamp.getTime()
                : a.timestamp.getTime() - b.timestamp.getTime()
        );

        return result;
    }, [notifications, activeTab, viewMode, sortBy]);

    const queryClient = useQueryClient();

    const { mutate: markAsRead } = useMutation({
        mutationFn: (id: string) => apiClient.patch(`/notifications/${id}/read`),
        onMutate: (id) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
    });

    const { mutate: markAsUnread } = useMutation({
        mutationFn: (id: string) => apiClient.patch(`/notifications/${id}/unread`),
        onMutate: (id) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: false } : n)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
    });

    const { mutate: deleteNotification } = useMutation({
        mutationFn: (id: string) => apiClient.delete(`/notifications/${id}`),
        onMutate: (id) => setNotifications((prev) => prev.filter((n) => n.id !== id)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
    });

    const markAllAsRead = () => {
        markAllAsReadMutation.mutate(undefined);
        setNotifications((prev) =>
            prev.map((n) => ({ ...n, read: true }))
        );
    };

    const clearAll = () => {
        notifications.forEach((n) => deleteNotification(n.id));
    };

    const clearRead = () => {
        notifications
            .filter((n) => n.read)
            .forEach((n) => deleteNotification(n.id));
    };

    return {
        ...apiState,
        notifications,
        processedNotifications,
        unreadCount,
        viewMode,
        setViewMode,
        sortBy,
        setSortBy,
        markAsRead,
        markAsUnread,
        deleteNotification,
        markAllAsRead,
        clearAll,
        clearRead,
    };
}