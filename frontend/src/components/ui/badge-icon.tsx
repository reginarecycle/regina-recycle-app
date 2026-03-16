import type { RecyclingItem } from "@/constants/interface";
import { AlertTriangleIcon, BadgeCheckIcon, Trash } from "lucide-react";
import CompositeIcon from "@/assets/composite-icon.svg?react";

function BadgeIcon({
  type,
  color,
}: {
  type: RecyclingItem["badgeIcon"];
  color: string;
}) {
  const icons = {
    check: <BadgeCheckIcon className="size-4 text-white" />,
    bin: <Trash className="size-4 text-white" />,
    compost: <CompositeIcon className="size-4 text-white" />,
    warning: <AlertTriangleIcon className="size-4 text-white" />,
  };
  return (
    <div
      className="absolute top-2 right-2 size-8 rounded-full flex items-center justify-center z-10"
      style={{ backgroundColor: color }}
    >
      {icons[type]}
    </div>
  );
}

export default BadgeIcon;
