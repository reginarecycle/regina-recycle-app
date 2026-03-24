import { useState, useCallback } from "react";
import type { NotificationKey, NotificationPrefs } from "@/types/notification";

const DEFAULT_PREFS: NotificationPrefs = {
  "email:pickup": true,
  "email:activity": true,
  "email:marketing": false,
  "inapp:pickup": true,
  "inapp:alerts": true,
};

export function useNotificationPrefs() {
  const [saved, setSaved] = useState<NotificationPrefs>(DEFAULT_PREFS);
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);

  const changed = JSON.stringify(prefs) !== JSON.stringify(saved);

  const handleToggle = useCallback((key: NotificationKey) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }, []);

  const handleSave = useCallback(() => {
    setSaved(prefs);
    // TODO: call your API here, e.g. await updateNotificationPrefs(prefs)
  }, [prefs]);

  return { prefs, changed, handleToggle, handleSave };
}
