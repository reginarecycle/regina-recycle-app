import { useEffect, useMemo, useState, useCallback } from "react";
import {
  useNotificationsPreferences,
  useUpdateNotificationPreferences, // new
  useCreateNotificationPreferences,
  type NotificationPreferencesDto,
  type UpdateNotificationPreferencePayload,
} from "@/api-hooks/useNotifications";
import type { NotificationKey, NotificationPrefs } from "@/types/notification";

const DEFAULT_PREFS: NotificationPrefs = {
  "email:pickup": true,
  "email:activity": true,
  "email:marketing": false,
  "inapp:pickup": true,
  "inapp:alerts": true,
};

function mapBackendToFrontend(
  prefs?: NotificationPreferencesDto
): NotificationPrefs {
  return {
    "email:pickup": prefs?.emailPickupReminder ?? true,
    "email:activity": prefs?.emailAccountActivity ?? true,
    "email:marketing": prefs?.emailMarketing ?? false,
    "inapp:pickup": prefs?.inAppPickupReminder ?? true,
    "inapp:alerts": prefs?.inAppAlerts ?? true,
  };
}

function mapFrontendToBackend(
  prefs: NotificationPrefs
): UpdateNotificationPreferencePayload {
  return {
    emailPickupReminder: prefs["email:pickup"],
    emailAccountActivity: prefs["email:activity"],
    emailMarketing: prefs["email:marketing"],
    inAppPickupReminder: prefs["inapp:pickup"],
    inAppAlerts: prefs["inapp:alerts"],
  };
}
// for the notifcation page
export function useNotificationPrefs2() {
  const { data, isLoading, error, refetch } = useNotificationsPreferences();
  const updatePrefsMutation = useCreateNotificationPreferences();

  const [saved, setSaved] = useState<NotificationPrefs>(DEFAULT_PREFS);
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);

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

  const handleToggle = useCallback((key: NotificationKey) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleSave = useCallback(() => {
    const payload = mapFrontendToBackend(prefs);

    updatePrefsMutation.mutate(payload, {
      onSuccess: () => {
        setSaved(prefs);
        refetch();
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

//-------------- for the customer profile page ------------------------
  const mapApiToUi = (data: NotificationPreferencesDto): NotificationPrefs => ({
  "email:pickup": data.emailPickupReminder,
  "email:activity": data.emailAccountActivity,
  "email:marketing": data.emailMarketing,
  "inapp:pickup": data.inAppPickupReminder,
  "inapp:alerts": data.inAppAlerts,
});

const mapUiToApi = (prefs: NotificationPrefs): NotificationPreferencesDto => ({
  emailPickupReminder: prefs["email:pickup"],
  emailAccountActivity: prefs["email:activity"],
  emailMarketing: prefs["email:marketing"],
  inAppPickupReminder: prefs["inapp:pickup"],
  inAppAlerts: prefs["inapp:alerts"],
});

export function useNotificationPrefs() {
  const { data } = useNotificationsPreferences();
  const { mutate: updatePrefs } = useUpdateNotificationPreferences();
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    if (data?.data) {
      setPrefs(mapApiToUi(data.data));
    }
  }, [data]);

  const changed = JSON.stringify(prefs) !== JSON.stringify(data?.data ? mapApiToUi(data.data) : DEFAULT_PREFS);

  const handleToggle = useCallback((key: NotificationKey) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }, []);

  const handleSave = useCallback(() => {
    updatePrefs(mapUiToApi(prefs));
  }, [prefs, updatePrefs]);

  return { prefs, changed, handleToggle, handleSave };
}