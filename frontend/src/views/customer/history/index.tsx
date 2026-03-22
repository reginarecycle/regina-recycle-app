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
import { SAMPLE_RECORDS, PAGE_SIZE } from "./constants.tsx";
import { MaterialTag } from "@/components/ui/material-tag";
import { ScheduleDetailsModal } from "./ScheduleDetailsModal";

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS: DataTableTabItem[] = [
  { href: "ALL",       label: "All"       },
  { href: "PENDING",   label: "Pending"   },
  { href: "COMPLETED", label: "Completed" },
  { href: "CANCELLED", label: "Cancelled" },
];

// ─── Filter options ────────────────────────────────────────────────────────────

const STATUS_OPTIONS: StatusOption<RecycleStatus>[] = [
  { key: "COMPLETED", label: "Completed" },
  { key: "PENDING",   label: "Pending"   },
  { key: "CANCELLED", label: "Cancelled" },
];

// ─── Column Definitions ───────────────────────────────────────────────────────

function buildColumns(
  onViewMore: (record: RecycleRecord) => void
): ColumnDef<RecycleRecord>[] {
  return [
    {
      key: "location",
      header: "Location",
      headerClassName: "w-56",
      cell: (row) => (
        <span className="text-sm font-medium text-foreground truncate block max-w-45">
          {row.location}
        </span>
      ),
    },
    {
      key: "material",
      header: "Material",
      className: "w-48",
      cell: (row) => (
        <div className="flex items-center gap-1.5 flex-wrap">
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
      cell: (row) => (
        <span className="text-sm text-foreground">{row.date}</span>
      ),
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
          className="text-sm font-semibold text-foreground hover:text-primary transition-colors whitespace-nowrap"
        >
          View More
        </button>
      ),
    },
  ];
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface RecycleHistoryProps {
  records?: RecycleRecord[];
}

export const RecycleHistory: React.FC<RecycleHistoryProps> = ({
  records = SAMPLE_RECORDS,
}) => {
  const [tab, setTab]         = useState<HistoryTab>("ALL");
  const [search, setSearch]   = useState("");
  const [filters, setFilters] = useState<TableFilterState<RecycleStatus>>(
    DEFAULT_TABLE_FILTERS as TableFilterState<RecycleStatus>
  );
  const [page, setPage]       = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<RecycleRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    let r = [...records];
    if (tab !== "ALL") r = r.filter((x) => x.status === tab);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(
        (x) => x.location.toLowerCase().includes(q) || x.id.toLowerCase().includes(q)
      );
    }
    if (filters.statuses.length) r = r.filter((x) => filters.statuses.includes(x.status));
    return r;
  }, [records, tab, search, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleTabChange    = (t: string) => { setTab(t as HistoryTab); setPage(1); };
  const handleSearchChange = (v: string) => { setSearch(v); setPage(1); };

  const handleViewMore = (record: RecycleRecord) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const columns = useMemo(() => buildColumns(handleViewMore), []);

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-auto bg-background">
      <DataTable
        data={paginated}
        columns={columns}
        rowKey={(r) => r.id}
        title="Recycle History"
        headerRight={
          <DataTableHeaderControls<RecycleStatus>
            search={search}
            onSearchChange={handleSearchChange}
            searchPlaceholder="Search for transaction id..."
            filters={filters}
            onFiltersChange={(f) => { setFilters(f); setPage(1); }}
            statusOptions={STATUS_OPTIONS}
          />
        }
        tabs={TABS}
        tabBarProps={{ mode: "none", value: tab, onChange: handleTabChange }}
        page={page}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        emptyText="No records found"
        minHeight="300px"
      />

      <ScheduleDetailsModal
        open={modalOpen}
        record={selectedRecord}
        onClose={() => { setModalOpen(false); setSelectedRecord(null); }}
      />
    </div>
  );
};

export default RecycleHistory;
