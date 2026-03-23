import { Card } from "@/components/ui/card";
import { NotificationHeader } from "@/components/notifications/NotificationHeader";
import { NotificationTabs } from "@/components/notifications/NotificationTabs";
import { useNotifications } from "@/components/hooks/useNotifications";
import { useCurrentUser } from "@/api-hooks/useAuth";
import { customerTabs, collectorTabs } from "@/constants/data";
import type { UserRole } from "@/types/notification";

interface NotificationsPageProps {
  userRole?: UserRole;
}

export default function NotificationsPage({
  userRole = "customer",
}: NotificationsPageProps) {
  // 1) get authenticated user from backend
  const {
    data: currentUserResult,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser();

  const userId = currentUserResult?.data?.userId;

  // 2) get notifications from backend using the user id
  const {
    notifications,
    processedNotifications,
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
    isLoading: notificationsLoading,
    error: notificationsError,
  } = useNotifications(userRole, userId);

  const tabs = userRole === "customer" ? customerTabs : collectorTabs;

  // 3) loading state
  if (userLoading || notificationsLoading) {
    return <div className="p-4 sm:p-6 md:p-8">Loading notifications...</div>;
  }

  // 4) error state
  if (userError || notificationsError) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        Failed to load notifications.
      </div>
    );
  }

  // 5) render backend-fetched data
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
          activeTab={activeTab}
          onMarkAsRead={markAsRead}
          onMarkAsUnread={markAsUnread}
          onDelete={deleteNotification}
        />
      </Card>
    </div>
  );
}