import { useGetOne, usePatch } from "@/lib/queryHelpers";

export interface NotificationPreferencesDto  {
  emailPickupReminder: boolean;
  emailAccountActivity: boolean;
  emailMarketing: boolean;
  inAppPickupReminder: boolean;
  inAppAlerts: boolean;
}

export function useNotificationPreferences() {
  return useGetOne<NotificationPreferencesDto >(
    ["notification-preferences"],
    "/notifications/preferences"
  );
}

export function useUpdateNotificationPreferences() {
  return usePatch<NotificationPreferencesDto , NotificationPreferencesDto >(
    "/notifications/preferences",
    ["notification-preferences"]
  );
}