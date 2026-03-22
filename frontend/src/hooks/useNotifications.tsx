import { useEffect, useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { usePusherNotifications } from "./usePusherNotifications";
import {
    useNotificationsApi,
    useUnreadNotificationCount,
    type NotificationItem,
    type NotificationQueryParams,
} from "@/api-hooks/useNotifcationsAPI";
import type { Notification } from "@/types/notification";

function mapToFrontend(n: NotificationItem): Notification {
    const typeMap: Record<string, Notification["type"]> = {
        IN_APP_PICKUP_REMINDER: "info",
        ACCOUNT_ACTIVITY: "success",
        ALERT: "warning",
    };

    const categoryMap: Record<string, Notification["category"]> = {
        IN_APP_PICKUP_REMINDER: "pickups",
        ACCOUNT_ACTIVITY: "account",
        ALERT: "alerts",
    };

    return {
        id: n.notificationId,
        type: typeMap[n.type] ?? "info",
        category: categoryMap[n.type] ?? "alerts",
        title: n.title,
        message: n.message,
        timestamp: new Date(n.createdAt),
        read: n.isRead,
        icon: <Bell size={'16'} />,
    };
}

export function useNotifications(userId?: string, query?: NotificationQueryParams) {
    const { data, ...apiState } = useNotificationsApi(query);
    const { data: unreadData } = useUnreadNotificationCount();

    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (!data?.data) return;
        setNotifications(data.data.data.map(mapToFrontend));
    }, [data]);

    usePusherNotifications(userId, (newNotification) => {
        setNotifications((prev) => {
            const exists = prev.some((item) => item.id === newNotification.id);
            if (exists) return prev;
            return [newNotification, ...prev];
        });
    });

    const unreadCount = useMemo(() => {
        return unreadData?.data?.unreadCount ?? notifications.filter((n) => !n.read).length;
    }, [unreadData, notifications]);

    return {
        ...apiState,
        rawData: data,
        notifications,
        unreadCount,
    };
}