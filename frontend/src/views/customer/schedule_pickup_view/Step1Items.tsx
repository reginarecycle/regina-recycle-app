import { useMemo } from "react";
import BasketGif from "@/assets/basket.gif";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSchedule } from "@/components/scheduleView/ScheduleContext";

// ── Data ─────────────────────────────────────────────────────────────────────

type Item = { id: string; name: string; payoutInfo: string; estimatedPay: number };

const ITEMS: Item[] = [
  { id: "gable",  name: "Gable-top/Cartons",      payoutInfo: "10¢–15¢ on cartons up to 999ml. 25¢–35¢ on cartons 1L and over.", estimatedPay: 0.25 },
  { id: "glass",  name: "Glass bottles",           payoutInfo: "10¢–12¢ for <1L. 25¢–30¢ for 1L and over.",                      estimatedPay: 0.30 },
  { id: "drink",  name: "Drink boxes",             payoutInfo: "10¢–20¢ per unit.",                                               estimatedPay: 0.20 },
  { id: "tins",   name: "Tins/Cans",               payoutInfo: "10¢–32¢ per unit.",                                               estimatedPay: 0.32 },
  { id: "refill", name: "Refillable beer bottles", payoutInfo: "10¢–15¢ per unit.",                                               estimatedPay: 0.15 },
];

// ── Icons ─────────────────────────────────────────────────────────────────────

const ItemIcon = () => (
  <div className="h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-foreground">
    <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor">
      <path d="M1.333 12c-.366 0-.68-.13-.941-.391C.131 11.348 0 11.034 0 10.667V0l1.117 1.117L2.217 0 3.333 1.117 4.45 0 5.55 1.117 6.667 0l1.116 1.117L8.883 0 10 1.117l1.117-1.117 1.1 1.117L13.333 0v10.667c0 .366-.13.68-.391.941-.26.262-.574.393-.942.392H1.333Zm0-1.333H6V6.667H1.333v4ZM7.333 10.667H12V9.333H7.333v1.334Zm0-2.667H12V6.667H7.333V8ZM1.333 5.333H12V3.333H1.333v2Z" />
    </svg>
  </div>
);

// ── Component ─────────────────────────────────────────────────────────────────

type Props = { onNext: () => void };

export default function Step1Items({ onNext }: Props) {
  const { scheduleData, updateScheduleData } = useSchedule();
  const itemPicked = scheduleData.itemPicked;

  const selectedItems = useMemo(
    () => ITEMS.filter((item) => itemPicked[item.id] !== undefined),
    [itemPicked]
  );

  const isSelected = (id: string) => itemPicked[id] !== undefined;

  const syncContext = (newPicked: Record<string, number>) => {
    const total = Object.values(newPicked).reduce((a, b) => a + b, 0);
    const cost = ITEMS.reduce((sum, item) => sum + (newPicked[item.id] || 0) * item.estimatedPay, 0);
    updateScheduleData({
      itemPicked: newPicked,
      categories: ITEMS.filter((i) => newPicked[i.id] !== undefined).map((i) => i.name),
      totalSelected: total,
      estCost: cost,
    });
  };

  const toggleItem = (id: string) => {
    const next = { ...itemPicked };
    if (next[id] !== undefined) {
      delete next[id];
    } else {
      next[id] = 1;
    }
    syncContext(next);
  };

  const removeItem = (id: string) => {
    const next = { ...itemPicked };
    delete next[id];
    syncContext(next);
  };

  const setQuantity = (id: string, value: number) => {
    syncContext({ ...itemPicked, [id]: value });
  };

  return (
    <div className="rounded-xl border border-border bg-white p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            1
          </div>
          <h2 className="text-[15px] font-semibold text-foreground">What are we collecting?</h2>
        </div>
        <span className="rounded-full border border-border px-4 py-1 text-xs font-medium text-muted-foreground">
          STEP 1 OF 3
        </span>
      </div>

      {/* Search */}
      <div className="mt-4">
        <Input placeholder="Search for items (e.g. bottle, Battery)" className="h-10 rounded-md border-border text-sm" />
      </div>

      {/* 2-column grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
        {/* Left — available categories */}
        <div className="flex flex-col">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">AVAILABLE CATEGORIES</p>
          <div className="rounded-xl border border-border bg-white p-4 h-90 sm:h-100.75 flex flex-col">
            <div className="space-y-3 flex-1 overflow-auto pr-1">
              {ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className={`w-full flex items-center justify-between rounded-lg border px-4 py-4 transition-colors ${
                    isSelected(item.id)
                      ? "border-primary bg-background-green-100"
                      : "border-border bg-white hover:border-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ItemIcon />
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                  {isSelected(item.id) ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      ✓
                    </div>
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground">
                      +
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — selected categories */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">
              CATEGORIES SELECTED FOR COLLECTION
            </p>
            <p className="text-[11px] text-muted-foreground">
              Total: {scheduleData.totalSelected} units
            </p>
          </div>

          <div className="rounded-xl border border-border bg-white h-90 sm:h-100.75 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between bg-muted px-4 py-3">
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">MATERIAL & PAYOUT INFO</p>
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">QUANTITY</p>
            </div>

            <div className="px-4 py-4 flex-1 overflow-auto">
              {selectedItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-1">
                    <img src={BasketGif} alt="" className="w-16 h-16 object-contain mt-4" />
                  </div>
                  <p className="text-sm font-medium text-foreground">No item selected yet</p>
                  <p className="mt-1 text-xs text-muted-foreground max-w-65">
                    Click on the available categories to start building your pickup
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <ItemIcon />
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-foreground truncate">{item.name}</p>
                          <p className="text-[11px] text-muted-foreground">{item.payoutInfo}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="number"
                          min={1}
                          value={itemPicked[item.id] || ""}
                          onChange={(e) => setQuantity(item.id, e.target.value === "" ? 0 : Number(e.target.value))}
                          onBlur={(e) => {
                            const v = Number(e.target.value);
                            setQuantity(item.id, v > 0 ? v : 1);
                          }}
                          className="h-9 w-14 rounded-md border border-border text-center text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-foreground hover:bg-muted"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload */}
      <div className="mt-6 w-full">
        <p className="text-sm font-medium text-foreground">
          Upload photos of your bags <span className="text-muted-foreground">(optional)</span>
        </p>
        <label className="mt-3 flex h-[120px] w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:bg-muted transition-colors">
          <input type="file" accept="image/*" multiple className="hidden" />
          Drag and drop or click to browse images
        </label>
      </div>

      {/* Additional note */}
      <div className="mt-6 w-full">
        <p className="text-sm font-medium text-foreground">
          Additional notes <span className="text-muted-foreground">(optional)</span>
        </p>
        <textarea
          rows={3}
          placeholder="e.g. Items are in the front porch, please ring the bell..."
          className="mt-3 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Next */}
      <div className="mt-6 border-t border-border pt-4 flex justify-end">
        <Button
          type="button"
          size="lg"
          disabled={selectedItems.length === 0}
          onClick={onNext}
          className="w-[158px]"
        >
          Next Step →
        </Button>
      </div>
    </div>
  );
}
