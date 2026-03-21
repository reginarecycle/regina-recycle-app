import * as React from "react";
import type { RecycleRecord } from "./types.tsx";
import { MaterialTag } from "./MaterialTag";
import { StatusBadge } from "./StatusBadge";

// Shared grid — used by both header and rows
export const HISTORY_GRID = "grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)_160px_160px_120px]";

interface HistoryRowProps {
  record: RecycleRecord;
  onViewMore: (record: RecycleRecord) => void;
}

export const HistoryRow: React.FC<HistoryRowProps> = ({ record, onViewMore }) => (
  <div className={`grid ${HISTORY_GRID} items-center py-4 border-b border-border last:border-0 px-6`}>
    {/* Location */}
    <div className="text-sm font-medium text-foreground pr-4 truncate">
      {record.location}
    </div>

    {/* Materials */}
    <div className="flex items-center gap-1.5 flex-wrap pr-4">
      {record.materials.map((m) => (
        <MaterialTag key={m} material={m} />
      ))}
    </div>

    {/* Date */}
    <div className="text-sm text-muted-foreground">{record.date}</div>

    {/* Status */}
    <div>
      <StatusBadge status={record.status} />
    </div>

    {/* Action */}
    <div>
      <button
        onClick={() => onViewMore(record)}
        className="text-sm font-semibold text-foreground hover:text-primary transition-colors whitespace-nowrap"
      >
        View More
      </button>
    </div>
  </div>
);