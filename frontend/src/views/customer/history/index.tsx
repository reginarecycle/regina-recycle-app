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
      headerClassName: "w-56",
      cell: (row) => (
        <span className="block max-w-45 truncate text-sm font-medium text-foreground">
          {row.location}
        </span>
      ),
    },
    {
      key: "material",
      header: "Material",
      className: "w-48",
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
      className: "w-40",
      cell: (row) => <span className="text-sm text-foreground">{row.date}</span>,
    },
    {
      key: "status",
      header: "Status",
      className: "w-40",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "action",
      header: "Action",
      className: "w-[120px]",
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

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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
    referenceNumber: pickup.pickupId,
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

interface RecycleHistoryProps {
  records?: RecycleRecord[];
}

export const RecycleHistory: React.FC<RecycleHistoryProps> = () => {
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

  // Request 1: normal single-status query for non-pending views
  const {
    data: mainPickupsResult,
    isLoading: mainPickupsLoading,
    error: mainPickupsError,
  } = useGetCustomerPickups({
    ...defaultQuery,
    status: isPendingView ? undefined : (selectedStatus as RecycleStatus | undefined),
  });

  // Request 2: explicit PENDING query for pending view
  const {
    data: pendingPickupsResult,
    isLoading: pendingPickupsLoading,
    error: pendingPickupsError,
  } = useGetCustomerPickups({
    ...defaultQuery,
    status: isPendingView ? ("PENDING" as RecycleStatus) : undefined,
  });

  // Request 3: explicit ACCEPTED query for pending view
  const {
    data: acceptedPickupsResult,
    isLoading: acceptedPickupsLoading,
    error: acceptedPickupsError,
  } = useGetCustomerPickups({
    ...defaultQuery,
    status: isPendingView ? ("ACCEPTED" as RecycleStatus) : undefined,
  });

  const {
    data: materialsResult,
    isLoading: materialsLoading,
  } = useGetMaterials({
    page: 1,
    limit: 100,
  });

  const materialNameById = useMemo(() => {
    const rawMaterials = materialsResult?.data?.data ?? [];
    return rawMaterials.reduce<Record<string, string>>((acc, material) => {
      acc[material.materialId] = material.name;
      return acc;
    }, {});
  }, [materialsResult]);

  const rawPickups = useMemo(() => {
    if (isPendingView) {
      const pending = pendingPickupsResult?.data?.data ?? [];
      const accepted = acceptedPickupsResult?.data?.data ?? [];

      const merged = [...pending, ...accepted];
      const seen = new Set<string>();

      return merged.filter((pickup: any) => {
        const id = pickup.pickupId;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });
    }

    return mainPickupsResult?.data?.data ?? [];
  }, [isPendingView, mainPickupsResult, pendingPickupsResult, acceptedPickupsResult]);

  const records = useMemo(() => {
    return rawPickups.map((pickup: any) => mapPickupToRecord(pickup, materialNameById));
  }, [rawPickups, materialNameById]);

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

  if (
    materialsLoading ||
    mainPickupsLoading ||
    (isPendingView && pendingPickupsLoading) ||
    (isPendingView && acceptedPickupsLoading)
  ) {
    return (
      <div className="flex-1 overflow-auto bg-background p-6 lg:p-8">
        Loading recycle history...
      </div>
    );
  }

  if (
    mainPickupsError ||
    pendingPickupsError ||
    acceptedPickupsError
  ) {
    return (
      <div className="flex-1 overflow-auto bg-background p-6 lg:p-8">
        Failed to load recycle history.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-background p-6 lg:p-8">
      <DataTable
        data={records}
        columns={columns}
        rowKey={(r) => r.id}
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
        minHeight="300px"
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