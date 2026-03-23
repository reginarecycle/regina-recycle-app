import { useEffect, useMemo, useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Bell } from "lucide-react";
import type {
  Notification,
  NotificationCategory,
  ViewMode,
  UserRole,
} from "@/types/notification";
import { groupByDate } from "@/lib/utils";
import { usePusherNotifications } from "@/hooks/usePusherNotifications";
import {
  useNotificationsApi,
  useUnreadNotificationCount,
  useMarkAllNotificationsAsRead,
  type NotificationItem,
} from "@/api-hooks/useNotificationsAPI";

function mapToFrontend(n: NotificationItem): Notification {
  const typeMap: Record<string, Notification["type"]> = {
    PICKUP_SCHEDULED: "info",
    PICKUP_STATUS_CHANGED: "info",
    PICKUP_COMPLETED: "success",
    WALLET_UPDATED_CREDIT: "success",
    WALLET_UPDATED_DEBIT: "warning",
    MATERIAL_PRICING_UPDATED: "info",
    ALERT: "warning",
    IN_APP_PICKUP_REMINDER: "info",
    ACCOUNT_ACTIVITY: "success",
  };

  const categoryMap: Record<string, Notification["category"]> = {
    PICKUP_SCHEDULED: "pickups",
    PICKUP_STATUS_CHANGED: "pickups",
    PICKUP_COMPLETED: "pickups",
    WALLET_UPDATED_CREDIT: "account",
    WALLET_UPDATED_DEBIT: "account",
    MATERIAL_PRICING_UPDATED: "alerts",
    ALERT: "alerts",
    IN_APP_PICKUP_REMINDER: "pickups",
    ACCOUNT_ACTIVITY: "account",
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

export function useNotifications(userRole: UserRole, userId?: string) {
  const [searchParams] = useSearchParams();
  const activeTab = (searchParams.get("notif") ?? "all") as NotificationCategory;

  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const { data, isLoading, error, ...apiState } = useNotificationsApi({
    page: 1,
    limit: 20,
  });

  const { data: unreadData } = useUnreadNotificationCount();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  useEffect(() => {
    if (!data?.data?.data) return;
    setNotifications(data.data.data.map(mapToFrontend));
  }, [data]);

  const handleIncoming = useCallback((n: Notification) => {
    setNotifications((prev) => {
      const exists = prev.some((item) => item.id === n.id);
      if (exists) return prev;
      return [n, ...prev];
    });
  }, []);

  usePusherNotifications(userId, handleIncoming);

  const unreadCount =
    unreadData?.data?.count ??
    notifications.filter((n) => !n.read).length;

  const processedNotifications = useMemo(() => {
    let filtered = notifications;

    if (activeTab !== "all") filtered = filtered.filter((n) => n.category === activeTab);
    if (viewMode === "unread") filtered = filtered.filter((n) => !n.read);
    if (viewMode === "read") filtered = filtered.filter((n) => n.read);

    return [...filtered].sort((a, b) =>
      sortBy === "newest"
        ? b.timestamp.getTime() - a.timestamp.getTime()
        : a.timestamp.getTime() - b.timestamp.getTime()
    );
  }, [notifications, activeTab, viewMode, sortBy]);

  const groupedNotifications = groupByDate(processedNotifications);

  const markAsRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const markAsUnread = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: false } : n))
    );

  const deleteNotification = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate(undefined);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => setNotifications([]);

  const clearRead = () =>
    setNotifications((prev) => prev.filter((n) => !n.read));

  return {
    notifications,
    processedNotifications,
    groupedNotifications,
    unreadCount,
    activeTab,
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
    isLoading,
    error,
    refetch: apiState.refetch,
    userRole,
  };
}