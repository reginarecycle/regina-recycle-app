import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, User, FileText, Calendar, MapPin, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RecycleRecord, RecycleStatus } from "./types.tsx";
import { MaterialTag } from "./MaterialTag";

// Status badge for the detail modal — slightly different style (green filled for approved/completed)
const DetailStatusBadge: React.FC<{ status: RecycleStatus }> = ({ status }) => {
  const map: Record<RecycleStatus, { label: string; className: string }> = {
    COMPLETED: { label: "APPROVED",   className: "bg-green-500 text-white"          },
    PENDING:   { label: "PENDING",    className: "bg-yellow-100 text-yellow-700"    },
    CANCELLED: { label: "CANCELLED",  className: "bg-red-500 text-white"            },
  };
  const { label, className } = map[status];
  return (
    <span className={cn("inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-wide", className)}>
      {label}
    </span>
  );
};

// Single detail row with icon
interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value, subValue }) => (
  <div className="flex items-start gap-4">
    <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
      {icon}
    </div>
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-base font-bold text-foreground">{value}</p>
      {subValue && <p className="text-xs text-muted-foreground mt-0.5">{subValue}</p>}
    </div>
  </div>
);

interface ScheduleDetailsModalProps {
  open: boolean;
  record: RecycleRecord | null;
  onClose: () => void;
}

export const ScheduleDetailsModal: React.FC<ScheduleDetailsModalProps> = ({
  open,
  record,
  onClose,
}) => {
  if (!record) return null;

  const handleDownload = () => {
    // Placeholder — wire up to real download logic
    console.log("Downloading report for", record.referenceNumber);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="p-0 gap-0 max-w-[520px] w-full rounded-2xl overflow-hidden border border-border [&>button]:hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5">
          <h2 className="text-2xl font-bold text-foreground">Schedule Details</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="h-px bg-border" />

        {/* Body — scrollable */}
        <div className="px-7 py-6 overflow-y-auto max-h-[calc(90vh-180px)] flex flex-col gap-6">

          {/* Reference + Status */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Reference Number</p>
              <p className="text-xl font-bold text-foreground">{record.referenceNumber}</p>
            </div>
            <DetailStatusBadge status={record.status} />
          </div>

          <div className="h-px bg-border" />

          {/* Detail rows */}
          <div className="flex flex-col gap-5">
            <DetailRow
              icon={<User className="w-5 h-5 text-muted-foreground" />}
              label="Collector Name"
              value={record.collectorName}
              subValue={`ID: ${record.collectorId}`}
            />
            <DetailRow
              icon={<FileText className="w-5 h-5 text-muted-foreground" />}
              label="Request Date"
              value={record.requestDate}
            />
            <DetailRow
              icon={<Calendar className="w-5 h-5 text-muted-foreground" />}
              label="Scheduled Pickup Date"
              value={record.scheduledPickupDate}
            />
            <DetailRow
              icon={<MapPin className="w-5 h-5 text-muted-foreground" />}
              label="Pickup Location"
              value={record.pickupLocation}
            />
          </div>

          {/* Materials Collected */}
          <div className="rounded-2xl bg-gray-50 border border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-muted-foreground" />
              <p className="text-sm font-bold text-foreground">Materials Collected</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {record.materials.map((m) => (
                <MaterialTag key={m} material={m} size="md" />
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="h-px bg-border" />
        <div className="flex items-center justify-end gap-3 px-7 py-5">
          <Button
            variant="outline"
            className="min-w-[120px] h-12 font-semibold rounded-xl"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            variant="default"
            className="min-w-[180px] h-12 font-semibold rounded-xl"
            onClick={handleDownload}
          >
            Download Report
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
};