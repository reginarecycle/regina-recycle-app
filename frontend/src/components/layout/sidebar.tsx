import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
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
        <img src="/logo.svg" alt="ReginaRecycle" className="h-10 w-10" />
        <div className="flex flex-col justify-start">
          <span className="text-lg font-semibold leading-tight text-primary">
            ReginaRecycle
          </span>
          <span className="text-xs text-muted-foreground leading-tight">
            {isCollectorMode ? "Collector Portal" : "User Portal"}
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className=" pt-8 text-xs font-medium text-primary">MENU</div>
        <div className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start py-5 gap-3 text-foreground hover:bg-primary/10 hover:text-primary [&_svg]:hover:text-primary",
                    isActive &&
                      "bg-primary/10 font-medium text-primary [&_svg]:text-primary"
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

      <div className="relative p-4 pb-10">
        <img
          src="/design.png"
          alt="Overlay design"
          className="absolute bottom-1"
        />

        {/* User Profile Card */}
        <div className="relative z-10 flex w-56 h-14.5 items-center justify-between rounded-lg border border-primary bg-background-green-100 backdrop-blur-[2px] px-3 py-2 hover:bg-background-green-100 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-tight">
                {userName}
              </span>
              <span className="text-xs text-muted-foreground leading-tight">
                {userRole}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="dark:hover:bg-card">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
