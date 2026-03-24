import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { collectorNavItems, userNavItems } from "@/constants/data";
import { Skeleton } from "../ui/skeleton";

interface SidebarProps {
  isCollectorMode?: boolean;
  userName: string;
  userRole?: "CUSTOMER" | "COLLECTOR" | string;
  userAvatar?: string;
  isLoading?: boolean;
  onNavigate?: () => void;
  activePath?: string;
}

function formatRole(role?: string) {
  if (!role) return "Verified User";
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() + " User";
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

export function Sidebar({
  isCollectorMode = false,
  userName,
  userRole,
  userAvatar,
  isLoading = false,
  onNavigate,
  activePath,
}: SidebarProps) {
  const { pathname } = useLocation();
  const effectivePath = activePath ?? pathname;
  const navItems = isCollectorMode ? collectorNavItems : userNavItems;

  const isActive = (href: string) =>
    effectivePath === href || effectivePath.startsWith(href + "/");

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white dark:bg-gray-950">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b px-6 h-16">
        <img src="/logo.svg" alt="ReginaRecycle" className="h-10 w-10" />
        <div className="flex flex-col">
          <span className="text-lg font-semibold leading-tight text-primary">ReginaRecycle</span>
          <span className="text-xs text-muted-foreground leading-tight">
            {isCollectorMode ? "Collector Portal" : "Customer Portal"}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="pt-8 text-xs font-medium text-primary">MENU</div>
        <div className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} to={item.href} onClick={onNavigate}>
                <div
                  className={cn(
                    "flex items-center w-full justify-start px-2 py-3 rounded gap-3 text-foreground hover:bg-primary/10 hover:text-primary [&_svg]:hover:text-primary",
                    isActive(item.href) && "bg-primary/10 font-medium text-primary [&_svg]:text-primary"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User card */}
      <div className="relative p-4 pb-10">
        <img src="/design.png" alt="" className="absolute bottom-1" />
        <div className="relative z-10 flex w-56 h-14.5 items-center justify-between rounded-lg border border-primary bg-background-green-100 px-3 py-2">
          {isLoading ? (
            <>
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1 ml-3">
                <Skeleton className="h-3.5 w-24 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold leading-tight">{userName}</span>
                  <span className="text-xs text-muted-foreground leading-tight">{formatRole(userRole)}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="hover:bg-destructive hover:text-white">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
