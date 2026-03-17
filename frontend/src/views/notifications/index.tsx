import { Card } from "@/components/ui/card";
import { NotificationHeader } from "@/components/notifications/NotificationHeader";
import { NotificationTabs }   from "@/components/notifications/NotificationTabs";
import { useNotifications }   from "@/components/hooks/useNotifications";
import { customerTabs, collectorTabs } from "@/constants/data";
import type { UserRole } from "@/types/notification";

interface NotificationsPageProps {
  userRole?: UserRole;
}

export default function NotificationsPage({ userRole = "customer" }: NotificationsPageProps) {
  const {
    notifications,
    processedNotifications,
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
  } = useNotifications(userRole);

  const tabs = userRole === "customer" ? customerTabs : collectorTabs;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <Card className="p-0 bg-white shadow-none border-0">
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