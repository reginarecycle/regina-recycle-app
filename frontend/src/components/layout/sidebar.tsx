import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { LogOut, } from "lucide-react";

import { collectorNavItems, userNavItems } from "@/constants/data";

interface SidebarProps {
  isCollectorMode?: boolean;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

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
    <aside className="flex h-screen w-64 flex-col border-r bg-white dark:bg-gray-950">
      {/* Logo Section */}
      <div className="flex items-center gap-3 border-b px-6 h-16">
        <img src="/src/assets/logo.svg" alt="ReginaRecycle Logo" className="h-8 w-8" />
        <div className="flex flex-col justify-start">
          <span className="text-lg font-semibold leading-tight text-primary">ReginaRecycle</span>
          <span className="text-xs text-muted-foreground leading-tight">
            {isCollectorMode ? "Collector Portal" : "User Portal"}
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <div className="mb-2 px-3 pt-4 text-xs font-medium text-primary">
          MENU
        </div>
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.href} to={item.href} >
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start py-5 gap-3 hover:bg-primary/10",
                    isActive && "bg-primary/10 font-medium"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="border-t p-4">
        <div className="flex w-56 h-14.5 items-center justify-between rounded-lg border border-primary bg-[rgba(53,79,66,0.18)] backdrop-blur-[2px] px-3 py-2 hover:bg-[rgba(53,79,66,0.25)] transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-tight">{userName}</span>
              <span className="text-xs text-muted-foreground leading-tight">{userRole}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon-sm" className="dark:hover:bg-card">
            <LogOut />
          </Button>
        </div>
      </div>
    </aside>
  );
}