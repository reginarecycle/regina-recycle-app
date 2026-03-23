import { Card } from "@/components/ui/card";
import { NotificationHeader } from "@/components/notifications/NotificationHeader";
import { NotificationTabs } from "@/components/notifications/NotificationTabs";
import { useNotifications } from "@/hooks/useNotifications";
import { useCurrentUser } from "@/api-hooks/useAuth";
import { customerTabs, collectorTabs } from "@/constants/data";
import type { UserRole } from "@/types/notification";

interface NotificationsPageProps {
  userRole?: UserRole;
}

export default function NotificationsPage({
  userRole = "customer",
}: NotificationsPageProps) {
  const {
    data: currentUserResult,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser();

  const userId = currentUserResult?.data?.userId;

  const {
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
    isLoading: notificationsLoading,
    error: notificationsError,
  } = useNotifications(userId);

  const tabs = userRole === "customer" ? customerTabs : collectorTabs;

  if (userLoading || notificationsLoading) {
    return <div className="p-4 sm:p-6 md:p-8">Loading notifications...</div>;
  }

  if (userError || notificationsError) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        Failed to load notifications.
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <Card className="border-0 bg-white p-6 shadow-none">
          <p className="text-center text-sm text-muted-foreground">
            No notifications yet.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <Card className="border-0 bg-white p-0 shadow-none">
        <NotificationHeader
          unreadCount={unreadCount}
          hasNotifications={notifications.length > 0}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onMarkAllRead={markAllAsRead}
          onClearRead={clearRead}
          onClearAll={clearAll}
        />

        <NotificationTabs
          tabs={tabs}
          notifications={notifications}
          processed={processedNotifications}
          onMarkAsRead={markAsRead}
          onMarkAsUnread={markAsUnread}
          onDelete={deleteNotification}
        />
      </Card>
    </div>
  );
}