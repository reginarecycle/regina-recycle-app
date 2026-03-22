import * as React from "react";
import { cn } from "@/lib/utils";
import type { RecycleStatus } from "./types.tsx";

const STATUS_MAP: Record<RecycleStatus, { label: string; className: string }> = {
  COMPLETED: { label: "Completed",  className: "bg-green-100 text-green-700 border border-green-200"    },
  PENDING:   { label: "Pending",    className: "bg-yellow-100 text-yellow-600 border border-yellow-200" },
  CANCELLED: { label: "Cancelled",  className: "bg-red-500 text-white border border-red-500"             },
};

interface StatusBadgeProps {
  status: RecycleStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { label, className } = STATUS_MAP[status];
  return (
    <span className={cn("inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap", className)}>
      {label}
    </span>
  );
};