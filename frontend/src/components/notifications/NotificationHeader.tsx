import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CheckCheck, MoreVertical, Trash2 } from "lucide-react";
import type { ViewMode } from "@/types/notification";

interface ActionMenuProps {
  className?: string;
  unreadCount: number;
  onMarkAllRead: () => void;
  onClearRead: () => void;
  onClearAll: () => void;
}

function ActionMenu({ className, unreadCount, onMarkAllRead, onClearRead, onClearAll }: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={className?.includes("ghost") ? "ghost" : "outline"}
          size="sm"
          className={`h-9 w-9 p-0 ${className ?? ""}`}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {unreadCount > 0 && (
          <DropdownMenuItem onClick={onMarkAllRead}>
            <CheckCheck className="h-4 w-4 mr-2" /> Mark all read
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={onClearRead}>
          <Trash2 className="h-4 w-4 mr-2" /> Clear read
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" onClick={onClearAll}>
          <Trash2 className="h-4 w-4 mr-2" /> Clear all
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface NotificationHeaderProps {
  unreadCount:      number;
  hasNotifications: boolean;
  viewMode:         ViewMode;
  setViewMode:      (mode: ViewMode) => void;
  sortBy:           "newest" | "oldest";
  setSortBy:        (sort: "newest" | "oldest") => void;
  onMarkAllRead:    () => void;
  onClearRead:      () => void;
  onClearAll:       () => void;
}

export function NotificationHeader({
  unreadCount,
  hasNotifications,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  onMarkAllRead,
  onClearRead,
  onClearAll,
}: NotificationHeaderProps) {
  return (
    <div className="p-4 sm:p-6 border-b">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "You're all caught up!"}
          </p>
        </div>

        {hasNotifications && (
          <>
            {/* Desktop */}
            <div className="hidden sm:flex gap-2">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" className="h-9 gap-2" onClick={onMarkAllRead}>
                  <CheckCheck className="h-4 w-4" /> Mark all read
                </Button>
              )}
              <ActionMenu
                unreadCount={unreadCount}
                onMarkAllRead={onMarkAllRead}
                onClearRead={onClearRead}
                onClearAll={onClearAll}
              />
            </div>
            {/* Mobile */}
            <ActionMenu
              className="ghost sm:hidden"
              unreadCount={unreadCount}
              onMarkAllRead={onMarkAllRead}
              onClearRead={onClearRead}
              onClearAll={onClearAll}
            />
          </>
        )}
      </div>

      {hasNotifications && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            {(["all", "unread", "read"] as ViewMode[]).map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? "default" : "ghost"}
                size="sm"
                className={`h-8 px-3 gap-1.5 capitalize ${viewMode === mode ? "shadow-sm" : ""}`}
                onClick={() => setViewMode(mode)}
              >
                {mode}
                {mode === "unread" && unreadCount > 0 && viewMode !== "unread" && (
                  <Badge className="ml-1 h-5 px-1.5 bg-primary text-white border-0">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* Sort — fixed any type */}
          <Select value={sortBy} onValueChange={(v: "newest" | "oldest") => setSortBy(v)}>
            <SelectTrigger className="w-full sm:w-32.5 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}