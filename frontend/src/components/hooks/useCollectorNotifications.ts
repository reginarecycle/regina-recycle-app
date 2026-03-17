import { useState } from "react";
import type { CollectorNotificationKey } from "@/constants/data";

type CollectorNotificationPrefs = Record<CollectorNotificationKey, boolean>;

const DEFAULT_PREFS: CollectorNotificationPrefs = {
  "email:collection": true,
  "email:activity":   true,
  "email:payment":    false,
  "inapp:reminders":  false,
  "inapp:alerts":     true,
};

export function useCollectorNotifications() {
  const [saved, setSaved] = useState<CollectorNotificationPrefs>(DEFAULT_PREFS);
  const [prefs, setPrefs] = useState<CollectorNotificationPrefs>(DEFAULT_PREFS);

  const changed = JSON.stringify(prefs) !== JSON.stringify(saved);

  const handleToggle = (key: CollectorNotificationKey) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  };

  const handleSave = () => {
    setSaved(prefs);
    // TODO: call your API here
  };

  return { prefs, changed, handleToggle, handleSave };
}
