import * as React from "react";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "./input";


export type DateRange = "today" | "7days" | "30days" | "alltime";

export interface TableFilterState<TStatus extends string = string> {
  statuses: TStatus[];
  dateRange: DateRange;
}

export const DEFAULT_TABLE_FILTERS: TableFilterState = {
  statuses: [],
  dateRange: "alltime",
};

export interface StatusOption<TStatus extends string = string> {
  key: TStatus;
  label: string;
}


const DATE_OPTIONS: { key: DateRange; label: string }[] = [
  { key: "today",   label: "Today"        },
  { key: "7days",   label: "Last 7 Days"  },
  { key: "30days",  label: "Last 30 Days" },
  { key: "alltime", label: "All Time"     },
];

interface FilterPanelProps<TStatus extends string> {
  filters: TableFilterState<TStatus>;
  onChange: (f: TableFilterState<TStatus>) => void;
  statusOptions: StatusOption<TStatus>[];
  showDateRange?: boolean;
}

function FilterPanel<TStatus extends string>({
  filters,
  onChange,
  statusOptions,
  showDateRange = true,
}: FilterPanelProps<TStatus>) {
  const toggleStatus = (s: TStatus) => {
    const isSelected = filters.statuses[0] === s;
    onChange({ ...filters, statuses: isSelected ? [] : [s] });
  };

  return (
    <div className="bg-white border border-border rounded-2xl p-5 w-72 shadow-xl shadow-black/5">
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.12em] mb-3">
        Status
      </p>
      <div className="flex flex-wrap gap-2 mb-5">
        {statusOptions.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => toggleStatus(key)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-semibold border transition-all",
              filters.statuses[0] === key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white text-foreground border-border hover:border-primary/30"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {showDateRange && (
        <>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.12em] mb-3">
            Date Range
          </p>
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
        </>
      )}
    </div>
  );
}


export interface DataTableHeaderControlsProps<TStatus extends string = string> {
  search: string;
  onSearchChange: (v: string) => void;
  searchPlaceholder?: string;
  filters: TableFilterState<TStatus>;
  onFiltersChange: (f: TableFilterState<TStatus>) => void;
  statusOptions: StatusOption<TStatus>[];
  showDateRange?: boolean;
  stretch?: boolean;
}

export function DataTableHeaderControls<TStatus extends string = string>({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  onFiltersChange,
  statusOptions,
  showDateRange = true,
  stretch = false,
}: DataTableHeaderControlsProps<TStatus>) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {/* Search */}
      <div className={cn("relative", stretch ? "flex-1" : "w-64")}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>


      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "w-9 h-9 rounded-xl border flex items-center justify-center transition-colors",
            open
              ? "border-primary bg-background-green-100 text-primary"
              : "border-border text-muted-foreground hover:border-primary/40"
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {open && (
          <div className="absolute right-0 top-11 z-50">
            <FilterPanel
              filters={filters}
              onChange={onFiltersChange}
              statusOptions={statusOptions}
              showDateRange={showDateRange}
            />
          </div>
        )}
      </div>
    </>
  );
}
