import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Notification, NotificationType } from "@/types/notification";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTypeStyles = (type: NotificationType) => {
  const styles = {
    success: { bg: "bg-green-50", iconBg: "bg-green-100", iconColor: "text-green-600", border: "border-green-200" },
    warning: { bg: "bg-yellow-50", iconBg: "bg-yellow-100", iconColor: "text-yellow-600", border: "border-yellow-200" },
    error: { bg: "bg-red-50", iconBg: "bg-red-100", iconColor: "text-red-600", border: "border-red-200" },
    info: { bg: "bg-blue-50", iconBg: "bg-blue-100", iconColor: "text-blue-600", border: "border-blue-200" },
    marketing: { bg: "bg-purple-50", iconBg: "bg-purple-100", iconColor: "text-purple-600", border: "border-purple-200" },
  };
  return styles[type];
};

export const formatTimestamp = (date: Date): string => {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const formatFullDate = (date: Date): string => {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export type NotificationGroup = "Today" | "Yesterday" | "This Week" | "Older";

export const groupByDate = (
  notifications: Notification[]
): Record<NotificationGroup, Notification[]> => {
  const groups: Record<NotificationGroup, Notification[]> = {
    Today: [],
    Yesterday: [],
    "This Week": [],
    Older: [],
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  notifications.forEach((n) => {
    const d = new Date(n.timestamp);
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    if (day.getTime() === today.getTime()) groups.Today.push(n);
    else if (day.getTime() === yesterday.getTime()) groups.Yesterday.push(n);
    else if (d >= weekAgo) groups["This Week"].push(n);
    else groups.Older.push(n);
  });

  return groups;
};

export type DateRange = "today" | "7days" | "30days" | "alltime";

export function buildDateRange(dateRange: DateRange): { startDate?: string; endDate?: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const toISO = (d: Date) => d.toISOString().split("T")[0];

  if (dateRange === "today") {
    const d = toISO(today);
    return { startDate: d, endDate: d };
  }
  if (dateRange === "7days") {
    const start = new Date(today);
    start.setDate(start.getDate() - 7);
    return { startDate: toISO(start), endDate: toISO(today) };
  }
  if (dateRange === "30days") {
    const start = new Date(today);
    start.setDate(start.getDate() - 30);
    return { startDate: toISO(start), endDate: toISO(today) };
  }
  return {};
}

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-CA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-CA", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export function formatTimeRange(iso: string, durationHours = 2): string {
  const start = new Date(iso);
  const end   = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
  const fmt   = (d: Date) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${fmt(start)} – ${fmt(end)}`;
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.slice(0, 3);
  return `${visible}${"*".repeat(Math.max(local.length - 3, 3))}@${domain}`;
}


export function formatCurrency(
  amount: number,
  currency: string = "CAD",
  showSymbol: boolean = true
): string {
  const formatted = amount.toLocaleString("en-CA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return showSymbol ? `$${formatted} ${currency}` : formatted;
}
