import { NavTabs } from "@/components/ui/nav-tabs";
import type { TabItem } from "@/types/tabs";
import { NotificationCard } from "./NotificationCard";
import { NotificationEmptyState } from "./NotificationEmptyState";
import { groupByDate } from "@/lib/utils";
import type { Notification, NotificationTab } from "@/types/notification";

interface NotificationTabsProps {
  tabs: NotificationTab[];
  notifications: Notification[];
  processed: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationTabs({
  tabs,
  notifications,
  processed,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
}: NotificationTabsProps) {
  const tabItems: TabItem[] = tabs.map((tab) => {
    const filteredForTab = processed.filter(
      (n) => tab.value === "all" || n.category === tab.value
    );

    const grouped = groupByDate(filteredForTab);

    const unreadForTab = notifications.filter(
      (n) => !n.read && (tab.value === "all" || n.category === tab.value)
    ).length;

    return {
      label: tab.label,
      href: tab.value,
      badge: unreadForTab > 0 ? unreadForTab : undefined,
      component: () => (
        <div className="p-4 sm:p-6">
          {filteredForTab.length === 0 ? (
            <NotificationEmptyState activeTab={tab.value} />
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {(Object.entries(grouped) as [string, Notification[]][]).map(
                ([group, notifs]) =>
                  notifs.length > 0 && (
                    <div key={group}>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3 sm:mb-4">
                        {group}
                      </h3>
                      <div className="space-y-3">
                        {notifs.map((n) => (
                          <NotificationCard
                            key={n.id}
                            notification={n}
                            onMarkAsRead={onMarkAsRead}
                            onMarkAsUnread={onMarkAsUnread}
                            onDelete={onDelete}
                          />
                        ))}
                      </div>
                    </div>
                  )
              )}
            </div>
          )}
        </div>
      ),
    };
  });

  return <NavTabs tabs={tabItems} mode="query" queryKey="notif" />;
}