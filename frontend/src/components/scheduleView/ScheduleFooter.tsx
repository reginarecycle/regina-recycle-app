import type { ReactNode } from "react";
import { Layers, CalendarDays, Check, Lock } from "lucide-react";
import { useSchedule } from "./ScheduleContext";
import ThresholdProgress from "./progressBar";
import { Button } from "@/components/ui/button";
import GoldCoins from "@/assets/goldcoins.svg?react"

const THRESHOLD = 5.0;

// ── Sub-components ────────────────────────────────────────────────────────────

function Divider() {
  return <div className="hidden sm:block h-10 w-px shrink-0 bg-border" />;
}

function SummaryItem({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="shrink-0">
      <p className="text-[11px] font-semibold uppercase text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        {icon}
        <p className="text-[14px] font-semibold text-foreground">{children}</p>
      </div>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

type Props = {
  step: number;
  onConfirm: () => void;
};

export function ScheduleFooter({ step, onConfirm }: Props) {
  const { scheduleData } = useSchedule();

  const canConfirm =
    step === 3 &&
    scheduleData.estCost >= THRESHOLD &&
    scheduleData.address.trim() !== "";

  const confirmBtn = (
    <Button
      type="button"
      disabled={!canConfirm}
      onClick={onConfirm}
      className="shrink-0 h-13 min-w-40 sm:min-w-50 flex items-center gap-2 bg-primary text-primary-foreground text-[15px] font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
    >
      Confirm Pickup
      {canConfirm ? <Check className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
    </Button>
  );

  return (
    <div className="fixed bottom-0 right-0 left-0 sm:left-65 z-40 border-t border-border bg-white px-4 sm:px-6 py-4">
      {/* Mobile: compact — just cost + confirm button */}
      <div className="flex sm:hidden items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase text-muted-foreground">Est. Cost</p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <GoldCoins className="w-4 h-4 text-muted-foreground" />
            <p className="text-[15px] font-semibold text-accent-foreground">
              ${scheduleData.estCost.toFixed(2)}
            </p>
          </div>
        </div>
        {confirmBtn}
      </div>

      {/* Desktop: full summary */}
      <div className="hidden sm:flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-wrap flex-1 items-start gap-6 min-w-0 overflow-hidden">
          <SummaryItem label="Items" icon={<Layers className="w-5 h-5 text-primary" />}>
            {scheduleData.categories.length > 0
              ? `${scheduleData.totalSelected} units (${scheduleData.categories.length} categories)`
              : "0 categories"}
          </SummaryItem>

          <Divider />

          <SummaryItem label="Appointment" icon={<CalendarDays className="w-5 h-5 text-primary" />}>
            {scheduleData.pickupDate && scheduleData.slotLabel
              ? `${scheduleData.pickupDate}, ${scheduleData.slotLabel}`
              : "Not scheduled"}
          </SummaryItem>

          <Divider />

          <SummaryItem label="Est. Cost" icon={<GoldCoins className="w-5 h-5 text-amber-500" />}>
            <span className="text-accent-foreground">${scheduleData.estCost.toFixed(2)}</span>
          </SummaryItem>

          <Divider />

          <div className="min-w-45 flex-1 self-start">
            <ThresholdProgress current={scheduleData.estCost} target={THRESHOLD} />
          </div>
        </div>

        {confirmBtn}
      </div>
    </div>
  );
}
