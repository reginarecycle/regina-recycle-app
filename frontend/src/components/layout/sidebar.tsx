import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Calendar,
  Wallet,
  History,
  User,
  ChevronDown,
  LogOut,
  Recycle,
  ClipboardList,
  Users,
  Settings,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  hasSubmenu?: boolean;
}

interface SidebarProps {
  isCollectorMode?: boolean;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

const userNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/app/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Schedule",
    href: "/app/schedule",
    icon: Calendar,
    hasSubmenu: true,
  },
  {
    title: "Wallet",
    href: "/app/wallet",
    icon: Wallet,
  },
  {
    title: "History",
    href: "/app/history",
    icon: History,
  },
  {
    title: "Profile",
    href: "/app/profile",
    icon: User,
  },
];

const collectorNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/app/collector/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Requests",
    href: "/app/collector/requests",
    icon: ClipboardList,
  },
  {
    title: "Wallet Management",
    href: "/app/collector/wallet",
    icon: Wallet,
  },
  {
    title: "Users",
    href: "/app/collector/users",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/app/collector/settings",
    icon: Settings,
  },
];

export function Sidebar({
  isCollectorMode = false,
  userName = "John Doe",
  userRole = "Verified User",
  userAvatar,
}: SidebarProps) {
  const location = useLocation();
  const navItems = isCollectorMode ? collectorNavItems : userNavItems;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-background">
      {/* Logo Section */}
      <div className="flex items-center gap-3 border-b px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
          <Recycle className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold">ReginaRecycle</span>
          <span className="text-xs text-muted-foreground">
            {isCollectorMode ? "Collector Portal" : "User Portal"}
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-2 px-3 text-xs font-medium text-muted-foreground">
          MENU
        </div>
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-secondary font-medium"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.title}
                  {item.hasSubmenu && (
                    <ChevronDown className="ml-auto h-4 w-4" />
                  )}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent transition-colors cursor-pointer">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-medium">{userName}</span>
            <Badge
              variant="success"
              className="w-fit text-[10px] px-1.5 py-0"
            >
              {userRole}
            </Badge>
          </div>
          <Button variant="ghost" size="icon-sm" className="ml-auto">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}