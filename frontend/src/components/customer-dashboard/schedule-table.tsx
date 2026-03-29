import { useState } from "react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { MaterialTag } from "@/components/ui/material-tag";
import { StatusBadge } from "@/components/ui/status-badge";
import { ScheduleDetailsModal } from "@/views/customer/history/ScheduleDetailsModal";
import type { RecycleRecord } from "@/views/customer/history/types.tsx";
import { useRouter } from "@/routes/hooks/use-router";
import { Routes } from "@/routes/routes";
import type { Pickup } from "@/api-hooks/usePickups";
import { formatDate } from "@/lib/utils";

function makeRef(id: string): string {
  return `RRY-${parseInt(id.replace(/-/g, "").slice(0, 8), 16) % 900000 + 100000}`;
}

type Props = {
  recentSchedule?: Pickup[];
};

export function Schedule({ recentSchedule = [] }: Props) {
  const router = useRouter();
  const [selectedRecord, setSelectedRecord] = useState<RecycleRecord | null>(null);

  function toRecord(pickup: Pickup): RecycleRecord {
    const location = pickup.address
      ? `${pickup.address.line1}, ${pickup.address.city}`
      : "N/A";
    return {
      id:                  pickup.pickupId,
      location,
      materials:           pickup.items?.map((i) => i.material?.name ?? "") as RecycleRecord["materials"],
      date:                formatDate(pickup.scheduledAt),
      status:              pickup.status as RecycleRecord["status"],
      referenceNumber:     makeRef(pickup.pickupId),
      collectorName:       pickup.collector?.name ?? "Not assigned yet",
      collectorId:         pickup.pickupId,
      requestDate:         formatDate(pickup.scheduledAt),
      scheduledPickupDate: formatDate(pickup.scheduledAt),
      pickupLocation:      location,
    };
  }

  const columns: ColumnDef<Pickup>[] = [
    {
      key: "materials",
      header: "Material",
      cell: (row) => {
        const all = row.items?.map((i) => i.material?.name).filter(Boolean) ?? [];
        const shown = all.slice(0, 3);
        const extra = all.length - shown.length;
        return (
          <div className="flex flex-wrap gap-1.5">
            {shown.map((name) => (
              <MaterialTag key={name} material={name as any} size="sm" />
            ))}
            {extra > 0 && (
              <span className="inline-flex items-center rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                +{extra} more
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "date",
      header: "Schedule Date",
      cell: (row) => (
        <span className="text-sm font-semibold text-foreground">
          {formatDate(row.scheduledAt)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status as any} />,
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
        data={recentSchedule}
        columns={columns}
        rowKey={(s) => s.pickupId}
        title="Recent Schedule"
        emptyText="No schedules found"
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
