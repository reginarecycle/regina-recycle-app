import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Routes } from "@/routes/routes";
import { X, Wallet, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn, formatAmount } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CollectionItem {
  material:      string;
  expectedUnits: number;
  unitPrice:     number;
  actualUnits:   number;
}

interface CompleteRequestModalProps {
  isOpen:         boolean;
  onClose:        () => void;
  onComplete?:    (items: CollectionItem[]) => void;
  isPending?:     boolean;
  requestId?:     string;
  customer?:      string;
  location?:      string;
  dateTime?:      string;
  compatibility?: string;
  balance?:       number;
  serviceFee?:    number;
  feeType?:       string;
  note?:          string;
  setNote?:       (v: string) => void;
  items?:         CollectionItem[];
  currentItems?:  CollectionItem[];
}

export function CompleteRequestModal({
  isOpen,
  onClose,
  onComplete,
  isPending     = false,
  requestId     = "",
  customer      = "",
  location      = "",
  dateTime      = "",
  compatibility = "100%",
  balance       = 0,
  serviceFee    = 0,
  feeType       = "PERCENTAGE",
  note          = "",
  setNote,
  items         = [],
  currentItems,
}: CompleteRequestModalProps) {
  const [editableItems, setEditableItems] = useState<CollectionItem[]>(items);

  useEffect(() => {
    if (isOpen) setEditableItems(items);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleUnitsChange(index: number, value: string) {
    const n = value === "" ? 0 : Math.max(0, Number(value));
    if (Number.isNaN(n)) return;
    setEditableItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, actualUnits: n } : item)),
    );
  }

  const estimatedPayout  = items.reduce((s, i) => s + i.expectedUnits * i.unitPrice, 0);
  const totalPayout      = editableItems.reduce((s, i) => s + i.actualUnits * i.unitPrice, 0);
  const serviceFeeAmount = feeType === "PERCENTAGE" ? totalPayout * (serviceFee / 100) : serviceFee;
  const netPayout        = Math.max(0, totalPayout - serviceFeeAmount);
  const canAfford        = balance >= totalPayout;
  const feeLabel         = feeType === "PERCENTAGE" ? `${serviceFee}%` : feeType.replace(/_/g, " ");


  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="w-[calc(100vw-2rem)] max-w-2xl p-0 gap-0 flex flex-col max-h-[90vh] sm:max-h-160 rounded-3xl"
        showCloseButton={false}
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <DialogHeader className="relative shrink-0 px-4 sm:px-6 py-4 sm:py-5 border-b">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 sm:right-5 sm:top-5 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-card text-muted-foreground hover:bg-border transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
          <DialogTitle className="text-base sm:text-lg font-semibold text-foreground">
            Complete Request
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Request ID: {requestId}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 space-y-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">

          {/* Request info */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl bg-card px-4 py-3 sm:px-5 sm:py-4">
            {[
              { label: "Customer",    value: customer },
              { label: "Location",    value: location },
              { label: "Date & Time", value: dateTime },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="mb-0.5 text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="text-xs sm:text-sm font-medium text-foreground leading-snug">{value}</p>
              </div>
            ))}
            <div>
              <p className="mb-0.5 text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground">Compatibility</p>
              <span className={cn(
                "inline-flex rounded-full px-2.5 py-0.5 text-[10px] sm:text-xs font-medium",
                compatibility === "100%"
                  ? "bg-light-green text-accent-foreground"
                  : "bg-destructive/10 text-destructive",
              )}>
                {compatibility}
              </span>
            </div>
          </div>

          {/* Collection items */}
          <div>
            <h3 className="mb-2.5 text-sm sm:text-base font-semibold text-foreground">Update Collection Details</h3>
            <div className="space-y-2">
              {editableItems.map((item, i) => (
                <div
                  key={`${item.material}-${i}`}
                  className="rounded-2xl bg-card px-4 py-3 sm:px-5 sm:py-4"
                >
                  {/* Material info */}
                  <div className="mb-2.5">
                    <p className="text-sm font-medium text-foreground">{item.material}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Expected: {item.expectedUnits} units · ${formatAmount(item.unitPrice)}/unit
                    </p>
                  </div>
                  {/* Actual units row */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm text-muted-foreground shrink-0">Actual units:</span>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Input
                        type="number"
                        min={0}
                        value={item.actualUnits}
                        onChange={(e) => handleUnitsChange(i, e.target.value)}
                        className="h-8 sm:h-9 w-16 sm:w-20 text-center"
                      />
                      <span className="w-16 sm:w-20 text-right text-sm font-semibold text-foreground tabular-nums">
                        ${formatAmount(item.actualUnits * item.unitPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Note (Optional)
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote?.(e.target.value)}
              placeholder="Add any additional notes about this collection....."
              className="min-h-16 sm:min-h-20 resize-none"
            />
          </div>

          {/* Financial summary */}
          <div className="space-y-2.5 border-t border-border pt-4">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Wallet size={16} className="text-blue-500 shrink-0" />
                <span className="text-sm font-medium text-foreground">Your Balance</span>
              </div>
              <span className="text-base sm:text-lg font-semibold text-blue-500 tabular-nums">${formatAmount(balance)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estimated Payout</span>
              <span className="text-sm text-muted-foreground tabular-nums">${formatAmount(estimatedPayout)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">New Total</span>
              <span className="text-sm font-semibold text-foreground tabular-nums">${formatAmount(totalPayout)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-sm font-medium text-foreground shrink-0">Service Fee</span>
                <span className="rounded-full border border-border bg-card px-2 py-0.5 text-[10px] sm:text-xs font-medium text-foreground shrink-0">
                  {feeLabel}
                </span>
              </div>
              <span className="text-sm font-semibold text-destructive tabular-nums shrink-0">
                -${formatAmount(serviceFeeAmount)}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-card px-4 py-3 sm:px-5 sm:py-4">
              <span className="text-sm font-medium text-foreground">Total Payout</span>
              <span className="text-lg sm:text-xl font-semibold text-green-600 tabular-nums">${formatAmount(netPayout)}</span>
            </div>

            <div className={cn(
              "flex items-start gap-3 rounded-2xl border px-4 py-3 sm:px-5 sm:py-4",
              canAfford ? "border-green-400 bg-light-green" : "border-destructive bg-destructive/10",
            )}>
              {canAfford
                ? <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-600" />
                : <AlertCircle  size={16} className="mt-0.5 shrink-0 text-destructive" />}
              <div className="min-w-0">
                <p className={cn("text-sm font-medium", canAfford ? "text-green-700" : "text-destructive")}>
                  {canAfford ? "Ready to Complete" : "Insufficient Balance"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                  {canAfford
                    ? "You have sufficient balance to complete this request. The payout will be deducted from your wallet."
                    : <>
                        Your balance is too low.{" "}
                        <Link
                          to={Routes.collectorwallet}
                          className="font-medium text-primary underline underline-offset-2"
                        >
                          Top up your wallet
                        </Link>
                        {" "}to continue.
                      </>}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col-reverse min-[420px]:grid min-[420px]:grid-cols-2 gap-3 border-t border-border px-4 sm:px-6 py-3 sm:py-4">
          <Button onClick={onClose} variant="destructiveoutline">
            Cancel
          </Button>
          <Button
            onClick={() => canAfford && !isPending && onComplete?.(editableItems)}
            disabled={!canAfford || isPending}
            loading={isPending}
          >
            Complete Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

