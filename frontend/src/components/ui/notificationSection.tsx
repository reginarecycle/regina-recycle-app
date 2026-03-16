// components/ui/notificationSection.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import NotificationRow from "./notificationRow";

type RowDef = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  checked?: boolean;
};

interface Props {
  title: string;
  subtitle?: string;
  rows: RowDef[];
  onToggle: (id: string, checked: boolean) => void;
  onSave?: () => void;
  saveLabel?: string; // optional for sections that need a save button
  saveDisabled?: boolean;
}

export default function NotificationSection({
  title,
  subtitle,
  rows,
  onToggle,
  onSave,
  saveLabel,
  saveDisabled,
}: Props) {
  return (
    <section>
      {/* Keep header side-by-side; allow text to shrink correctly */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold mb-1">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>

        {onSave && saveLabel && (
          <Button
            className="w-[174px] h-11 min-w-0 bg-primary hover:bg-primary/90 text-white disabled:opacity-60 shrink-0"
            disabled={saveDisabled}
            onClick={onSave}
          >
            {saveLabel}
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {rows.map((r) => (
          <NotificationRow
            key={r.id}
            icon={r.icon}
            title={r.title}
            description={r.description}
            checked={r.checked}
            onChange={(checked) => onToggle(r.id, checked)}
          />
        ))}
      </div>
    </section>
  );
}

