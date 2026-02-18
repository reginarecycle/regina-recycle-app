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
    const path = location.pathname.split("/").pop() || "";
    const titleMap: Record<string, string> = {
      dashboard: "Dashboard",
      schedule: "Schedule",
      wallet: "Wallet",
      history: "History",
      profile: "Profile",
      requests: "Requests",
      users: "Users",
      settings: "Settings",
    };
    return titleMap[path] || "Dashboard";
  };