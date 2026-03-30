import { Card } from "@/components/ui/card";
import { NotificationHeader } from "@/components/notifications/NotificationHeader";
import { NotificationTabs } from "@/components/notifications/NotificationTabs";
import { useNotifications } from "@/hooks/useNotifications";
import { useCurrentUser } from "@/api-hooks/useAuth";
import { customerTabs, collectorTabs } from "@/constants/data";
import type { UserRole } from "@/types/notification";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    page,
    setPage,
    totalPages,
  } = useNotifications(userId);

  const tabs = userRole === "customer" ? customerTabs : collectorTabs;

  const isLoading = userLoading || notificationsLoading;
  const hasError = !!(userError || notificationsError);

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

        {hasError ? (
          <div className="p-4 sm:p-6">
            <p className="text-center text-sm text-muted-foreground">
              Failed to load notifications.
            </p>
          </div>
        ) : (
          <>
            <NotificationTabs
              tabs={tabs}
              notifications={isLoading ? [] : notifications}
              processed={isLoading ? [] : processedNotifications}
              onMarkAsRead={markAsRead}
              onMarkAsUnread={markAsUnread}
              onDelete={deleteNotification}
            />

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 px-6 py-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || isLoading}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || isLoading}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}