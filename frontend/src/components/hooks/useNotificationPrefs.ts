import { useEffect, useMemo, useState, useCallback } from "react";
import {
  useNotificationsPreferences,
  useUpdateNotificationPreferences,
  type NotificationPreferencesDto,
  type UpdateNotificationPreferencePayload,
} from "@/api-hooks/useNotifications";
import type { NotificationKey, NotificationPrefs } from "@/types/notification";

const DEFAULT_PREFS: NotificationPrefs = {
  "email:pickup": true,
  "email:activity": true,
  "email:marketing": false,
  "email:payment": false,
  "inapp:pickup": true,
  "inapp:alerts": true,
};

const mapApiToUi = (data?: NotificationPreferencesDto): NotificationPrefs => ({
  "email:pickup": data?.emailPickupReminder ?? DEFAULT_PREFS["email:pickup"],
  "email:activity": data?.emailAccountActivity ?? DEFAULT_PREFS["email:activity"],
  "email:marketing": data?.emailMarketing ?? DEFAULT_PREFS["email:marketing"],
  "email:payment": data?.emailPayment ?? DEFAULT_PREFS["email:payment"],
  "inapp:pickup": data?.inAppPickupReminder ?? DEFAULT_PREFS["inapp:pickup"],
  "inapp:alerts": data?.inAppAlerts ?? DEFAULT_PREFS["inapp:alerts"],
});

const mapUiToApi = (
  prefs: NotificationPrefs
): UpdateNotificationPreferencePayload => ({
  emailPickupReminder: prefs["email:pickup"],
  emailAccountActivity: prefs["email:activity"],
  emailMarketing: prefs["email:marketing"],
  emailPayment: prefs["email:payment"],
  inAppPickupReminder: prefs["inapp:pickup"],
  inAppAlerts: prefs["inapp:alerts"],
});

export function useNotificationPrefs() {
  const { data, isLoading, error, refetch } = useNotificationsPreferences();
  const updatePrefsMutation = useUpdateNotificationPreferences();
  const [saved, setSaved, ] = useState<NotificationPrefs>(DEFAULT_PREFS);
  const [showSaving, setShowSaving] = useState(false);
  const { mutate: updatePrefs } = useUpdateNotificationPreferences();
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    const backendPrefs = data?.data;
    const mapped = mapApiToUi(backendPrefs);

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
    setShowSaving(true);

  updatePrefs(mapUiToApi(prefs), {
    onSettled: () => {
      setTimeout(() => {
        setShowSaving(false);
      }, 800);
    },
  });
}, [prefs, updatePrefs]);

  return { prefs, changed, handleToggle, handleSave, isSaving: showSaving };
}
