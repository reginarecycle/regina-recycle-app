import { useState } from "react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { MaterialTag } from "@/components/ui/material-tag";
import { StatusBadge } from "@/components/ui/status-badge";
import { ScheduleDetailsModal } from "@/views/customer/history/ScheduleDetailsModal";
import type { RecycleRecord } from "@/views/customer/history/types.tsx";
import { useRouter } from "@/routes/hooks/use-router";
import { Routes } from "@/routes/routes";

type Material = "Plastic" | "Glass" | "Cardboard" | "Carton" | "Paper";
type Status = "Approved" | "Pending" | "Cancelled";

export type ScheduleItem = {
  id: string;
  materials: Material[];
  date: string;
  status: Status;
};

const schedules: ScheduleItem[] = [
  { id: "1", materials: ["Glass"],                         date: "2026-01-01", status: "Pending"     },
  { id: "2", materials: ["Cardboard", "Glass"],            date: "2026-01-01", status: "Approved"    },
  { id: "3", materials: ["Cardboard", "Glass", "Plastic"], date: "2026-01-02", status: "Cancelled" },
  { id: "4", materials: ["Cardboard", "Glass", "Plastic"], date: "2026-01-01", status: "Approved"    },
  { id: "5", materials: ["Cardboard", "Glass", "Plastic"], date: "2026-01-01", status: "Pending"     },
  { id: "6", materials: ["Cardboard", "Glass", "Plastic"], date: "2022-03-01", status: "Pending"     },
  { id: "7", materials: ["Cardboard", "Glass", "Plastic"], date: "2022-03-01", status: "Approved"    },
];

const STATUS_MAP: Record<Status, RecycleRecord["status"]> = {
  Approved:  "COMPLETED",
  Pending:   "PENDING",
  Cancelled: "CANCELLED",
};

function toRecord(item: ScheduleItem): RecycleRecord {
  return {
    id:                   item.id,
    location:             "123 Lane, Str. Downtown District",
    materials:            item.materials as RecycleRecord["materials"],
    date:                 item.date,
    status:               STATUS_MAP[item.status] as RecycleRecord["status"],
    referenceNumber:      `REF-2023-00${item.id}`,
    collectorName:        "Michael Johnson",
    collectorId:          "COL-789",
    requestDate:          item.date,
    scheduledPickupDate:  item.date,
    pickupLocation:       "123 Lane, Str. Downtown District",
  };
}

export function Schedule() {
  const router = useRouter();
  const [selectedRecord, setSelectedRecord] = useState<RecycleRecord | null>(null);

  const columns: ColumnDef<ScheduleItem>[] = [
    {
      key: "materials",
      header: "Material",
      cell: (row) => (
        <div className="flex flex-wrap gap-1.5">
          {row.materials.map((m) => (
            <MaterialTag key={m} material={m} size="sm" />
          ))}
        </div>
      ),
    },
    {
      key: "date",
      header: "Schedule Date",
      cell: (row) => (
        <span className="text-sm font-semibold text-foreground">
          {new Date(row.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }).replace(/(\d+) (\w+) (\d+)/, "$1, $2 $3")}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={STATUS_MAP[row.status]} />,
    },
    {
      key: "action",
      header: "Action",
      cell: (row) => (
        <button
          onClick={() => setSelectedRecord(toRecord(row))}
          className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={schedules}
        columns={columns}
        rowKey={(s) => s.id}
        title="Recent Schedule"
        headerRight={
          <button
            onClick={() => router.push(Routes.history)}
            className="text-sm text-primary font-medium hover:underline whitespace-nowrap"
          >
            View More &rsaquo;
          </button>
        }
        showTabs={false}
        showPagination={false}
        minHeight="0px"
      />

      <ScheduleDetailsModal
        open={!!selectedRecord}
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </>
  );
}

export default Schedule;
