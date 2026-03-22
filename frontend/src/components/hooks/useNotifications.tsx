import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { Notification, NotificationCategory, ViewMode, UserRole } from "@/types/notification";
import { customerNotifications, collectorNotifications } from "@/constants/data";
import { groupByDate } from "@/lib/utils";
import { usePusherNotifications } from "@/hooks/usePusherNotifications";

export function useNotifications(userRole: UserRole, userId?: string) {
  const initial = userRole === "customer" ? customerNotifications : collectorNotifications;

  const [searchParams]                    = useSearchParams();
  const activeTab                         = (searchParams.get("notif") ?? "all") as NotificationCategory;

  const [notifications, setNotifications] = useState<Notification[]>(initial);
  const [viewMode,      setViewMode]      = useState<ViewMode>("all");
  const [sortBy,        setSortBy]        = useState<"newest" | "oldest">("newest");

  const handleIncoming = useCallback((n: Notification) => {
    setNotifications((prev) => [n, ...prev]);
  }, []);

  usePusherNotifications(userId, handleIncoming);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const processedNotifications = useMemo(() => {
    let filtered = notifications;

    if (activeTab !== "all")   filtered = filtered.filter((n) => n.category === activeTab);
    if (viewMode === "unread") filtered = filtered.filter((n) => !n.read);
    if (viewMode === "read")   filtered = filtered.filter((n) =>  n.read);

    return [...filtered].sort((a, b) =>
      sortBy === "newest"
        ? b.timestamp.getTime() - a.timestamp.getTime()
        : a.timestamp.getTime() - b.timestamp.getTime()
    );
  }, [notifications, activeTab, viewMode, sortBy]);

  const groupedNotifications = groupByDate(processedNotifications);

  const markAsRead         = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true  } : n));
  const markAsUnread       = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: false } : n));
  const deleteNotification = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));
  const markAllAsRead      = ()           => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const clearAll           = ()           => setNotifications([]);
  const clearRead          = ()           => setNotifications((prev) => prev.filter((n) => !n.read));

  return {
    notifications,
    processedNotifications,
    groupedNotifications,
    unreadCount,
    activeTab,
    viewMode,    setViewMode,
    sortBy,      setSortBy,
    markAsRead,
    markAsUnread,
    deleteNotification,
    markAllAsRead,
    clearAll,
    clearRead,
  };
}
