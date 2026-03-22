import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, User, FileText, Calendar, MapPin, Package } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { MaterialTag } from "@/components/ui/material-tag";
import type { RecycleRecord } from "./types.tsx";

// ─── Print HTML builder ────────────────────────────────────────────────────────

function buildPrintHTML(record: RecycleRecord): string {
  const statusLabel = record.status === "COMPLETED" ? "APPROVED" : record.status;
  const statusColor =
    record.status === "COMPLETED" ? "#22c55e" :
    record.status === "PENDING"   ? "#f59e0b" : "#ef4444";
  const statusTextColor = record.status === "PENDING" ? "#92400e" : "#fff";

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Schedule Report – ${record.referenceNumber}</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: #fff; color: #0C111D;
        padding: 48px 56px; max-width: 680px; margin: 0 auto;
      }
      .page-title { font-size: 26px; font-weight: 800; margin-bottom: 4px; }
      .page-sub   { font-size: 12px; color: #999CA0; margin-bottom: 32px; }
      .ref-row    { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
      .ref-label  { font-size: 12px; color: #999CA0; margin-bottom: 6px; }
      .ref-number { font-size: 22px; font-weight: 800; }
      .badge {
        display: inline-flex; align-items: center;
        padding: 5px 16px; border-radius: 999px;
        font-size: 11px; font-weight: 800; letter-spacing: 0.08em;
        background: ${statusColor}; color: ${statusTextColor}; margin-top: 4px;
      }
      hr { border: none; border-top: 1px solid #E5E7EB; margin: 24px 0; }
      .detail-row { display: flex; align-items: flex-start; gap: 16px; padding: 16px 0; border-bottom: 1px solid #F3F4F6; }
      .detail-row:last-child { border-bottom: none; }
      .icon-box {
        width: 44px; height: 44px; min-width: 44px;
        border-radius: 12px; background: #F9FAFB; border: 1px solid #E5E7EB;
        display: flex; align-items: center; justify-content: center; font-size: 18px;
      }
      .detail-label { font-size: 12px; color: #999CA0; margin-bottom: 4px; }
      .detail-value { font-size: 15px; font-weight: 700; }
      .detail-sub   { font-size: 12px; color: #999CA0; margin-top: 3px; }
      .materials-section { margin-top: 24px; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 16px; padding: 20px; }
      .materials-header  { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; margin-bottom: 14px; }
      .tag { display: inline-block; padding: 6px 18px; border-radius: 999px; background: #344E41; color: white; font-size: 13px; font-weight: 600; margin: 0 8px 8px 0; }
      .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #E5E7EB; font-size: 11px; color: #999CA0; text-align: center; }
      @media print { body { padding: 20px 32px; } @page { margin: 15mm; size: A4; } }
    </style>
  </head>
  <body>
    <div class="page-title">Schedule Details</div>
    <div class="page-sub">Generated on ${new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}</div>

    <div class="ref-row">
      <div>
        <div class="ref-label">Reference Number</div>
        <div class="ref-number">${record.referenceNumber}</div>
      </div>
      <span class="badge">${statusLabel}</span>
    </div>

    <hr />

    <div class="detail-row">
      <div class="icon-box">👤</div>
      <div>
        <div class="detail-label">Collector Name</div>
        <div class="detail-value">${record.collectorName}</div>
        <div class="detail-sub">ID: ${record.collectorId}</div>
      </div>
    </div>
    <div class="detail-row">
      <div class="icon-box">📄</div>
      <div>
        <div class="detail-label">Request Date</div>
        <div class="detail-value">${record.requestDate}</div>
      </div>
    </div>
    <div class="detail-row">
      <div class="icon-box">📅</div>
      <div>
        <div class="detail-label">Scheduled Pickup Date</div>
        <div class="detail-value">${record.scheduledPickupDate}</div>
      </div>
    </div>
    <div class="detail-row">
      <div class="icon-box">📍</div>
      <div>
        <div class="detail-label">Pickup Location</div>
        <div class="detail-value">${record.pickupLocation}</div>
      </div>
    </div>

    <div class="materials-section">
      <div class="materials-header"><span>📦</span><span>Materials Collected</span></div>
      <div>${record.materials.map((m) => `<span class="tag">${m}</span>`).join("")}</div>
    </div>

    <div class="footer">Regina Recycle — Schedule Report &nbsp;·&nbsp; ${record.referenceNumber}</div>
  </body>
</html>`;
}

// ─── Detail Row ───────────────────────────────────────────────────────────────

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value, subValue }) => (
  <div className="flex items-start gap-4">
    <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center shrink-0 mt-0.5">
      {icon}
    </div>
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-base font-bold text-foreground">{value}</p>
      {subValue && <p className="text-xs text-muted-foreground mt-0.5">{subValue}</p>}
    </div>
  </div>
);

// ─── Modal ────────────────────────────────────────────────────────────────────

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
    const printWindow = window.open("", "_blank", "width=800,height=950");
    if (!printWindow) return;
    printWindow.document.open();
    printWindow.document.write(buildPrintHTML(record));
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 400);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="p-0 gap-0 max-w-130 w-full rounded-2xl overflow-hidden border border-border [&>button]:hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5">
          <h2 className="text-2xl font-bold text-foreground">Schedule Details</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="h-px bg-border" />

        {/* Body */}
        <div className="px-7 py-6 overflow-y-auto max-h-[calc(90vh-180px)] flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Reference Number</p>
              <p className="text-xl font-bold text-foreground">{record.referenceNumber}</p>
            </div>
            <StatusBadge
              status={record.status}
              label={record.status === "COMPLETED" ? "APPROVED" : undefined}
            />
          </div>

          <div className="h-px bg-border" />

          <div className="flex flex-col gap-5">
            <DetailRow icon={<User className="w-5 h-5 text-muted-foreground" />}     label="Collector Name"        value={record.collectorName}       subValue={`ID: ${record.collectorId}`} />
            <DetailRow icon={<FileText className="w-5 h-5 text-muted-foreground" />} label="Request Date"          value={record.requestDate} />
            <DetailRow icon={<Calendar className="w-5 h-5 text-muted-foreground" />} label="Scheduled Pickup Date" value={record.scheduledPickupDate} />
            <DetailRow icon={<MapPin className="w-5 h-5 text-muted-foreground" />}   label="Pickup Location"       value={record.pickupLocation} />
          </div>

          <div className="rounded-2xl bg-muted border border-border p-5">
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
          <Button variant="outline" className="min-w-30 h-12 font-semibold rounded-xl" onClick={onClose}>
            Close
          </Button>
          <Button variant="default" className="min-w-45 h-12 font-semibold rounded-xl" onClick={handleDownload}>
            Download Report
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
};
