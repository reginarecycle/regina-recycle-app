import { useState } from "react";
import { X, TriangleAlert, CalendarDays, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const CANCEL_REASONS = [
  "Schedule conflict",
  "Not ready for pickup",
  "Weather conditions",
  "Changed my mind",
  "Other",
];

interface Props {
  isOpen:    boolean;
  onClose:   () => void;
  onConfirm: (reason: string) => void;
  isLoading: boolean;
  date?:     string;
  time?:     string;
  location?: string;
}

export function CancelPickupModal({ isOpen, onClose, onConfirm, isLoading, date = "", time = "", location = "" }: Props) {
  const [reason, setReason] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-full gap-0 overflow-hidden rounded-2xl border border-border p-0 [&>button]:hidden flex flex-col max-h-[85dvh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-foreground">Cancel Pickup</h2>
            <p className="text-sm text-muted-foreground mt-0.5">This action cannot be undone</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="h-px bg-border shrink-0" />

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

          {/* Pickup details */}
          <div className="flex flex-col gap-4">
            {[
              { icon: <CalendarDays className="h-5 w-5 text-muted-foreground" />, label: "Date",     value: date     || "—" },
              { icon: <Clock        className="h-5 w-5 text-muted-foreground" />, label: "Time",     value: time     || "—" },
              { icon: <MapPin       className="h-5 w-5 text-muted-foreground" />, label: "Location", value: location || "—" },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                  {icon}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                  <p className="text-base font-bold text-foreground">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Warning */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex gap-3">
            <TriangleAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 leading-relaxed">
              <span className="font-semibold">Important: </span>
              Frequent cancellations may affect your account standing. Please reschedule if you still need pickup service.
            </p>
          </div>

          {/* Reasons */}
          <div>
            <p className="text-sm font-bold text-foreground mb-3">Why are you canceling?</p>
            <div className="flex flex-col gap-2">
              {CANCEL_REASONS.map((r) => (
                <div
                  key={r}
                  onClick={() => setReason(r)}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                    reason === r ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground hover:border-muted-foreground/40"
                  }`}
                >
                  {r}
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${reason === r ? "border-primary" : "border-muted-foreground/40"}`}>
                    {reason === r && <span className="w-2 h-2 rounded-full bg-primary" />}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px bg-border shrink-0" />

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 shrink-0">
          <Button variant="outline" className="min-w-28 h-11 rounded-xl font-semibold" onClick={onClose}>
            Keep Pickup
          </Button>
          <Button
            variant="destructive"
            className="min-w-36 h-11 rounded-xl font-semibold"
            disabled={!reason || isLoading}
            loading={isLoading}
            onClick={() => reason && onConfirm(reason)}
          >
            Cancel Pickup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
