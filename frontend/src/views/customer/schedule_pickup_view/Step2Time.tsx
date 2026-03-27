import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/Calender";
import { useSchedule } from "@/components/scheduleView/ScheduleContext";
import { useGetAvailableSlots } from "@/api-hooks/usePickups";

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

interface Slot { id: string; label: string }

function TimeSlotPicker({
  slots,
  selectedId,
  onSelect,
  isLoading,
  hasDate,
}: {
  slots: Slot[];
  selectedId: string | null;
  onSelect: (slot: Slot) => void;
  isLoading: boolean;
  hasDate: boolean;
}) {
  if (!hasDate) {
    return (
      <EmptyState
        title="No date selected"
        subtitle="Pick a date on the calendar to see available time slots"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="animate-pulse flex flex-col gap-3">
        {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <EmptyState
        title="No slots available"
        subtitle="Try selecting a different date"
      />
    );
  }

  return (
    <div>
      <p className="mb-3 text-xs font-semibold text-muted-foreground">AVAILABLE TIME SLOTS</p>
      <div className="space-y-3">
        {slots.map((slot) => {
          const active = selectedId === slot.id;
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => onSelect(slot)}
              className={`w-full flex items-center justify-between rounded-xl border px-4 py-4 transition-colors ${active ? "border-primary bg-background-green-100" : "border-border hover:border-muted-foreground"
                }`}
            >
              <span className="text-sm font-medium text-foreground">{slot.label}</span>
              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${active ? "border-primary bg-primary" : "border-border"}`}>
                {active && <div className="h-2 w-2 rounded-full bg-primary-foreground" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex min-h-50 h-full flex-col items-center justify-center text-center rounded-xl border border-dashed border-border p-6">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
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

  const [selectedDate, setSelectedDate] = useState<Date | null>(restoredDate);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(scheduleData.slotId ?? null);

  const viewMonth = selectedDate ? selectedDate.getMonth() + 1 : today.getMonth() + 1;
  const viewYear = selectedDate ? selectedDate.getFullYear() : today.getFullYear();

  const { data: slotsResult, isLoading: slotsLoading } = useGetAvailableSlots(viewMonth, viewYear);

  const slotsByDate: Record<string, Slot[]> = (slotsResult?.data as any) ?? {};

  const availableSlots = selectedDate ? slotsByDate[toDateKey(selectedDate)] ?? [] : [];

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlotId(null);
    updateScheduleData({ pickupDate: toDateKey(date), slotId: null, slotLabel: null });
  };

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlotId(slot.id);
    updateScheduleData({ slotId: slot.id, slotLabel: slot.label });
  };

  return (
    <div className="rounded-xl border border-border bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            2
          </div>
          <h2 className="text-[15px] font-semibold text-foreground">Select Pickup Time</h2>
        </div>
        <span className="rounded-full border border-border px-4 py-1 text-xs font-medium text-muted-foreground">
          STEP 2 OF 3
        </span>
      </div>

      <div className="mt-6 flex flex-col lg:grid lg:grid-cols-[500px_1fr] gap-6 items-start">
        <Calendar
          value={selectedDate}
          onChange={handleDateChange}
          isLoading={slotsLoading}
          isDisabled={(date) => {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            return d <= today;
          }}
          isAvailable={(date) => !!slotsByDate[toDateKey(date)]}
        />

        <TimeSlotPicker
          slots={availableSlots}
          selectedId={selectedSlotId}
          onSelect={handleSlotSelect}
          isLoading={slotsLoading && !!selectedDate}
          hasDate={!!selectedDate}
        />
      </div>

      <div className="mt-6 border-t border-border pt-4 flex items-center justify-between gap-3">
        <Button
          type="button"
          size="lg"
          onClick={onBack}
          className="flex-1 sm:flex-none sm:w-39.5 border border-primary bg-white text-primary hover:bg-muted"
        >
          ← Previous Step
        </Button>
        <Button
          type="button"
          size="lg"
          disabled={!selectedDate || !selectedSlotId}
          onClick={onNext}
          className="flex-1 sm:flex-none sm:w-39.5"
        >
          Next Step →
        </Button>
      </div>
    </div>
  );
}