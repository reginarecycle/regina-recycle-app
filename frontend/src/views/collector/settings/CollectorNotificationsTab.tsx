import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";
import { useState, useEffect } from "react";
import type { CollectorNotificationKey } from "@/constants/data";
import { toast } from "sonner";


type CollectorNotificationPrefs = Record<CollectorNotificationKey, boolean>;

interface NotificationPrefs {
  emailPickupReminder:  boolean;
  emailAccountActivity: boolean;
  emailPayment:         boolean;
  inAppPickupReminder:  boolean;
  inAppAlerts:          boolean;
}

// Map backend fields to frontend keys
const toFrontend = (prefs: NotificationPrefs): CollectorNotificationPrefs => ({
  "email:collection": prefs.emailPickupReminder,
  "email:activity":   prefs.emailAccountActivity,
  "email:payment":    prefs.emailPayment,
  "inapp:reminders":  prefs.inAppPickupReminder,
  "inapp:alerts":     prefs.inAppAlerts,
});

// Map frontend keys back to backend fields
const toBackend = (prefs: CollectorNotificationPrefs) => ({
  emailPickupReminder:  prefs["email:collection"],
  emailAccountActivity: prefs["email:activity"],
  emailPayment:         prefs["email:payment"],
  inAppPickupReminder:  prefs["inapp:reminders"],
  inAppAlerts:          prefs["inapp:alerts"],
});

const DEFAULT_PREFS: CollectorNotificationPrefs = {
  "email:collection": true,
  "email:activity":   true,
  "email:payment":    false,
  "inapp:reminders":  false,
  "inapp:alerts":     true,
};

export function useCollectorNotifications() {
  const qc = useQueryClient();

  const { data } = useQuery({
    queryKey: ["notification-preferences"],
    queryFn:  () => apiFetch<NotificationPrefs>("/notifications/preferences"),
  });

  const { mutate: savePrefs } = useMutation({
    mutationFn: (dto: Partial<NotificationPrefs>) =>
      apiFetch("/notifications/preferences", { method: "PATCH", data: dto }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notification-preferences"] }),
    onError: () => toast.error("An unexpected error occurred. Please try again later."),
  });

  

  const [prefs, setPrefs] = useState<CollectorNotificationPrefs>(DEFAULT_PREFS);
  const [saved, setSaved] = useState<CollectorNotificationPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    if (data?.data) {
      const mapped = toFrontend(data.data);
      setPrefs(mapped);
      setSaved(mapped);
    }
  }, [data]);

  const changed = JSON.stringify(prefs) !== JSON.stringify(saved);

  const handleToggle = (key: CollectorNotificationKey) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  };

  const handleSave = () => {
    savePrefs(toBackend(prefs), {
      onSuccess: () => setSaved(prefs),
    });
  };

  return { prefs, changed, handleToggle, handleSave };
}