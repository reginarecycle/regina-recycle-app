import * as React from "react";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "./input";
import useDebounce from "@/hooks/useDebounce";

export type DateRange  = "today" | "7days" | "30days" | "alltime";
export type DateMode   = "past" | "future";

export interface TableFilterState<TStatus extends string = string> {
  statuses:  TStatus[];
  dateRange: DateRange;
}

export const DEFAULT_TABLE_FILTERS: TableFilterState = {
  statuses:  [],
  dateRange: "alltime",
};

export interface StatusOption<TStatus extends string = string> {
  key:   TStatus;
  label: string;
}

const DATE_OPTIONS_PAST: { key: DateRange; label: string }[] = [
  { key: "today",   label: "Today"         },
  { key: "7days",   label: "Last 7 Days"   },
  { key: "30days",  label: "Last 30 Days"  },
  { key: "alltime", label: "All Time"      },
];

const DATE_OPTIONS_FUTURE: { key: DateRange; label: string }[] = [
  { key: "today",   label: "Today"         },
  { key: "7days",   label: "Next 7 Days"   },
  { key: "30days",  label: "Next 30 Days"  },
  { key: "alltime", label: "All Upcoming"  },
];

// ── Filter panel (layout unchanged) ──────────────────────────────────────────

interface FilterPanelProps<TStatus extends string> {
  filters:       TableFilterState<TStatus>;
  onChange:      (f: TableFilterState<TStatus>) => void;
  statusOptions: StatusOption<TStatus>[];
  showDateRange?: boolean;
  dateMode?:     DateMode;
}

function FilterPanel<TStatus extends string>({
  filters,
  onChange,
  statusOptions,
  showDateRange = true,
  dateMode      = "past",
}: FilterPanelProps<TStatus>) {
  const toggleStatus = (s: TStatus) => {
    const isSelected = filters.statuses[0] === s;
    onChange({ ...filters, statuses: isSelected ? [] : [s] });
  };

  const dateOptions = dateMode === "future" ? DATE_OPTIONS_FUTURE : DATE_OPTIONS_PAST;

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
                : "bg-white text-foreground border-border hover:border-primary/30",
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
            {dateOptions.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => onChange({ ...filters, dateRange: key })}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-semibold border transition-all",
                  filters.dateRange === key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white text-foreground border-border hover:border-primary/30",
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

// ── Public component ──────────────────────────────────────────────────────────

export interface DataTableHeaderControlsProps<TStatus extends string = string> {
  search:           string;
  onSearchChange:   (v: string) => void;
  searchPlaceholder?: string;
  filters:          TableFilterState<TStatus>;
  onFiltersChange:  (f: TableFilterState<TStatus>) => void;
  statusOptions:    StatusOption<TStatus>[];
  showDateRange?:   boolean;
  stretch?:         boolean;
  dateMode?:        DateMode;
}

export function DataTableHeaderControls<TStatus extends string = string>({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  onFiltersChange,
  statusOptions,
  showDateRange = true,
  stretch       = false,
  dateMode      = "past",
}: DataTableHeaderControlsProps<TStatus>) {
  const [open, setOpen] = React.useState(false);
  const ref             = React.useRef<HTMLDivElement>(null);

  // Local input state so the field stays snappy; debounced value propagates up
  const [localSearch, setLocalSearch] = React.useState(search);
  const debouncedSearch               = useDebounce(localSearch, 350);

  // Sync debounced value to parent
  React.useEffect(() => {
    if (debouncedSearch !== search) onSearchChange(debouncedSearch);
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep local state in sync if parent resets search externally
  React.useEffect(() => {
    if (search === "") setLocalSearch("");
  }, [search]);

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
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
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
              : "border-border text-muted-foreground hover:border-primary/40",
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
              dateMode={dateMode}
            />
          </div>
        )}
      </div>
    </>
  );
}
