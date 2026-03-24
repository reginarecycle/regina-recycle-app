import { Button } from "@/components/ui/button";
import { Routes } from "@/routes/routes";
import { MapPin, Bell, Settings, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ToolbarProps {
  currentLocation?: string;
  notificationCount?: number;
  pageTitle?: string;
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
}

export function Toolbar({
  currentLocation = "—",
  notificationCount = 0,
  pageTitle = "Dashboard",
  onMenuClick,
  onNotificationClick,
}: ToolbarProps) {
    const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 lg:z-50 flex h-16 items-center justify-between border-b bg-white dark:bg-gray-950 px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden items-center justify-center rounded-full bg-card px-2 py-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl md:text-2xl font-semibold">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Address display */}
        <div className="hidden md:flex items-center gap-1.5 bg-card dark:bg-gray-900 rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="max-w-40 truncate">{currentLocation}</span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative text-black-800 bg-card rounded-full px-2 py-2"
          onClick={onNotificationClick}
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </Button>

        <Button variant="ghost" size="icon" className="text-black-800 bg-card rounded-full px-2 py-2" onClick={() => navigate(Routes.profile)}>
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}