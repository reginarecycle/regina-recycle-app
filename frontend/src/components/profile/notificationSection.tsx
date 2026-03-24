import { Button } from "@/components/ui/button";
import type { NotificationSection, NotificationPrefs, NotificationKey } from "@/types/notification";
import { NotificationRow } from "./notificationRow";
import type { LucideIcon } from "lucide-react";
import type { Key } from "react";

interface NotificationSectionProps {
  section: NotificationSection;
  prefs: NotificationPrefs;
  onToggle: (key: NotificationKey) => void;
  changed?: boolean;
  onSave?: () => void;
}

export function NotificationSection({
  section,
  prefs,
  onToggle,
  changed,
  onSave,
}: NotificationSectionProps) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-1">{section.title}</h2>
          <p className="text-sm text-muted-foreground">{section.subtitle}</p>
        </div>
        {onSave && (
          <Button
            className="w-full sm:w-[174px] h-11 min-w-0 bg-primary hover:bg-primary/90 disabled:opacity-60"
            onClick={onSave}
            disabled={!changed}
          >
            {section.saveLabel ?? "Update Preferences"}
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {section.items.map((item: { key: Key | null | undefined; icon: LucideIcon; title: string; description: string; }) => (
          <NotificationRow
            key={item.key}
            icon={item.icon}
            title={item.title}
            description={item.description}
            checked={item.key !== undefined ? prefs[item.key as NotificationKey] : false}
            onToggle={() => {
              if (item.key !== undefined) {
                onToggle(item.key as NotificationKey);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
