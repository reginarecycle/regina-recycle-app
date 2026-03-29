import { Fragment } from "react";
import { Separator } from "@/components/ui/separator";
import { NotificationSection } from "@/components/profile/notificationSection";
import { COLLECTOR_NOTIFICATION_SECTIONS } from "@/constants/data";
import { useCollectorNotifications } from "@/components/hooks/useCollectorNotifications";

export function CollectorNotificationsTab() {
  const { prefs, changed, handleToggle, handleSave, isSaving } = useCollectorNotifications();

  return (
    <section className="p-8">
      <div className="space-y-8">
        {COLLECTOR_NOTIFICATION_SECTIONS.map((section, i) => (
          <Fragment key={section.id}>
            {i > 0 && <Separator />}
            <NotificationSection
              section={section as any}
              prefs={prefs as any}
              onToggle={handleToggle as any}
              changed={i === 0 ? changed : undefined}
              onSave={i === 0 ? handleSave : undefined}
              isSaving={i === 0 ? isSaving : undefined}
            />
          </Fragment>
        ))}
      </div>
    </section>
  );
}