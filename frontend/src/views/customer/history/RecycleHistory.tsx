import * as React from "react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal } from "lucide-react";
import type { RecycleRecord, HistoryTab, RecycleStatus } from "./types.tsx";
import { SAMPLE_RECORDS, PAGE_SIZE } from "./constants.tsx";
import { HistoryRow, HISTORY_GRID } from "./HistoryRow";
import { HistoryPagination } from "./HistoryPagination";
import { ScheduleDetailsModal } from "./ScheduleDetailsModal";

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS: { key: HistoryTab; label: string }[] = [
  { key: "ALL",       label: "All"       },
  { key: "PENDING",   label: "Pending"   },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
];

// ─── Filter Panel ─────────────────────────────────────────────────────────────

const STATUS_FILTER_OPTIONS: { key: RecycleStatus; label: string }[] = [
  { key: "COMPLETED", label: "Completed" },
  { key: "PENDING",   label: "Pending"   },
  { key: "CANCELLED", label: "Cancelled" },
];

interface FilterState {
  statuses: RecycleStatus[];
  dateRange: "today" | "7days" | "30days" | "alltime";
}

const DEFAULT_FILTERS: FilterState = { statuses: [], dateRange: "alltime" };

const DATE_OPTIONS: { key: FilterState["dateRange"]; label: string }[] = [
  { key: "today",   label: "Today"        },
  { key: "7days",   label: "Last 7 Days"  },
  { key: "30days",  label: "Last 30 Days" },
  { key: "alltime", label: "All Time"     },
];

interface FilterPanelProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onChange }) => {
  const toggleStatus = (s: RecycleStatus) => {
    const has = filters.statuses.includes(s);
    onChange({ ...filters, statuses: has ? filters.statuses.filter(x => x !== s) : [...filters.statuses, s] });
  };

  return (
    <div className="bg-white border border-border rounded-2xl p-5 w-72 shadow-xl shadow-black/5">
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.12em] mb-3">Status</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {STATUS_FILTER_OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => toggleStatus(key)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
              filters.statuses.includes(key)
                ? "bg-primary text-primary-foreground"
                : "bg-primary text-primary-foreground opacity-60 hover:opacity-100"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.12em] mb-3">Date Range</p>
      <div className="flex flex-wrap gap-2">
        {DATE_OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onChange({ ...filters, dateRange: key })}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-semibold border transition-all",
              filters.dateRange === key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white text-foreground border-border hover:border-primary/30"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

interface RecycleHistoryProps {
  records?: RecycleRecord[];
}

export const RecycleHistory: React.FC<RecycleHistoryProps> = ({
  records = SAMPLE_RECORDS,
}) => {
  const [tab, setTab]               = useState<HistoryTab>("ALL");
  const [search, setSearch]         = useState("");
  const [filters, setFilters]       = useState<FilterState>(DEFAULT_FILTERS);
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage]             = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<RecycleRecord | null>(null);
  const [modalOpen, setModalOpen]   = useState(false);

  const filterRef = React.useRef<HTMLDivElement>(null);

  // Close filter on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setShowFilter(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    let r = [...records];

    // Tab
    if (tab !== "ALL") r = r.filter(x => x.status === tab);

    // Search (location or id)
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(x => x.location.toLowerCase().includes(q) || x.id.toLowerCase().includes(q));
    }

    // Status filter panel
    if (filters.statuses.length) r = r.filter(x => filters.statuses.includes(x.status));

    return r;
  }, [records, tab, search, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleTabChange   = (t: HistoryTab) => { setTab(t); setPage(1); };
  const handleSearchChange = (v: string)    => { setSearch(v); setPage(1); };

  const handleViewMore = (record: RecycleRecord) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-auto bg-background">
      <div className="rounded-2xl bg-white border border-border overflow-visible shadow-sm">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Recycle History</h2>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2 bg-white w-64 focus-within:border-primary transition-colors">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search for transaction id..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="text-sm bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            {/* Filter */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilter(v => !v)}
                className={cn(
                  "w-9 h-9 rounded-xl border flex items-center justify-center transition-colors",
                  showFilter
                    ? "border-primary bg-background-green-100 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40"
                )}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
              {showFilter && (
                <div className="absolute right-0 top-11 z-50">
                  <FilterPanel filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-6">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={cn(
                "py-3 px-1 mr-7 text-sm border-b-2 -mb-px transition-colors",
                tab === key
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground font-medium"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Table header */}
        <div className={`grid ${HISTORY_GRID} px-6 py-3.5 border-b border-border`}>
          <span className="text-xs font-medium text-muted-foreground">Location</span>
          <span className="text-xs font-medium text-muted-foreground">Material</span>
          <span className="text-xs font-medium text-muted-foreground">Date</span>
          <span className="text-xs font-medium text-muted-foreground">Status</span>
          <span className="text-xs font-medium text-muted-foreground">Action</span>
        </div>

        {/* Rows */}
        <div className="min-h-[300px]">
          {paginated.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
              No records found
            </div>
          ) : (
            paginated.map(record => (
              <HistoryRow key={record.id} record={record} onViewMore={handleViewMore} />
            ))
          )}
        </div>

        {/* Pagination */}
        <HistoryPagination
          page={page}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />

      </div>

      {/* Detail Modal */}
      <ScheduleDetailsModal
        open={modalOpen}
        record={selectedRecord}
        onClose={() => { setModalOpen(false); setSelectedRecord(null); }}
      />
    </div>
  );
};

export default RecycleHistory;