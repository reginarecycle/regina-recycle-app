import { Clock } from "lucide-react";

interface NotificationEmptyStateProps {
  activeTab: string;
}

export function NotificationEmptyState({ activeTab }: NotificationEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Clock className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No notifications</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        {activeTab === "all"
          ? "You don't have any notifications yet."
          : `No ${activeTab} notifications.`}
      </p>
    </div>
  );
}
