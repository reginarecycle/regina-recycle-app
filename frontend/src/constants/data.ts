import {
  LayoutDashboard,
  Calendar,
  Wallet,
  History,
  User,
  ClipboardList,
  Clock,
  Users,
  Volume2,
  Truck,
  AlertTriangle,
  Settings,
  DollarSign,
} from "lucide-react";

import imgPlastic from "@/assets/KidsRecycleImg.png";
import imgPaper from "@/assets/map.png";
import imgGlass from "@/assets/RecyclePhones.png";
import type { RecyclingItem } from "./interface";
import type { NotificationSection } from "@/types/notification";


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
    const p = location.pathname;
    if ( p.includes("/schedule")) return "Schedule";
    const path = p.split("/").pop() || "";
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

  export const items: RecyclingItem[] = [
    {
      id: 1,
      image: imgPlastic,
      title: "Cans",
      item: "Aluminum & Steel Cans",
      tip: "Rinse before placing in blue bin",
      category: "recyclable",
      label: "Recyclables",
      labelColor: "#618171",
      labelTextColor: "#fff",
      badgeColor: "#49B972",
      badgeIcon: "check",
    },
    {
      id: 2,
      image: imgPaper,
      title: "Cardboard Boxes",
      item: "Flattened Boxes",
      tip: "Flatten all boxes before recycling",
      category: "garbage",
      label: "Garbage",
      labelColor: "#999ca0",
      labelTextColor: "#fff",
      badgeColor: "#999ca0",
      badgeIcon: "bin",
    },
    {
      id: 3,
      image: imgGlass,
      title: "Food Scraps",
      item: "Fruit & Veggie Peels",
      tip: "Goes in green compost bin",
      category: "recyclable",
      label: "Recyclables",
      labelColor: "#618171",
      labelTextColor: "#fff",
      badgeColor: "#49B972",
      badgeIcon: "check",
    },
    {
      id: 4,
      image: imgPlastic,
      title: "Batteries",
      item: "AA, AAA, Lithium",
      tip: "Drop off at designated e-waste bins",
      category: "hazardous",
      label: "Hazardous",
      labelColor: "#fee2e2",
      labelTextColor: "#991b1b",
      badgeColor: "#ef4444",
      badgeIcon: "warning",
    },
    {
      id: 5,
      image: imgPaper,
      title: "Plastic Bottles",
      item: "Bottles & Jugs",
      tip: "Remove caps and rinse",
      category: "recyclable",
      label: "Recyclables",
      labelColor: "#618171",
      labelTextColor: "#fff",
      badgeColor: "#49B972",
      badgeIcon: "check",
    },
    {
      id: 6,
      image: imgGlass,
      title: "Glass Bottles",
      item: "Bottles & Jars",
      tip: "Remove lids before recycling",
      category: "recyclable",
      label: "Recyclables",
      labelColor: "#618171",
      labelTextColor: "#fff",
      badgeColor: "#49B972",
      badgeIcon: "check",
    },
    {
      id: 7,
      image: imgPlastic,
      title: "Mixed Paper",
      item: "Cereal Boxes & Egg Cartons",
      tip: "Keep dry and clean",
      category: "recyclable",
      label: "Recyclables",
      labelColor: "#618171",
      labelTextColor: "#fff",
      badgeColor: "#49B972",
      badgeIcon: "check",
    },
    {
      id: 8,
      image: imgPaper,
      title: "Paint Cans",
      item: "Household Paint",
      tip: "Drop off at hazardous waste facility",
      category: "hazardous",
      label: "Hazardous",
      labelColor: "#fee2e2",
      labelTextColor: "#991b1b",
      badgeColor: "#ef4444",
      badgeIcon: "warning",
    },
    {
      id: 9,
      image: imgGlass,
      title: "Yard Waste",
      item: "Leaves & Grass Clippings",
      tip: "Place in compost or yard waste bin",
      category: "compost",
      label: "Compost",
      labelColor: "#ca8a05",
      labelTextColor: "#fff",
      badgeColor: "#ca8a05",
      badgeIcon: "compost",
    },
    {
      id: 10,
      image: imgPlastic,
      title: "Electronics",
      item: "Old Phones & Monitors",
      tip: "Drop off at e-waste collection points",
      category: "hazardous",
      label: "Hazardous",
      labelColor: "#fee2e2",
      labelTextColor: "#991b1b",
      badgeColor: "#ef4444",
      badgeIcon: "warning",
    },
    {
      id: 11,
      image: imgPaper,
      title: "Newspapers",
      item: "Magazines & Flyers",
      tip: "Keep dry, bundle together",
      category: "recyclable",
      label: "Recyclables",
      labelColor: "#618171",
      labelTextColor: "#fff",
      badgeColor: "#49B972",
      badgeIcon: "check",
    },
    {
      id: 12,
      image: imgGlass,
      title: "Coffee Grounds",
      item: "Grounds & Filters",
      tip: "Great for compost bins",
      category: "compost",
      label: "Compost",
      labelColor: "#ca8a05",
      labelTextColor: "#fff",
      badgeColor: "#ca8a05",
      badgeIcon: "compost",
    },
  ];

export const NOTIFICATION_SECTIONS: NotificationSection[] = [
  {
    id: "email",
    title: "Email Notification",
    subtitle: "Receive updates and alerts via your registered email address.",
    saveLabel: "Update Preferences",
    items: [
      {
        key: "email:pickup",
        icon: Clock,
        title: "Pickup Reminders",
        description: "Get notified 24 hours before your scheduled collection.",
      },
      {
        key: "email:activity",
        icon: Users,
        title: "Account Activity",
        description: "Security alert, password changes and login notifications.",
      },
      {
        key: "email:marketing",
        icon: Volume2,
        title: "Marketing",
        description: "Newsletter, impact reports, promotional offers.",
      },
    ],
  },
  {
    id: "inapp",
    title: "In-App Notification",
    subtitle: "Get instant updates within the platform.",
    items: [
      {
        key: "inapp:pickup",
        icon: Truck,
        title: "Pickup Reminders",
        description: "Receive a text message 1 hour before pickup.",
      },
      {
        key: "inapp:alerts",
        icon: AlertTriangle,
        title: "Important Alerts",
        description: "Service disruption, weather delays, and urgent updates.",
      },
    ],
  },
];

export type CollectorNotificationKey =
  | "email:collection"
  | "email:activity"
  | "email:payment"
  | "inapp:reminders"
  | "inapp:alerts";

export const COLLECTOR_NOTIFICATION_SECTIONS = [
  {
    id: "email",
    title: "Email Notification",
    subtitle: "Receive updates and alerts via your registered email address.",
    saveLabel: "Update Preferences",
    items: [
      { key: "email:collection" as CollectorNotificationKey, icon: Clock,         title: "New Collection Requests", description: "Get notified 24 hours before your scheduled collection." },
      { key: "email:activity"   as CollectorNotificationKey, icon: Users,         title: "Account Activity",        description: "Security alert, password changes and login notifications." },
      { key: "email:payment"    as CollectorNotificationKey, icon: DollarSign,    title: "Payment",                 description: "Transaction confirmations, low balance alerts, payout notifications." },
    ],
  },
  {
    id: "inapp",
    title: "In-App Notification",
    subtitle: "Get instant updates within the platform.",
    items: [
      { key: "inapp:reminders" as CollectorNotificationKey, icon: Truck,          title: "Collection Reminders",    description: "Receive a text message 1 hour before pickup." },
      { key: "inapp:alerts"    as CollectorNotificationKey, icon: AlertTriangle,  title: "Important Alerts",        description: "Request cancellations, updates, weather delays, and urgent updates." },
    ],
  },
];
