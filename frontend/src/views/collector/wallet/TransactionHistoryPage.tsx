import * as React from "react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { Transaction, TransactionStatus, TransactionType } from "./types.tsx";
import { TransactionRow, TX_GRID } from "./TransactionRow.tsx";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

interface FilterState {
  types:     TransactionType[];
  statuses:  TransactionStatus[];
  dateRange: "today" | "7days" | "30days" | "alltime";
}

const DEFAULT_FILTERS: FilterState = { types: [], statuses: [], dateRange: "alltime" };

const TYPE_OPTIONS: { key: TransactionType; label: string; bg: string; activeBg: string; text: string }[] = [
  { key: "topup",      label: "Top-up",     bg: "bg-green-100",  activeBg: "bg-green-200",  text: "text-green-700"  },
  { key: "payout",     label: "Payout",     bg: "bg-yellow-100", activeBg: "bg-yellow-200", text: "text-yellow-700" },
  { key: "withdrawal", label: "Withdrawal", bg: "bg-blue-100",   activeBg: "bg-blue-200",   text: "text-blue-700"   },
];

const STATUS_OPTIONS: { key: TransactionStatus; label: string }[] = [
  { key: "COMPLETED", label: "Completed" },
  { key: "PENDING",   label: "Pending"   },
  { key: "FAILED",    label: "Failed"    },
];

const DATE_OPTIONS: { key: FilterState["dateRange"]; label: string }[] = [
  { key: "today",   label: "Today"        },
  { key: "7days",   label: "Last 7 Days"  },
  { key: "30days",  label: "Last 30 Days" },
  { key: "alltime", label: "All Time"     },
];

const FilterPanel: React.FC<{ filters: FilterState; onChange: (f: FilterState) => void }> = ({ filters, onChange }) => {
  const toggleType   = (t: TransactionType)   => onChange({ ...filters, types:    filters.types.includes(t)    ? filters.types.filter(x => x !== t)    : [...filters.types, t]    });
  const toggleStatus = (s: TransactionStatus) => onChange({ ...filters, statuses: filters.statuses.includes(s) ? filters.statuses.filter(x => x !== s) : [...filters.statuses, s] });

  return (
    <div className="bg-white border border-border rounded-2xl p-4 sm:p-5 w-72 sm:w-80 shadow-xl shadow-black/5">
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.12em] mb-3">Type</p>
      <div className="flex gap-2 flex-wrap mb-4">
        {TYPE_OPTIONS.map(({ key, label, bg, activeBg, text }) => {
          const active = filters.types.includes(key);
          return (
            <button key={key} onClick={() => toggleType(key)} className={cn("px-3 py-1.5 rounded-xl text-sm font-semibold transition-all", active ? `${activeBg} ${text}` : `${bg} ${text}`)}>
              {label}
            </button>
          );
        })}
      </div>
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.12em] mb-3">Status</p>
      <div className="flex gap-2 flex-wrap mb-4">
        {STATUS_OPTIONS.map(({ key, label }) => {
          const active = filters.statuses.includes(key);
          return (
            <button key={key} onClick={() => toggleStatus(key)} className={cn("px-4 py-2 rounded-xl text-sm font-semibold transition-all", active ? "bg-primary text-primary-foreground" : "bg-primary text-primary-foreground opacity-70 hover:opacity-100")}>
              {label}
            </button>
          );
        })}
      </div>
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.12em] mb-3">Date Range</p>
      <div className="flex gap-2 flex-wrap">
        {DATE_OPTIONS.map(({ key, label }) => {
          const active = filters.dateRange === key;
          return (
            <button key={key} onClick={() => onChange({ ...filters, dateRange: key })} className={cn("px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all", active ? "bg-primary text-primary-foreground border-primary" : "bg-white text-foreground border-border hover:border-primary/30")}>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

type TabStatus = "ALL" | TransactionStatus;

const TABS: { key: TabStatus; label: string }[] = [
  { key: "ALL",       label: "All"       },
  { key: "PENDING",   label: "Pending"   },
  { key: "COMPLETED", label: "Completed" },
  { key: "FAILED",    label: "Failed"    },
];

const PAGE_SIZE = 8;

function buildPageNumbers(totalPages: number, page: number): (number | "...")[] {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (page > 3) pages.push("...");
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
  if (page < totalPages - 2) pages.push("...");
  pages.push(totalPages);
  return pages;
}

interface TransactionHistoryPageProps {
  transactions: Transaction[];
  onBack: () => void;
}

export const TransactionHistoryPage: React.FC<TransactionHistoryPageProps> = ({ transactions, onBack }) => {
  const [search,     setSearch]     = useState("");
  const [tab,        setTab]        = useState<TabStatus>("ALL");
  const [filters,    setFilters]    = useState<FilterState>(DEFAULT_FILTERS);
  const [showFilter, setShowFilter] = useState(false);
  const [page,       setPage]       = useState(1);
  const filterRef                   = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setShowFilter(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    let r = [...transactions];
    if (tab !== "ALL")           r = r.filter(t => t.status === tab);
    if (search.trim())           r = r.filter(t => t.id.toLowerCase().includes(search.toLowerCase()) || t.name.toLowerCase().includes(search.toLowerCase()));
    if (filters.types.length)    r = r.filter(t => filters.types.includes(t.type));
    if (filters.statuses.length) r = r.filter(t => filters.statuses.includes(t.status));
    return r;
  }, [transactions, tab, search, filters]);

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageNumbers = useMemo(() => buildPageNumbers(totalPages, page), [totalPages, page]);
  const go          = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));
  const showFrom    = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showTo      = Math.min(page * PAGE_SIZE, filtered.length);

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto bg-background">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary mb-4 sm:mb-5 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      <div className="rounded-2xl bg-white border border-border overflow-visible">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Transaction History</h2>
          <div className="flex items-center gap-2">
            {/* Search — full width on mobile */}
            <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2 bg-white flex-1 sm:w-56 focus-within:border-primary transition-colors">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="text-sm bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground min-w-0"
              />
            </div>
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilter(v => !v)}
                className={cn("w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-colors", showFilter ? "border-primary bg-background-green-100 text-primary" : "border-border text-muted-foreground hover:border-primary/40")}
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

        {/* Tabs — scrollable on mobile */}
        <div className="flex border-b border-border px-4 sm:px-6">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setPage(1); }}
              className={cn("py-3 px-1 mr-5 sm:mr-7 text-sm border-b-2 -mb-px transition-colors whitespace-nowrap shrink-0", tab === key ? "border-primary text-primary font-semibold" : "border-transparent text-muted-foreground hover:text-foreground font-medium")}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Table header — desktop only */}
        <div className={`hidden sm:grid ${TX_GRID} px-6 py-4 border-b border-border`}>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Transaction</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</span>
        </div>

        {/* Rows */}
        <div className="px-4 sm:px-6 min-h-[300px]">
          {paginated.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">No transactions found</div>
          ) : (
            paginated.map(tx => <TransactionRow key={tx.id} tx={tx} />)
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-border">
          <span className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{showFrom} to {showTo}</span> of <span className="font-medium text-foreground">{filtered.length}</span>
          </span>

          <div className="flex items-stretch border border-border rounded-xl overflow-hidden divide-x divide-border">
            <button onClick={() => go(page - 1)} disabled={page === 1} className="flex items-center gap-1 px-3 h-9 text-sm font-medium text-foreground disabled:opacity-40 hover:bg-gray-50 bg-white">
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            {pageNumbers.map((p, i) =>
              p === "..." ? (
                <span key={`el-${i}`} className="w-9 h-9 flex items-center justify-center text-sm text-muted-foreground bg-white select-none">···</span>
              ) : (
                <button key={p} onClick={() => go(p as number)} className={cn("w-9 h-9 text-sm font-medium transition-colors", page === (p as number) ? "bg-primary text-primary-foreground" : "bg-white text-foreground hover:bg-gray-50")}>
                  {p}
                </button>
              )
            )}
            <button onClick={() => go(page + 1)} disabled={page === totalPages} className="flex items-center gap-1 px-3 h-9 text-sm font-medium text-foreground disabled:opacity-40 hover:bg-gray-50 bg-white">
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};