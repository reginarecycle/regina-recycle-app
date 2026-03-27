import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";
import { useState, useEffect } from "react";
import type { CollectorNotificationKey } from "@/constants/data";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";


type CollectorNotificationPrefs = Record<CollectorNotificationKey, boolean>;

interface NotificationPrefs {
  emailPickupReminder:  boolean;
  emailAccountActivity: boolean;
  emailPayment:         boolean;
  inAppPickupReminder:  boolean;
  inAppAlerts:          boolean;
}

const toFrontend = (prefs: NotificationPrefs): CollectorNotificationPrefs => ({
  "email:collection": prefs.emailPickupReminder,
  "email:activity":   prefs.emailAccountActivity,
  "email:payment":    prefs.emailPayment,
  "inapp:reminders":  prefs.inAppPickupReminder,
  "inapp:alerts":     prefs.inAppAlerts,
});

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

// ─── UI ────────────────────────────────────────────────────────────────────

const emailNotifications: { key: CollectorNotificationKey; label: string; description: string }[] = [
  { key: "email:collection", label: "Collection Reminders", description: "Get notified about upcoming pickup schedules." },
  { key: "email:activity",   label: "Account Activity",     description: "Emails about logins and account changes." },
  { key: "email:payment",    label: "Payment Updates",      description: "Receive emails for transactions and payouts." },
];

const inAppNotifications: { key: CollectorNotificationKey; label: string; description: string }[] = [
  { key: "inapp:reminders", label: "In-App Reminders", description: "Reminders shown inside the app for collections." },
  { key: "inapp:alerts",    label: "In-App Alerts",    description: "Important alerts about your collector activity." },
];

export function CollectorNotificationsTab() {
  const { prefs, changed, handleToggle, handleSave } = useCollectorNotifications();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-1">Notification Preferences</h2>
        <p className="text-sm text-muted-foreground">
          Manage how and when you receive notifications for your collector account.
        </p>
      </div>

      {/* Email Notifications */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
          Email Notifications
        </h3>
        <div className="space-y-5">
          {emailNotifications.map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <div>
                <Label className="text-sm font-medium">{label}</Label>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <Switch checked={prefs[key]} onCheckedChange={() => handleToggle(key)} />
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-6" />

      {/* In-App Notifications */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
          In-App Notifications
        </h3>
        <div className="space-y-5">
          {inAppNotifications.map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <div>
                <Label className="text-sm font-medium">{label}</Label>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <Switch checked={prefs[key]} onCheckedChange={() => handleToggle(key)} />
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          disabled={!changed}
          className="w-full sm:w-[174px] h-11 min-w-0 border-[rgba(221,30,30,0.60)] text-red-500 hover:bg-red-50 disabled:opacity-60"
          onClick={() => window.location.reload()}
        >
          Cancel
        </Button>
        <Button
          type="button"
          disabled={!changed}
          onClick={handleSave}
          className="w-full sm:w-[174px] h-11 min-w-0 bg-primary hover:bg-primary/90 disabled:opacity-60"
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
}