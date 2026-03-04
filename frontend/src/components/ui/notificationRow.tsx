import React from "react";
import { Switch } from "@/components/ui/switch";

interface Props {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export default function NotificationRow({
  icon,
  title,
  description,
  checked,
  onChange,
  className = "",
}: Props) {
  return (
    <div className={`flex items-center justify-between h-[73px] px-6 py-3.5 rounded-xl bg-[#F7F7F7] gap-4 ${className}`}>
      <div className="flex items-center gap-4 flex-1">
        <div className="flex w-[45px] h-[45px] p-2.5 items-center justify-center rounded-lg bg-white shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <Switch
        checked={checked}
        onCheckedChange={(val) => onChange?.(Boolean(val))}
        className="shrink-0"
      />
    </div>
  );
}