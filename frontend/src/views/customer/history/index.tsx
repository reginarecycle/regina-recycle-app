import * as React from "react";
import { useState, useMemo } from "react";
import { DataTable, type ColumnDef, type DataTableTabItem } from "@/components/ui/data-table";
import {
  DataTableHeaderControls,
  type TableFilterState,
  type StatusOption,
  DEFAULT_TABLE_FILTERS,
} from "@/components/ui/data-table-header-controls";
import { StatusBadge } from "@/components/ui/status-badge";
import type { RecycleRecord, HistoryTab, RecycleStatus } from "./types.tsx";
import { MaterialTag } from "@/components/ui/material-tag";
import { ScheduleDetailsModal } from "./ScheduleDetailsModal";
import { useGetCustomerPickups } from "@/api-hooks/usePickups";
import { useGetMaterials } from "@/api-hooks/useMaterials";
import { formatDate } from "@/lib/utils";

function makeRef(id: string): string {
  return `RRY-${parseInt(id.replace(/-/g, "").slice(0, 8), 16) % 900000 + 100000}`;
}

const PAGE_SIZE = 10;

const TABS: DataTableTabItem[] = [
  { href: "ALL", label: "All" },
  { href: "PENDING", label: "Pending" },
  { href: "COMPLETED", label: "Completed" },
  { href: "CANCELLED", label: "Cancelled" },
];

const STATUS_OPTIONS: StatusOption<RecycleStatus>[] = [
  { key: "COMPLETED", label: "Completed" },
  { key: "PENDING", label: "Pending" },
  { key: "CANCELLED", label: "Cancelled" },
];

function buildColumns(
  onViewMore: (record: RecycleRecord) => void
): ColumnDef<RecycleRecord>[] {
  return [
    {
      key: "location",
      header: "Location",
      cell: (row) => (
        <span className="block max-w-45 truncate text-sm font-medium text-foreground">
          {row.location}
        </span>
      ),
    },
    {
      key: "material",
      header: "Material",
      cell: (row) => (
        <div className="flex flex-wrap items-center gap-1.5">
          {row.materials.map((m) => (
            <MaterialTag key={m} material={m} size="sm" />
          ))}
        </div>
      ),
    },
    {
      key: "date",
      header: "Date",
      cell: (row) => <span className="text-sm text-foreground">{row.date}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "action",
      header: "Action",
      cell: (row) => (
        <button
          onClick={() => onViewMore(row)}
          className="whitespace-nowrap text-sm font-semibold text-foreground transition-colors hover:text-primary"
        >
          View More
        </button>
      ),
    },
  ];
}

function buildLocation(pickup: any) {
  if (pickup?.address?.line1) return pickup.address.line1;
  if (pickup?.address?.city) return pickup.address.city;
  return "Unknown location";
}

function buildMaterials(pickup: any, materialNameById: Record<string, string>) {
  if (!pickup?.items?.length) return [];

  return pickup.items.map((item: any) => {
    if (item?.material?.name) return item.material.name;
    if (item?.materialId && materialNameById[item.materialId]) {
      return materialNameById[item.materialId];
    }
    return "Unknown";
  });
}

function mapPickupToRecord(
  pickup: any,
  materialNameById: Record<string, string>
): RecycleRecord {
  const materials = buildMaterials(pickup, materialNameById);

  return {
    id: pickup.pickupId,
    referenceNumber: makeRef(pickup.pickupId),
    location: buildLocation(pickup),
    pickupLocation: buildLocation(pickup),
    materials,
    date: formatDate(pickup.createdAt ?? pickup.scheduledAt),
    scheduledPickupDate: formatDate(pickup.scheduledAt),
    status: (pickup.status === "ACCEPTED" ? "PENDING" : pickup.status) as RecycleStatus,
    requestDate: formatDate(pickup.createdAt),
    collectorId: pickup.collector?.userId,
    collectorName: pickup.collector?.name,
  };
}

export const RecycleHistory: React.FC = () => {
  const [tab, setTab] = useState<HistoryTab>("ALL");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<TableFilterState<RecycleStatus>>(
    DEFAULT_TABLE_FILTERS as TableFilterState<RecycleStatus>
  );
  const [page, setPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<RecycleRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const selectedStatus =
    filters.statuses[0] || (tab === "ALL" ? undefined : tab);

  const isPendingView = selectedStatus === "PENDING";

  const defaultQuery = {
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
  };

  const {
    data: mainPickupsResult,
    isLoading: mainPickupsLoading,
  } = useGetCustomerPickups(
    { ...defaultQuery, status: selectedStatus as RecycleStatus | undefined },
    !isPendingView
  );

  const {
    data: pendingPickupsResult,
    isLoading: pendingPickupsLoading,
  } = useGetCustomerPickups(
    { ...defaultQuery, status: "PENDING" as RecycleStatus },
    isPendingView
  );

  const {
    data: acceptedPickupsResult,
    isLoading: acceptedPickupsLoading,
  } = useGetCustomerPickups(
    { ...defaultQuery, status: "ACCEPTED" as RecycleStatus },
    isPendingView
  );

  const {
    data: materialsResult,
    isLoading: materialsLoading,
  } = useGetMaterials({ page: 1, limit: 100 });

  const materialNameById = useMemo(() => {
    const rawMaterials = materialsResult?.data?.data ?? [];
    return rawMaterials.reduce<Record<string, string>>((acc, m) => {
      acc[m.materialId] = m.name;
      return acc;
    }, {});
  }, [materialsResult]);

  const records = useMemo(() => {
    let rawPickups: any[];
    if (isPendingView) {
      const pending = pendingPickupsResult?.data?.data ?? [];
      const accepted = acceptedPickupsResult?.data?.data ?? [];
      const seen = new Set<string>();
      rawPickups = [...pending, ...accepted].filter((p: any) => {
        if (seen.has(p.pickupId)) return false;
        seen.add(p.pickupId);
        return true;
      });
    } else {
      rawPickups = mainPickupsResult?.data?.data ?? [];
    }
    return rawPickups.map((p: any) => mapPickupToRecord(p, materialNameById));
  }, [isPendingView, mainPickupsResult, pendingPickupsResult, acceptedPickupsResult, materialNameById]);

  const totalItems = isPendingView
    ? records.length
    : mainPickupsResult?.data?.total ?? records.length;

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  const handleTabChange = (t: string) => {
    setTab(t as HistoryTab);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleViewMore = (record: RecycleRecord) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const columns = useMemo(() => buildColumns(handleViewMore), []);

  const isLoading =
    materialsLoading ||
    mainPickupsLoading ||
    (isPendingView && (pendingPickupsLoading || acceptedPickupsLoading));

  return (
    <div className="h-full flex flex-col bg-background p-6 lg:p-8">
      <DataTable
        className="flex-1"
        data={records}
        columns={columns}
        rowKey={(r) => r.id}
        isLoading={isLoading}
        title="Recycle History"
        headerRight={
          <DataTableHeaderControls<RecycleStatus>
            search={search}
            onSearchChange={handleSearchChange}
            searchPlaceholder="Search"
            filters={filters}
            onFiltersChange={(f) => {
              setFilters(f);
              setPage(1);
            }}
            statusOptions={STATUS_OPTIONS}
          />
        }
        tabs={TABS}
        tabBarProps={{ mode: "none", value: tab, onChange: handleTabChange }}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        emptyText="No records found"
      />

      <ScheduleDetailsModal
        open={modalOpen}
        record={selectedRecord}
        onClose={() => {
          setModalOpen(false);
          setSelectedRecord(null);
        }}
      />
    </div>
  );
};

export default RecycleHistory;
































































