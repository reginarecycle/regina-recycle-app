import { Switch } from "@/components/ui/switch";
import type { LucideIcon } from "lucide-react";

interface NotificationRowProps {
  icon: LucideIcon;
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}

export function NotificationRow({
  icon: Icon,
  title,
  description,
  checked,
  onToggle,
}: NotificationRowProps) {
  return (
    <div className="px-4 py-3 rounded-xl bg-[#F7F7F7] flex items-center justify-between gap-3">
      <div className="flex md:items-center  gap-2 flex-col md:flex-row ">
      <div className="w-[45px] h-[45px] p-2.5 rounded-lg bg-white flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm mb-0.5">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      </div>

      <Switch className="shrink-0" checked={checked} onCheckedChange={onToggle} />
    </div>
  );
}
