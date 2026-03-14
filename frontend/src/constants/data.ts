import {
  LayoutDashboard,
  Calendar,
  Wallet,
  History,
  User,
  ClipboardList,
  Users,
  Settings,
} from "lucide-react";

// Export locations
export const locations = [
  { value: "123-lane", label: "123 Lane, Str." },
  { value: "456-avenue", label: "456 Avenue, Blvd." },
  { value: "789-road", label: "789 Road, Cres." },
];

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  hasSubmenu?: boolean;
}

// Export userNavItems
export const userNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/app/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Schedule",
    href: "/app/schedule",
    icon: Calendar,
    //hasSubmenu: true,
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

// Export collectorNavItems
export const collectorNavItems: NavItem[] = [
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

// Get page title from current route
export const getPageTitle = () => {
  const pathname = window.location.pathname;
  
  // Check full paths first for accuracy
  if (pathname.includes('/notification')) return "Notifications";
  if (pathname === '/app/dashboard' || pathname === '/app') return "Dashboard";
  if (pathname === '/app/schedule') return "Schedule";
  if (pathname === '/app/wallet') return "Wallet";
  if (pathname === '/app/history') return "History";
  if (pathname === '/app/profile') return "Profile";
  
  // Collector routes
  if (pathname === '/app/collector/dashboard' || pathname === '/app/collector') return "Dashboard";
  if (pathname === '/app/collector/requests') return "Requests";
  if (pathname === '/app/collector/wallet') return "Wallet Management";
  if (pathname === '/app/collector/users') return "Users";
  if (pathname === '/app/collector/settings') return "Settings";
  
  // Fallback to parsing last segment
  const path = pathname.split("/").pop() || "";
  const titleMap: Record<string, string> = {
    dashboard: "Dashboard",
    schedule: "Schedule",
    wallet: "Wallet",
    history: "History",
    profile: "Profile",
    requests: "Requests",
    users: "Users",
    settings: "Settings",
    notification: "Notifications",
  };
  return titleMap[path] || "Dashboard";
};