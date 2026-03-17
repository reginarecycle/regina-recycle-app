import type { LucideIcon } from "lucide-react";

export type NotificationKey =
  | "email:pickup"
  | "email:activity"
  | "email:marketing"
  | "inapp:pickup"
  | "inapp:alerts";

export type NotificationPrefs = Record<NotificationKey, boolean>;

export interface NotificationItem {
  key: NotificationKey;
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
