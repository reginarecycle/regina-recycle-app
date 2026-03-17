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
  CheckCircle2,
  XCircle,
  Package,
} from "lucide-react";

import imgPlastic from "@/assets/KidsRecycleImg.png";
import imgPaper from "@/assets/map.png";
import imgGlass from "@/assets/RecyclePhones.png";
import type { RecyclingItem } from "./interface";
import type { NotificationSection, Notification, NotificationTab } from "@/types/notification";


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
    href: "/app/collector",
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

export const customerNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    category: "pickups",
    title: "Pickup Confirmed",
    message: "Your pickup has been scheduled for tomorrow at 2:00 PM",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    link: "/app/schedule",
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  {
    id: "2",
    type: "info",
    category: "pickups",
    title: "Pickup Reminder",
    message: "Your scheduled pickup is in 1 hour. Please have your materials ready.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    link: "/app/schedule",
    icon: <Truck className="h-5 w-5" />,
  },
  {
    id: "3",
    type: "success",
    category: "payments",
    title: "Payment Received",
    message: "You've earned $45.50 from your recent pickup",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    link: "/app/wallet",
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    id: "4",
    type: "warning",
    category: "alerts",
    title: "Weather Alert",
    message: "Severe weather expected tomorrow. Pickup may be delayed.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
    link: "/app/schedule",
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  {
    id: "5",
    type: "error",
    category: "pickups",
    title: "Pickup Cancelled",
    message: "Your pickup scheduled for Dec 15 has been cancelled due to weather conditions.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
    link: "/app/schedule",
    icon: <XCircle className="h-5 w-5" />,
  },
  {
    id: "6",
    type: "info",
    category: "account",
    title: "Profile Updated",
    message: "Your account information has been successfully updated.",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    read: true,
    icon: <Clock className="h-5 w-5" />,
  },
];

export const collectorNotifications: Notification[] = [
  {
    id: "1",
    type: "info",
    category: "requests",
    title: "New Collection Request",
    message: "John Doe has requested a pickup for 50 kg of materials",
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    read: false,
    link: "/app/collector/requests",
    icon: <Package className="h-5 w-5" />,
  },
  {
    id: "2",
    type: "warning",
    category: "requests",
    title: "Request Cancelled",
    message: "Customer has cancelled the pickup scheduled for tomorrow",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    read: false,
    link: "/app/collector/requests",
    icon: <XCircle className="h-5 w-5" />,
  },
  {
    id: "3",
    type: "success",
    category: "payments",
    title: "Payment Sent",
    message: "Payment of $125.00 has been sent to John Doe",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: true,
    link: "/app/collector/wallet",
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    id: "4",
    type: "info",
    category: "requests",
    title: "Pickup Completed",
    message: "Collection from Jane Smith has been marked as completed",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    link: "/app/collector/requests",
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  {
    id: "5",
    type: "warning",
    category: "alerts",
    title: "Weather Alert",
    message: "Severe weather expected tomorrow. Plan your routes accordingly.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
    link: "/app/collector/dashboard",
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  {
    id: "6",
    type: "info",
    category: "account",
    title: "New Customer",
    message: "A new customer has joined your service area",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    read: true,
    link: "/app/collector/users",
    icon: <Users className="h-5 w-5" />,
  },
];

export const customerTabs: NotificationTab[] = [
  { value: "all",      label: "All"      },
  { value: "pickups",  label: "Pickups"  },
  { value: "payments", label: "Payments" },
  { value: "alerts",   label: "Alerts"   },
  { value: "account",  label: "Account"  },
];

export const collectorTabs: NotificationTab[] = [
  { value: "all",      label: "All"      },
  { value: "requests", label: "Requests" },
  { value: "payments", label: "Payments" },
  { value: "alerts",   label: "Alerts"   },
  { value: "account",  label: "Account"  },
];
