import { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  useNotificationsPreferences,
  useUpdateNotificationPreferences,
  type NotificationPreferencesDto,
  type UpdateNotificationPreferencePayload,
} from "@/api-hooks/useNotifications";
import type { CollectorNotificationKey } from "@/constants/data";

type CollectorNotificationPrefs = Record<CollectorNotificationKey, boolean>;

const DEFAULT_PREFS: CollectorNotificationPrefs = {
  "email:collection": true,
  "email:activity": true,
  "email:payment": false,
  "inapp:reminders": false,
  "inapp:alerts": true,
};

function mapBackendToFrontend(
  prefs?: NotificationPreferencesDto
): CollectorNotificationPrefs {
  return {
    "email:collection": prefs?.emailPickupReminder ?? true,
    "email:activity": prefs?.emailAccountActivity ?? true,
    "email:payment": prefs?.emailPayment ?? false,
    "inapp:reminders": prefs?.inAppPickupReminder ?? false,
    "inapp:alerts": prefs?.inAppAlerts ?? true,
  };
}

function mapFrontendToBackend(
  prefs: CollectorNotificationPrefs
): UpdateNotificationPreferencePayload {
  return {
    emailPickupReminder: prefs["email:collection"],
    emailAccountActivity: prefs["email:activity"],
    emailPayment: prefs["email:payment"],
    inAppPickupReminder: prefs["inapp:reminders"],
    inAppAlerts: prefs["inapp:alerts"],
  };
}

export function useCollectorNotifications() {
  const { data, isLoading, error, refetch } = useNotificationsPreferences();
  const updatePrefsMutation = useUpdateNotificationPreferences();

  const [saved, setSaved] = useState<CollectorNotificationPrefs>(DEFAULT_PREFS);
  const [prefs, setPrefs] = useState<CollectorNotificationPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    const backendPrefs = data?.data;
    if (!backendPrefs) return;

    const mapped = mapBackendToFrontend(backendPrefs);
    setSaved(mapped);
    setPrefs(mapped);
  }, [data]);

  const changed = useMemo(
    () => JSON.stringify(prefs) !== JSON.stringify(saved),
    [prefs, saved]
  );

  const handleToggle = useCallback((key: CollectorNotificationKey) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleSave = useCallback(() => {
    const payload = mapFrontendToBackend(prefs);

    updatePrefsMutation.mutate(payload, {
      onSuccess: () => {
        setSaved(prefs);
        toast.success("Notification preferences updated.");
      },
      onError: () => {
        toast.error("Failed to update preferences. Please try again.");
      },
    });
  }, [prefs, refetch, updatePrefsMutation]);

  return {
    prefs,
    changed,
    handleToggle,
    handleSave,
    isLoading,
    isSaving: updatePrefsMutation.isPending,
    error,
  };
}