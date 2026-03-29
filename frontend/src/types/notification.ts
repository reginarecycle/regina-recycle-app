import type { LucideIcon } from "lucide-react";

// ─── Notification Settings (used by NotificationSection component) ────────────
export type NotificationKey =
  | "email:pickup"
  | "email:activity"
  | "email:marketing"
  | "inapp:pickup"
  | "inapp:alerts";

export type NotificationPrefs = Record<string, boolean>;

export interface NotificationItem {
  key: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface NotificationSection {
  id: string;
  title: string;
  subtitle: string;
  items: NotificationItem[];
  saveLabel?: string;
}

export type BackendNotificationType =
  | "PICKUP_SCHEDULED"
  | "IN_APP_PICKUP_REMINDER"
  | "EMAIL_PICKUP_REMINDER"
  | "ACCOUNT_ACTIVITY"
  | "PAYMENT_ACTIVITY"
  | "MARKETING"
  | "ALERT";

export interface BackendNotification {
  notificationId: string;
  type: BackendNotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ─── Notifications Page (used by NotificationsPage) ───────────────────────────
export type NotificationType     = "success" | "warning" | "error" | "info" | "marketing" ;
export type CustomerCategory     = "all" | "pickups" | "payments" | "alerts" | "account" | "marketing" ;
export type CollectorCategory    = "all" | "requests" | "payments" | "alerts" | "account";
export type NotificationCategory = CustomerCategory | CollectorCategory;
export type ViewMode             = "all" | "unread" | "read";
export type UserRole             = "customer" | "collector";

export interface Notification {
  id:        string;
  type:      NotificationType;
  category:  NotificationCategory;
  title:     string;
  message:   string;
  timestamp: Date;
  read:      boolean;
  link?:     string;
  icon:      React.ReactNode;
}

export interface NotificationTab {
  value: string;
  label: string;
}