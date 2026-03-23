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

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.slice(0, 3);
  return `${visible}${"*".repeat(Math.max(local.length - 3, 3))}@${domain}`;
}

// Formats a number as currency
// formatCurrency(45.5)              → "$45.50 CAD"
// formatCurrency(45.5, "CAD", false) → "45.50"
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