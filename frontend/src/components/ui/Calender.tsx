import { useState, useMemo, useEffect, useRef } from "react";

// ── Constants ──────────────────────────────────────────────────────────────────

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function mondayStartIndex(date: Date) {
  return (date.getDay() + 6) % 7;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ── Props ──────────────────────────────────────────────────────────────────────

export interface CalendarProps {
  /** Currently selected date */
  value: Date | null;
  /** Called when user clicks an enabled date */
  onChange: (date: Date) => void;
  /** Return true to mark a date as available (dot indicator) */
  isAvailable?: (date: Date) => boolean;
  /** Return true to disable a date entirely */
  isDisabled?: (date: Date) => boolean;
  /** Show skeleton shimmer on day cells while data loads */
  isLoading?: boolean;
}

// ── Dropdown ───────────────────────────────────────────────────────────────────

function Dropdown({
  label,
  isOpen,
  onToggle,
  children,
  dropdownRef,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={dropdownRef} className="relative flex items-center gap-1">
      <span className="text-[14px] font-semibold text-foreground">{label}</span>
      <button type="button" onClick={onToggle} className="h-6 w-6 flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M16.5 9.75 12 14.25l-4.5-4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="text-foreground" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 z-20 mt-1 w-36 rounded-lg border border-border bg-white shadow-md max-h-48 overflow-auto">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Calendar ───────────────────────────────────────────────────────────────────

export function Calendar({ value, onChange, isAvailable, isDisabled, isLoading }: CalendarProps) {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const [viewYear, setViewYear] = useState(value?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(value?.getMonth() ?? today.getMonth());
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  const years = useMemo(
    () => Array.from({ length: 15 }, (_, i) => today.getFullYear() + i),
    [today]
  );

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const t = e.target as Node;
      if (monthRef.current && !monthRef.current.contains(t)) setIsMonthOpen(false);
      if (yearRef.current && !yearRef.current.contains(t)) setIsYearOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const cells = useMemo(() => {
    const blanks = Array.from({ length: mondayStartIndex(new Date(viewYear, viewMonth, 1)) }, () => null);
    const days = Array.from({ length: daysInMonth(viewYear, viewMonth) }, (_, i) => i + 1);
    return [...blanks, ...days] as (number | null)[];
  }, [viewYear, viewMonth]);

  const goPrev = () => {
    setViewMonth((m) => {
      if (m === 0) { setViewYear((y) => y - 1); return 11; }
      return m - 1;
    });
  };

  const goNext = () => {
    setViewMonth((m) => {
      if (m === 11) { setViewYear((y) => y + 1); return 0; }
      return m + 1;
    });
  };

  const handleDayClick = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    date.setHours(0, 0, 0, 0);
    if (isDisabled?.(date)) return;
    onChange(date);
  };

  const isSelected = (day: number) =>
    value?.getFullYear() === viewYear &&
    value?.getMonth() === viewMonth &&
    value?.getDate() === day;

  const navBtn = "h-6 w-6 flex items-center justify-center rounded hover:bg-muted transition-colors";

  return (
    <div className="w-full">
      {/* Month / Year navigation */}
      <div className="flex items-center px-2 py-3">
        <button type="button" onClick={goPrev} className={navBtn}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15.375 18.75 8.625 12l6.75-6.75" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground" />
          </svg>
        </button>

        <div className="flex flex-1 justify-center items-center gap-4">
          <Dropdown
            dropdownRef={monthRef}
            label={MONTHS[viewMonth]}
            isOpen={isMonthOpen}
            onToggle={() => { setIsMonthOpen((v) => !v); setIsYearOpen(false); }}
          >
            {MONTHS.map((m, i) => (
              <button
                key={m}
                type="button"
                onClick={() => { setViewMonth(i); setIsMonthOpen(false); }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-muted ${i === viewMonth ? "font-semibold text-primary" : "text-foreground"}`}
              >
                {m}
              </button>
            ))}
          </Dropdown>

          <Dropdown
            dropdownRef={yearRef}
            label={String(viewYear)}
            isOpen={isYearOpen}
            onToggle={() => { setIsYearOpen((v) => !v); setIsMonthOpen(false); }}
          >
            {years.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => { setViewYear(y); setIsYearOpen(false); }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-muted ${y === viewYear ? "font-semibold text-primary" : "text-foreground"}`}
              >
                {y}
              </button>
            ))}
          </Dropdown>
        </div>

        <button type="button" onClick={goNext} className={navBtn}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M8.625 5.25 15.375 12l-6.75 6.75" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground" />
          </svg>
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d, i) => (
          <div key={i} className="flex justify-center py-1">
            <span className="text-[12px] font-medium text-muted-foreground">{d}</span>
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;

          const date = new Date(viewYear, viewMonth, day);
          date.setHours(0, 0, 0, 0);
          const disabled = isLoading || !!(isDisabled?.(date));
          const available = !disabled && !!(isAvailable?.(date));
          const selected = isSelected(day);

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => handleDayClick(day)}
              className={[
                "mx-auto flex h-8 w-8 sm:h-9 sm:w-9 flex-col items-center justify-center rounded-full text-xs sm:text-sm transition-colors",
                selected
                  ? "bg-primary text-primary-foreground font-semibold"
                  : available
                  ? "text-primary font-semibold hover:bg-background-green-100"
                  : disabled
                  ? "text-border cursor-not-allowed"
                  : "text-foreground hover:bg-muted",
              ].join(" ")}
            >
              {day}
              {available && (
                <span className={`h-1 w-1 rounded-full mt-0.5 ${selected ? "bg-primary-foreground" : "bg-primary"}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <p className="mt-3 text-[11px] text-muted-foreground flex items-center gap-1">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
        Dates with available slots
      </p>
    </div>
  );
}