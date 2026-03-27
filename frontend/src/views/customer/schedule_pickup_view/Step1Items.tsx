import { useState, useMemo, useEffect, useRef } from "react";
import BasketGif from "@/assets/basket.gif";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSchedule } from "@/components/scheduleView/ScheduleContext";
import { useGetMaterialsInfinite, useGetMaterialAveragePrice } from "@/api-hooks/useMaterials";
import { useQueries } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";
import type { MaterialAveragePrice } from "@/api-hooks/useMaterials";
import useDebounce from "@/hooks/useDebounce";
import { formatAmount } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useGetOne } from "@/lib/queryHelpers";
import { NoCollectorsModal } from "@/components/scheduleView/NoCollectorsModal";

type Item = {
  id: string;
  name: string;
  payoutInfo: string;
  estimatedPay: number;
};

function useCheckCollectors(materialIds: string[]) {
  const params = new URLSearchParams();
  materialIds.forEach((id) => params.append("materialIds", id));
  return useGetOne<{ available: boolean; unavailableMaterialIds: string[] }>(
    ["collectors", "check", materialIds],
    `/collectors/available-for-materials?${params.toString()}`,
    { enabled: materialIds.length > 0 }
  );
}

function formatCents(dollars: number): string {
  const cents = Math.round(dollars * 100);
  return cents < 100 ? `${cents}¢` : `$${formatAmount(dollars)}`;
}

function AveragePriceLabel({ materialId }: { materialId: string }) {
  const { data, isLoading } = useGetMaterialAveragePrice(materialId);

  if (isLoading) return <span className="text-[11px] text-muted-foreground">Loading price…</span>;

  const min = data?.data?.minPrice;
  const max = data?.data?.maxPrice;

  if (min == null || max == null || (min === 0 && max === 0)) {
    return <span className="text-[11px] text-muted-foreground">Price varies by collector</span>;
  }

  if (min === max) {
    return <span className="text-[11px] text-muted-foreground">{formatCents(min)}/unit</span>;
  }

  return (
    <span className="text-[11px] text-muted-foreground">
      {formatCents(min)} – {formatCents(max)}/unit
    </span>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function PhotoPreviewCard({
  file,
  onRemove,
  onReplace,
}: {
  file: File;
  onRemove: () => void;
  onReplace: (f: File) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const replaceRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-3 py-3">
      {preview ? (
        <img src={preview} alt={file.name} className="h-14 w-14 rounded-lg object-cover shrink-0" />
      ) : (
        <div className="h-14 w-14 rounded-lg bg-muted shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
        <p className="text-xs text-primary mt-0.5">{formatFileSize(file.size)}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <input
          ref={replaceRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onReplace(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => replaceRef.current?.click()}
          className="rounded-full border border-border px-3 py-1 text-sm text-foreground hover:bg-muted transition-colors"
        >
          Change
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
}

const ItemIcon = () => (
  <div className="h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-foreground">
    <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor">
      <path d="M1.333 12c-.366 0-.68-.13-.941-.391C.131 11.348 0 11.034 0 10.667V0l1.117 1.117L2.217 0 3.333 1.117 4.45 0 5.55 1.117 6.667 0l1.116 1.117L8.883 0 10 1.117l1.117-1.117 1.1 1.117L13.333 0v10.667c0 .366-.13.68-.391.941-.26.262-.574.393-.942.392H1.333Zm0-1.333H6V6.667H1.333v4ZM7.333 10.667H12V9.333H7.333v1.334Zm0-2.667H12V6.667H7.333V8ZM1.333 5.333H12V3.333H1.333v2Z" />
    </svg>
  </div>
);

function SkeletonItem() {
  return (
    <div className="w-full flex items-center justify-between rounded-lg border border-border px-4 py-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gray-200" />
        <div className="h-4 bg-gray-200 rounded w-32" />
      </div>
      <div className="h-7 w-7 rounded-full bg-gray-200" />
    </div>
  );
}

type Props = { onNext: () => void };

export default function Step1Items({ onNext }: Props) {
  const { scheduleData, updateScheduleData } = useSchedule();
  const itemPicked = scheduleData.itemPicked;

  const [search, setSearch] = useState("");
  const [showNoCollectors, setShowNoCollectors] = useState(false);
  const debouncedSearch = useDebounce(search, 400);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const MAX_QUANTITY = 500;

  const {
    data: materialsResult,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetMaterialsInfinite({ search: debouncedSearch || undefined, limit: 20 });

  const ITEMS: Item[] = useMemo(() => {
    const pages = materialsResult?.pages ?? [];
    return pages.flatMap((page) =>
      (page.data?.data ?? []).map((m) => ({
        id: m.materialId,
        name: m.name,
        payoutInfo: m.description ?? "",
        estimatedPay: 0,
      }))
    );
  }, [materialsResult]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const selectedIds = useMemo(() => Object.keys(itemPicked), [itemPicked]);

  const { data: collectorCheck } = useCheckCollectors(selectedIds);
  const hasCollectors = collectorCheck?.data?.available ?? true;

  const avgPriceResults = useQueries({
    queries: selectedIds.map((id) => ({
      queryKey: ["materials", "averagePrice", id],
      queryFn: () => apiFetch<MaterialAveragePrice>(`/collectors/materials/${id}/averagePrice`),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const avgPriceMap = useRef<Record<string, number>>({});
  const prevLoadedKey = useRef("");

  const loadedKey = selectedIds
    .map((id, i) => {
      const p = avgPriceResults[i]?.data?.data?.avgPrice;
      return p != null ? `${id}:${p}` : null;
    })
    .filter(Boolean)
    .sort()
    .join("|");

  if (loadedKey !== prevLoadedKey.current) {
    prevLoadedKey.current = loadedKey;
    const map: Record<string, number> = {};
    selectedIds.forEach((id, i) => {
      const p = avgPriceResults[i]?.data?.data?.avgPrice;
      if (p != null) map[id] = p;
    });
    avgPriceMap.current = map;
  }

  const selectedItems = useMemo(
    () => ITEMS.filter((item) => itemPicked[item.id] !== undefined),
    [itemPicked, ITEMS]
  );

  const isSelected = (id: string) => itemPicked[id] !== undefined;

  const syncContext = (newPicked: Record<string, number>) => {
    const total = Object.values(newPicked).reduce((a, b) => a + b, 0);
    const cost = Object.entries(newPicked).reduce(
      (sum, [id, qty]) => sum + qty * (avgPriceMap.current[id] ?? 0),
      0
    );
    updateScheduleData({
      itemPicked: newPicked,
      categories: ITEMS.filter((i) => newPicked[i.id] !== undefined).map((i) => i.name),
      totalSelected: total,
      estCost: cost,
    });
  };

  useEffect(() => {
    if (selectedIds.length === 0) return;
    const cost = Object.entries(itemPicked).reduce(
      (sum, [id, qty]) => sum + qty * (avgPriceMap.current[id] ?? 0),
      0
    );
    updateScheduleData({ estCost: cost });
  }, [loadedKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleItem = (id: string) => {
    const next = { ...itemPicked };
    if (next[id] !== undefined) delete next[id];
    else next[id] = 1;
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

  const handleNext = () => {
    if (!hasCollectors) {
      setShowNoCollectors(true);
      return;
    }
    onNext();
  };

  return (
    <>
      <div className="rounded-xl border border-border bg-white p-5 sm:p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
              1
            </div>
            <h2 className="text-[15px] font-semibold text-foreground">
              What are we collecting?
            </h2>
          </div>
          <span className="rounded-full border border-border px-4 py-1 text-xs font-medium text-muted-foreground">
            STEP 1 OF 3
          </span>
        </div>

        {/* Search */}
        <div className="mt-4">
          <Input
            placeholder="Search for items (e.g. bottle, Battery)"
            className="h-10 rounded-md border-border text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
          <div className="flex flex-col">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              AVAILABLE CATEGORIES
            </p>
            <div className="rounded-xl border border-border bg-white p-4 h-90 sm:h-100.75 flex flex-col">
              <div className="space-y-3 flex-1 overflow-auto pr-1">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => <SkeletonItem key={i} />)
                ) : ITEMS.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-muted-foreground">No materials found</p>
                  </div>
                ) : (
                  <>
                    {ITEMS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className={`w-full flex items-center justify-between rounded-lg border px-4 py-4 transition-colors ${isSelected(item.id)
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
                    <div ref={sentinelRef} className="h-2" />
                    {isFetchingNextPage && <SkeletonItem />}
                  </>
                )}
              </div>
            </div>
          </div>

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
                <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">
                  MATERIAL & PAYOUT INFO
                </p>
                <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">
                  QUANTITY
                </p>
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
                            <p className="text-[13px] font-semibold text-foreground truncate">
                              {item.name}
                            </p>
                            <AveragePriceLabel materialId={item.id} />
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min={1}
                              max={MAX_QUANTITY}
                              value={itemPicked[item.id] || ""}
                              onChange={(e) =>
                                setQuantity(item.id, e.target.value === "" ? 0 : Math.min(MAX_QUANTITY, Number(e.target.value)))
                              }
                              onBlur={(e) => {
                                const v = Number(e.target.value);
                                setQuantity(item.id, v > 0 ? Math.min(MAX_QUANTITY, v) : 1);
                              }}
                              className="h-9 w-14 rounded-md border border-border text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-foreground hover:bg-muted"
                            >
                              ×
                            </button>
                          </div>
                          {(itemPicked[item.id] ?? 0) >= MAX_QUANTITY && (
                            <p className="text-[10px] text-destructive font-medium">Max {MAX_QUANTITY} units</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 w-full">
          <p className="text-sm font-medium text-foreground">
            Upload a photo of your bags{" "}
            <span className="text-muted-foreground">(optional)</span>
          </p>

          {!scheduleData.photo ? (
            <label className="mt-3 flex h-30 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:bg-muted transition-colors">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) updateScheduleData({ photo: file });
                  e.target.value = "";
                }}
              />
              <svg className="mb-1 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Drag and drop or click to browse
            </label>
          ) : (
            <div className="mt-3">
              <PhotoPreviewCard
                file={scheduleData.photo}
                onRemove={() => updateScheduleData({ photo: null })}
                onReplace={(newFile) => updateScheduleData({ photo: newFile })}
              />
            </div>
          )}
        </div>

        <div className="mt-6 w-full">
          <p className="text-sm font-medium text-foreground">
            Additional notes{" "}
            <span className="text-muted-foreground">(optional)</span>
          </p>
          <Textarea
            rows={3}
            value={scheduleData.note}
            onChange={(e) => updateScheduleData({ note: e.target.value })}
            placeholder="e.g. Items are in the front porch, please ring the bell..."
            className="mt-3 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="mt-6 border-t border-border pt-4 flex justify-end">
          <Button
            type="button"
            size="lg"
            disabled={selectedItems.length === 0}
            onClick={handleNext}
            className="w-[158px]"
          >
            Next Step →
          </Button>
        </div>
      </div>

      <NoCollectorsModal
        open={showNoCollectors}
        onClose={() => setShowNoCollectors(false)}
      />
    </>
  );
}