import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useSchedule } from "@/components/scheduleView/ScheduleContext";
import { useGetAvailableSlots } from "@/api-hooks/usePickups";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function mondayStartIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

type Props = { onBack: () => void; onNext: () => void };

export default function Step2Time({ onBack, onNext }: Props) {
  const { scheduleData, updateScheduleData } = useSchedule();

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const restoredDate = useMemo(() => {
    if (!scheduleData.pickupDate) return null;
    const [y, m, d] = scheduleData.pickupDate.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    date.setHours(0, 0, 0, 0);
    return date;
  }, [scheduleData.pickupDate]);

  const [viewYear, setViewYear] = useState(restoredDate?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(restoredDate?.getMonth() ?? today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(restoredDate);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(scheduleData.slotId ?? null);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (monthRef.current && !monthRef.current.contains(t)) setIsMonthOpen(false);
      if (yearRef.current && !yearRef.current.contains(t)) setIsYearOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const years = useMemo(
    () => Array.from({ length: 15 }, (_, i) => today.getFullYear() + i),
    [today]
  );

  const { leadingBlanks, totalDays } = useMemo(() => ({
    leadingBlanks: mondayStartIndex(new Date(viewYear, viewMonth, 1)),
    totalDays: daysInMonth(viewYear, viewMonth),
  }), [viewYear, viewMonth]);

  const cells = useMemo(() => {
    const blanks = Array.from({ length: leadingBlanks }, () => ({ type: "blank" as const }));
    const days = Array.from({ length: totalDays }, (_, i) => ({ type: "day" as const, day: i + 1 }));
    return [...blanks, ...days];
  }, [leadingBlanks, totalDays]);

  // API: fetch available slots for current viewed month
  const { data: slotsResult, isLoading: slotsLoading } = useGetAvailableSlots(
    viewMonth + 1,
    viewYear
  );

  const slotsByDate: Record<string, { id: string; label: string }[]> =
    (slotsResult?.data as any) ?? {};

  const availableSlots = selectedDate
    ? slotsByDate[toDateKey(selectedDate)] ?? []
    : [];

  const hasSlots = (day: number) =>
    !!slotsByDate[toDateKey(new Date(viewYear, viewMonth, day))];

  const goPrevMonth = () => {
    setSelectedDate(null);
    setSelectedSlotId(null);
    setViewMonth((m) => {
      if (m === 0) { setViewYear((y) => y - 1); return 11; }
      return m - 1;
    });
  };

  const goNextMonth = () => {
    setSelectedDate(null);
    setSelectedSlotId(null);
    setViewMonth((m) => {
      if (m === 11) { setViewYear((y) => y + 1); return 0; }
      return m + 1;
    });
  };

  const selectDate = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    date.setHours(0, 0, 0, 0);
    if (date < today) return;
    setSelectedDate(date);
    setSelectedSlotId(null);
    updateScheduleData({ pickupDate: toDateKey(date), slotId: null, slotLabel: null });
  };

  const selectSlot = (slot: { id: string; label: string }) => {
    setSelectedSlotId(slot.id);
    updateScheduleData({ slotId: slot.id, slotLabel: slot.label });
  };

  const canProceed = !!selectedDate && !!selectedSlotId;

  const isDayPast = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    date.setHours(0, 0, 0, 0);
    return date <= today;
  };
  const isDaySelected = (day: number) =>
    selectedDate?.getFullYear() === viewYear &&
    selectedDate?.getMonth() === viewMonth &&
    selectedDate?.getDate() === day;

  return (
    <div className="rounded-xl border border-border bg-white p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            2
          </div>
          <h2 className="text-[15px] font-semibold text-foreground">
            Select Pickup Time
          </h2>
        </div>
        <span className="rounded-full border border-border px-4 py-1 text-xs font-medium text-muted-foreground">
          STEP 2 OF 3
        </span>
      </div>

      {/* Calendar + Slots */}
      <div className="mt-6 flex flex-col sm:flex-row gap-8 items-start">
        {/* Calendar */}
        <div className="w-full sm:w-108 shrink-0">
          {/* Month/Year nav */}
          <div className="flex items-center px-2 py-3">
            <button type="button" onClick={goPrevMonth} className="h-6 w-6 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15.375 18.75 8.625 12l6.75-6.75" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground" />
              </svg>
            </button>

            <div className="flex flex-1 justify-center items-center gap-4">
              {/* Month dropdown */}
              <div ref={monthRef} className="relative flex items-center gap-1">
                <span className="text-[14px] font-semibold text-foreground">{MONTHS[viewMonth]}</span>
                <button
                  type="button"
                  onClick={() => { setIsMonthOpen((v) => !v); setIsYearOpen(false); }}
                  className="h-6 w-6"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M16.5 9.75 12 14.25l-4.5-4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="text-foreground" />
                  </svg>
                </button>
                {isMonthOpen && (
                  <div className="absolute top-full left-0 z-20 mt-1 w-36 rounded-lg border border-border bg-white shadow-md max-h-48 overflow-auto">
                    {MONTHS.map((m, i) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          setViewMonth(i);
                          setIsMonthOpen(false);
                          setSelectedDate(null);
                          setSelectedSlotId(null);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-muted ${i === viewMonth ? "font-semibold text-primary" : "text-foreground"}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Year dropdown */}
              <div ref={yearRef} className="relative flex items-center gap-1">
                <span className="text-[14px] font-semibold text-foreground">{viewYear}</span>
                <button
                  type="button"
                  onClick={() => { setIsYearOpen((v) => !v); setIsMonthOpen(false); }}
                  className="h-6 w-6"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M16.5 9.75 12 14.25l-4.5-4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="text-foreground" />
                  </svg>
                </button>
                {isYearOpen && (
                  <div className="absolute top-full left-0 z-20 mt-1 w-24 rounded-lg border border-border bg-white shadow-md max-h-48 overflow-auto">
                    {years.map((y) => (
                      <button
                        key={y}
                        type="button"
                        onClick={() => {
                          setViewYear(y);
                          setIsYearOpen(false);
                          setSelectedDate(null);
                          setSelectedSlotId(null);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-muted ${y === viewYear ? "font-semibold text-primary" : "text-foreground"}`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button type="button" onClick={goNextMonth} className="h-6 w-6 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8.625 5.25 15.375 12l-6.75 6.75" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d, i) => (
              <div key={i} className="flex justify-center py-1">
                <span className="text-[12px] font-medium text-muted-foreground">{d}</span>
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((cell, i) => {
              if (cell.type === "blank") return <div key={i} />;
              const past = isDayPast(cell.day);
              const selected = isDaySelected(cell.day);
              const available = hasSlots(cell.day);
              return (
                <button
                  key={i}
                  type="button"
                  disabled={past || slotsLoading}
                  onClick={() => selectDate(cell.day)}
                  className={`mx-auto flex h-9 w-9 flex-col items-center justify-center rounded-full text-sm transition-colors
                    ${selected ? "bg-primary text-primary-foreground font-semibold" : ""}
                    ${!selected && available && !past ? "text-primary font-semibold hover:bg-background-green-100" : ""}
                    ${!selected && !available && !past ? "text-foreground hover:bg-muted" : ""}
                    ${past ? "text-border cursor-not-allowed" : ""}
                  `}
                >
                  {cell.day}
                  {available && !past && (
                    <span className={`h-1 w-1 rounded-full mt-0.5 ${selected ? "bg-primary-foreground" : "bg-primary"}`} />
                  )}
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-[11px] text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mr-1 align-middle" />
            Dates with available slots
          </p>
        </div>

        {/* Slots */}
        <div className="flex-1 w-full">
          {!selectedDate ? (
            <div className="flex h-full min-h-50 flex-col items-center justify-center text-center rounded-xl border border-dashed border-border p-6">
              <p className="text-sm font-medium text-foreground">No date selected</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Pick a date on the calendar to see available time slots
              </p>
            </div>
          ) : slotsLoading ? (
            <div className="animate-pulse flex flex-col gap-3 w-full">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-xl" />
              ))}
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="flex h-full min-h-50 flex-col items-center justify-center text-center rounded-xl border border-dashed border-border p-6">
              <p className="text-sm font-medium text-foreground">No slots available</p>
              <p className="mt-1 text-xs text-muted-foreground">Try selecting a different date</p>
            </div>
          ) : (
            <div>
              <p className="mb-3 text-xs font-semibold text-muted-foreground">
                AVAILABLE TIME SLOTS
              </p>
              <div className="space-y-3">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => selectSlot(slot)}
                    className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${selectedSlotId === slot.id
                        ? "border-primary bg-background-green-100"
                        : "border-border hover:border-muted-foreground"
                      }`}
                  >
                    <span className="text-sm font-medium text-foreground">{slot.label}</span>
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${selectedSlotId === slot.id ? "border-primary bg-primary" : "border-border"
                      }`}>
                      {selectedSlotId === slot.id && (
                        <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 border-t border-border pt-4 flex items-center justify-between">
        <Button
          type="button"
          size="lg"
          onClick={onBack}
          className="w-39.5 border border-primary bg-white text-primary hover:bg-muted"
        >
          ← Previous Step
        </Button>
        <Button
          type="button"
          size="lg"
          disabled={!canProceed}
          onClick={onNext}
          className="w-39.5"
        >
          Next Step →
        </Button>
      </div>
    </div>
  );
}