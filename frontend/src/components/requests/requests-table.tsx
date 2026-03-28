import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { DataTable, type ColumnDef, type DataTableTabItem } from "@/components/ui/data-table";
import {
  DataTableHeaderControls,
  type TableFilterState,
  type DateRange,
  DEFAULT_TABLE_FILTERS,
} from "@/components/ui/data-table-header-controls";
import { MaterialTag } from "@/components/ui/material-tag";
import { StatusBadge } from "@/components/ui/status-badge";
import { type RequestRow } from "@/components/requests/requests-data";
import { RequestDetailsModal } from "./request-details-modal";
import { RequestFeedbackModal } from "./request-feedback-modal";
import { CompleteRequestModal } from "./complete-request-modal";
import { RejectRequestModal } from "./reject-request-modal";
import { Button } from "../ui/button";
import {
  useGetCollectorPickupRequests,
  useAcceptPickup,
  useCompletePickup,
  useRejectPickup,
  type CollectorPickup,
} from "@/api-hooks/useCollectors";
import { useGetCollectorWallet } from "@/api-hooks/useWallet";
import { useCollectorPricingSettings } from "@/api-hooks/useCollectors";
import { toast } from "sonner";

const PAGE_SIZE = 10;
const TAB_PARAM  = "tab";
const PICKUP_PARAM = "pickup";

function formatRequestNumber(n: string | number | undefined, fallbackId: string): string {
  if (n != null) return `RRY-PKP-${String(n).padStart(6, "0")}`;
  return `RRY-PKP-${parseInt(fallbackId.replace(/-/g, "").slice(0, 8), 16) % 900000 + 100000}`;
}

type ActiveTab = "incoming" | "accepted" | "completed";
type CompatibilityFilter = "COMPATIBLE" | "INCOMPATIBLE";

const STATUS_MAP: Record<ActiveTab, "PENDING" | "ACCEPTED" | "COMPLETED"> = {
  incoming:  "PENDING",
  accepted:  "ACCEPTED",
  completed: "COMPLETED",
} as const;

const VALID_TABS: ActiveTab[] = ["incoming", "accepted", "completed"];

const COMPATIBILITY_OPTIONS = [
  { key: "COMPATIBLE"   as CompatibilityFilter, label: "Compatible"   },
  { key: "INCOMPATIBLE" as CompatibilityFilter, label: "Incompatible" },
];

function getDateBounds(range: DateRange, mode: "past" | "future"): { startDate?: string; endDate?: string } {
  const toIso = (d: Date) => d.toISOString().split("T")[0];
  const now = new Date();
  if (range === "today") return { startDate: toIso(now), endDate: toIso(now) };
  if (range === "7days") {
    const d = new Date(now);
    d.setDate(d.getDate() + (mode === "future" ? 7 : -7));
    return mode === "future"
      ? { startDate: toIso(now), endDate: toIso(d) }
      : { startDate: toIso(d),   endDate: toIso(now) };
  }
  if (range === "30days") {
    const d = new Date(now);
    d.setDate(d.getDate() + (mode === "future" ? 30 : -30));
    return mode === "future"
      ? { startDate: toIso(now), endDate: toIso(d) }
      : { startDate: toIso(d),   endDate: toIso(now) };
  }
  return {};
}

export default function RequestsTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab    = searchParams.get(TAB_PARAM);
  const activeTab: ActiveTab = VALID_TABS.includes(rawTab as ActiveTab)
    ? (rawTab as ActiveTab)
    : "incoming";

  const rawPickupId = searchParams.get(PICKUP_PARAM);

  const switchTab = (tab: ActiveTab) => {
    setSearchParams((prev) => { prev.set(TAB_PARAM, tab); prev.delete(PICKUP_PARAM); return prev; });
    setPage(1);
  };

  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<TableFilterState<CompatibilityFilter>>(
    DEFAULT_TABLE_FILTERS as TableFilterState<CompatibilityFilter>,
  );

  const prevTabRef = useRef(activeTab);
  useEffect(() => {
    if (prevTabRef.current !== activeTab) {
      prevTabRef.current = activeTab;
      setPage(1);
    }
  }, [activeTab]);

  const [selectedRequest, setSelectedRequest] = useState<RequestRow | null>(null);
  const [detailsOpen,   setDetailsOpen]   = useState(false);
  const [feedbackOpen,  setFeedbackOpen]  = useState(false);
  const [feedbackKey,   setFeedbackKey]   = useState<"accepted" | "completed">("accepted");
  const [completeOpen,  setCompleteOpen]  = useState(false);
  const [rejectOpen,    setRejectOpen]    = useState(false);
  const [completeNote,  setCompleteNote]  = useState("");
  const [insufficientFundsOpen, setInsufficientFundsOpen] = useState(false);
  const [tooEarlyOpen,          setTooEarlyOpen]          = useState(false);

  const dateMode     = activeTab === "completed" ? "past" : "future" as const;
  const dateBounds   = getDateBounds(filters.dateRange, dateMode);
  const compatFilter = filters.statuses[0] as CompatibilityFilter | undefined;

  const { data: pickupsResult, isLoading } = useGetCollectorPickupRequests(
    { status: STATUS_MAP[activeTab], search: search || undefined, page, limit: PAGE_SIZE, ...dateBounds },
  );

  const { data: walletResult }   = useGetCollectorWallet();
  const { data: settingsResult } = useCollectorPricingSettings();
  const serviceFee = Number(settingsResult?.data.settings?.serviceFee ?? 0);
  const feeType    = settingsResult?.data.settings?.feeType ?? "PERCENTAGE";

  const calcEarnings = (grossPayout: number) =>
    feeType === "PERCENTAGE" ? grossPayout * (serviceFee / 100) : serviceFee;

  const acceptMutation   = useAcceptPickup();
  const completeMutation = useCompletePickup();
  const rejectMutation   = useRejectPickup();

  const tableData = useMemo((): RequestRow[] => {
    const toRow = (p: CollectorPickup): RequestRow => {
      const scheduled    = new Date(p.scheduledAt);
      const useSnapshots = (activeTab === "accepted" || activeTab === "completed")
        && (p.snapshots ?? []).length > 0;

      const liveItems = (p.items ?? []).map((i) => ({
        materialId:   i.materialId,
        materialName: i.material?.name ?? "Unknown",
        quantity:     i.quantity,
        unitPrice:    Number(i.unitPrice ?? 0),
      }));

      const lineItems = useSnapshots
        ? (p.snapshots ?? []).map((s) => ({
            materialId:   s.materialId,
            materialName: s.material?.name ?? "Unknown",
            quantity:     s.quantity,
            unitPrice:    Number(s.priceUsed ?? 0),
          }))
        : liveItems;

      const snapshotTotal = lineItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
      const liveTotal     = liveItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
      const hasPriceShift = useSnapshots && Math.abs(snapshotTotal - liveTotal) > 0.001;

      const materials  = lineItems.map((i) => i.materialName).filter(Boolean);
      const totalUnits = lineItems.reduce((s, i) => s + i.quantity, 0);

      return {
        id:            p.pickupId,
        pickupId:      p.pickupId,
        scheduledAt:   p.scheduledAt,
        requestNumber: formatRequestNumber(p.requestNumber, p.pickupId),
        Username:  p.requester?.name ?? "Unknown",
        Location:  p.address
          ? [p.address.line1, p.address.city].filter(Boolean).join(", ")
          : "N/A",
        material1: materials[0],
        material2: materials[1],
        material3: materials[2],
        Date:      scheduled.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
        startTime: scheduled.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
        endTime:   new Date(scheduled.getTime() + 2 * 60 * 60 * 1000).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
        Compatibility:    p.isCompatible ? 100 : 0,
        status:           activeTab,
        estimatedCost:    Number(p.estimatedCost    ?? 0),
        estimatedEarning: Number(p.estimatedEarning ?? 0),
        actualEarning:    Number(p.actualEarning    ?? 0),
        estUnits:         totalUnits,
        items:            lineItems,
        currentItems:     hasPriceShift ? liveItems : undefined,
        note:             p.note,
      };
    };

    const rows = (pickupsResult?.data.data ?? []).map(toRow);
    if (!compatFilter) return rows;
    return rows.filter((r) =>
      compatFilter === "COMPATIBLE" ? r.Compatibility === 100 : r.Compatibility !== 100,
    );
  }, [pickupsResult, activeTab, compatFilter]);

  const totalPages    = pickupsResult?.data.meta.totalPages ?? 1;
  const totalItems    = pickupsResult?.data.meta.total      ?? 0;
  const walletBalance = walletResult?.data.balance ?? 0;

  const autoOpenedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!rawPickupId || isLoading) return;
    if (autoOpenedRef.current === rawPickupId) return;
    const row = tableData.find((r) => r.pickupId === rawPickupId);
    if (!row) return;
    autoOpenedRef.current = rawPickupId;
    setSelectedRequest(row);
    setDetailsOpen(true);
    setSearchParams((prev) => { prev.delete(PICKUP_PARAM); return prev; }, { replace: true });
  }, [rawPickupId, isLoading, tableData]);

  const tabs: DataTableTabItem[] = [
    {
      href:  "incoming",
      label: "Incoming Requests",
      badge: activeTab === "incoming"  ? totalItems : undefined,
    },
    {
      href:  "accepted",
      label: "Accepted",
      badge: activeTab === "accepted"  ? totalItems : undefined,
    },
    {
      href:  "completed",
      label: "Completed",
      badge: activeTab === "completed" ? totalItems : undefined,
    },
  ];

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = useMemo((): ColumnDef<RequestRow>[] => {
    const showMaterials = activeTab === "incoming";
    const payoutLabel   = "Est. Payout ($)";

    return [
      {
        key:    "location",
        header: "Location",
        cell:   (row) => (
          <span className="block max-w-48 truncate text-sm text-foreground">{row.Location}</span>
        ),
      },
      ...(showMaterials ? [{
        key:    "material",
        header: "Material",
        cell:   (row: RequestRow) => {
          const all   = row.items.map((i) => i.materialName).filter(Boolean);
          const shown = all.slice(0, 3);
          const extra = all.length - shown.length;
          return (
            <div className="flex flex-wrap gap-1.5">
              {shown.map((m) => <MaterialTag key={m} material={m} size="sm" />)}
              {extra > 0 && (
                <span className="inline-flex items-center rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  +{extra} more
                </span>
              )}
            </div>
          );
        },
      }] : []),
      {
        key:    "dateTime",
        header: "Date & Time",
        cell:   (row) => (
          <div className="flex flex-col text-sm text-foreground">
            <span>{row.Date}</span>
            <span className="text-muted-foreground">{row.startTime} – {row.endTime}</span>
          </div>
        ),
      },
      {
        key:    "compatibility",
        header: "Compatibility",
        cell:   (row) =>
          row.Compatibility === 100
            ? <StatusBadge status="COMPATIBLE" />
            : <StatusBadge status="INCOMPATIBLE" />,
      },
      {
        key:    "payment",
        header: payoutLabel,
        cell:   (row: RequestRow) => {
          const amount =
            activeTab === "completed" ? row.actualEarning :
            activeTab === "accepted"  ? row.estimatedEarning :
            row.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
          return (
            <span className="text-sm font-semibold text-foreground">
              ${amount.toFixed(2)}
            </span>
          );
        },
      },
      {
        key:    "action",
        header: "Action",
        cell:   (row: RequestRow) =>
          activeTab === "accepted" ? (
            <Button
              variant="outlineprimary"
              size="sm"
              onClick={() => {
                setSelectedRequest(row);
                setCompleteNote("");
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const pickupDay = new Date(row.scheduledAt);
                pickupDay.setHours(0, 0, 0, 0);
                if (pickupDay > today) {
                  setTooEarlyOpen(true);
                } else {
                  setCompleteOpen(true);
                }
              }}
            >
              Complete
            </Button>
          ) : (
            <button
              onClick={() => { setSelectedRequest(row); setDetailsOpen(true); }}
              className="whitespace-nowrap text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              View Details
            </button>
          ),
      },
    ];
  }, [activeTab]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleAcceptRequest = () => {
    if (!selectedRequest) return;
    if (selectedRequest.Compatibility !== 100) {
      const missing = selectedRequest.items
        .filter((i) => i.unitPrice === 0)
        .map((i) => i.materialName)
        .join(", ");
      toast.warning(`Set your base price for ${missing} before accepting this request.`, {
        duration: 6000,
      });
      return;
    }
    acceptMutation.mutate(selectedRequest.pickupId, {
      onSuccess: () => {
        toast.success("Request accepted successfully");
        setDetailsOpen(false);
        setFeedbackKey("accepted");
        setFeedbackOpen(true);
        switchTab("accepted");
      },
      onError: (err: any) => {
        const message: string = err?.message ?? "";
        if (message.toLowerCase().includes("insufficient wallet balance")) {
          setDetailsOpen(false);
          setInsufficientFundsOpen(true);
        } else {
          toast.error("Failed to accept request. Please try again.");
        }
      },
    });
  };

  const handleCompleteRequest = () => {
    if (!selectedRequest) return;
    completeMutation.mutate(selectedRequest.pickupId, {
      onSuccess: () => {
        toast.success("Request completed successfully");
        setCompleteOpen(false);
        setFeedbackKey("completed");
        setFeedbackOpen(true);
        switchTab("completed");
      },
      onError: (err: any) => {
        const message: string = err?.message ?? "";
        if (message.toLowerCase().includes("before the scheduled")) {
          setCompleteOpen(false);
          setTooEarlyOpen(true);
        } else {
          toast.error("Failed to complete request. Please try again.");
        }
      },
    });
  };

  const handleRejectRequest = (reason: string, comment?: string) => {
    if (!selectedRequest) return;
    rejectMutation.mutate({ pickupId: selectedRequest.pickupId, reason, comment }, {
      onSuccess: () => {
        toast.success("Request rejected");
        setRejectOpen(false);
        setSelectedRequest(null);
      },
      onError: () => toast.error("Failed to reject request. Please try again."),
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <DataTable
        data={tableData}
        columns={columns}
        rowKey={(r) => r.id}
        isLoading={isLoading}
        tabs={tabs}
        tabBarProps={{
          mode:     "none",
          value:    activeTab,
          onChange: (v) => switchTab(v as ActiveTab),
        }}
        subHeader={
          <DataTableHeaderControls<CompatibilityFilter>
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            searchPlaceholder="Search"
            filters={filters}
            onFiltersChange={(f) => { setFilters(f); setPage(1); }}
            statusOptions={COMPATIBILITY_OPTIONS}
            dateMode={dateMode}
          />
        }
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        emptyText="There are no incoming requests"
        minHeight="500px"
      />

      {selectedRequest && (
        <RequestDetailsModal
          isOpen={detailsOpen}
          request={selectedRequest}
          onClose={() => setDetailsOpen(false)}
          onAccept={handleAcceptRequest}
          isAccepting={acceptMutation.isPending}
          onReject={() => { setDetailsOpen(false); setRejectOpen(true); }}
          requestNum={selectedRequest.requestNumber!}
          earnings={calcEarnings(
            activeTab === "completed" ? selectedRequest.actualEarning :
            activeTab === "accepted"  ? selectedRequest.estimatedEarning :
            selectedRequest.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0)
          )}
          estUnits={selectedRequest.estUnits}
          compatibilityStr={selectedRequest.Compatibility === 100 ? "100% MATCH" : "INCOMPATIBLE"}
          username={selectedRequest.Username}
          sourceTab={activeTab}
        />
      )}

      {selectedRequest && (
        <>
          <CompleteRequestModal
            isOpen={completeOpen}
            onClose={() => setCompleteOpen(false)}
            onComplete={() => handleCompleteRequest()}
            isPending={completeMutation.isPending}
            requestId={selectedRequest.requestNumber!}
            customer={selectedRequest.Username}
            location={selectedRequest.Location}
            dateTime={`${selectedRequest.Date}, ${selectedRequest.startTime}`}
            compatibility={selectedRequest.Compatibility === 100 ? "100%" : "0%"}
            balance={walletBalance}
            serviceFee={serviceFee}
            feeType={feeType}
            note={completeNote}
            setNote={setCompleteNote}
            items={selectedRequest.items.map((i) => ({
              material:      i.materialName,
              expectedUnits: i.quantity,
              unitPrice:     i.unitPrice,
              actualUnits:   i.quantity,
            }))}
            currentItems={selectedRequest.currentItems?.map((i) => ({
              material:      i.materialName,
              expectedUnits: i.quantity,
              unitPrice:     i.unitPrice,
              actualUnits:   i.quantity,
            }))}
          />
        </>
      )}

      <RequestFeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        type="success"
        title={feedbackKey === "accepted" ? "Request Accepted!" : "Pickup Completed!"}
        description={
          feedbackKey === "accepted"
            ? "The pickup has been added to your active queue. Head to the Accepted tab to track it and mark it complete when done."
            : "The payout has been sent to the customer and deducted from your wallet. Check the Completed tab for a full record."
        }
      />

      <RejectRequestModal
        isOpen={rejectOpen}
        onClose={() => { setRejectOpen(false); }}
        onConfirm={(reason, comment) => handleRejectRequest(reason, comment)}
        isPending={rejectMutation.isPending}
      />

      <RequestFeedbackModal
        isOpen={insufficientFundsOpen}
        onClose={() => setInsufficientFundsOpen(false)}
        type="error"
        title="Insufficient Funds"
        description="Your wallet balance is too low to accept this pickup. Please top up your wallet and try again."
      />

      <RequestFeedbackModal
        isOpen={tooEarlyOpen}
        onClose={() => setTooEarlyOpen(false)}
        type="error"
        title="Too Early to Complete"
        description="You cannot complete this pickup before its scheduled time. Please wait until the pickup time has passed."
      />
    </>
  );
}


