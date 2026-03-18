import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, EyeOff, Trash2 } from "lucide-react";
import { getTypeStyles, formatTimestamp } from "@/lib/utils";
import type { Notification } from "@/types/notification";

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead:   (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onDelete:       (id: string) => void;
}

export function NotificationCard({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
}: NotificationCardProps) {
  const styles = getTypeStyles(notification.type);

  return (
    <div
      className={`relative flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-colors
        ${notification.read ? "bg-white border-gray-200" : `${styles.bg} ${styles.border}`}
        ${notification.link ? "cursor-pointer hover:shadow-sm" : ""}
      `}
      onClick={() => {
        if (notification.link && !notification.read) onMarkAsRead(notification.id);
        // TODO: navigate to notification.link
      }}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute left-0 top-3 sm:top-4 w-1 h-10 sm:h-12 bg-primary rounded-r" />
      )}

      <div className="flex items-start gap-3 flex-1 min-w-0">
        {/* Icon */}
        <div className={`flex w-10 h-10 items-center justify-center rounded-lg shrink-0 ${notification.read ? "bg-gray-100" : styles.iconBg}`}>
          <div className={notification.read ? "text-gray-600" : styles.iconColor}>
            {notification.icon}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-foreground mb-1">{notification.title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
        </div>
      </div>

      {/* Actions Row */}
      <div className="flex items-center justify-between sm:justify-end gap-3 sm:shrink-0 pl-13 sm:pl-0">
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatTimestamp(notification.timestamp)}
        </span>

        {notification.read ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onMarkAsUnread(notification.id); }}>
                <EyeOff className="h-4 w-4 mr-2" /> Mark unread
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="ghost" size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
