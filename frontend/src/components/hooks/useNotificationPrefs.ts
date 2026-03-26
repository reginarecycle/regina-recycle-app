import { useState, useCallback, useEffect } from "react";
import type { NotificationKey, NotificationPrefs } from "@/types/notification";
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
  type NotificationPreferencesDto,
} from "@/api-hooks/useNotifications";

const DEFAULT_PREFS: NotificationPrefs = {
  "email:pickup": true,
  "email:activity": true,
  "email:marketing": false,
  "inapp:pickup": true,
  "inapp:alerts": true,
};

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
  const { data } = useNotificationPreferences();
  const { mutate: updatePrefs , isPending: isSaving } = useUpdateNotificationPreferences();
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

  return { prefs, changed, handleToggle, handleSave, isSaving };
}
