import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Routes } from "@/routes/routes";
import type { CollectorPickup } from "@/api-hooks/useCollectors";

// ── Priority ────────────────────────────────────────────────────────────────
// CRITICAL  → overdue (past scheduled date/time)
// HIGH      → within the next 24 hours
// NORMAL    → 1–3 days away  (25 h → 72 h)
// LOW       → more than 3 days away

type PriorityType = "CRITICAL" | "HIGH" | "NORMAL" | "LOW";

function getPriority(scheduledAt: string): PriorityType {
  const hoursUntil = (new Date(scheduledAt).getTime() - Date.now()) / 3_600_000;
  if (hoursUntil <= 0)  return "CRITICAL";
  if (hoursUntil <= 24) return "HIGH";
  if (hoursUntil <= 72) return "NORMAL";
  return "LOW";
}

const PRIORITY_STYLES: Record<PriorityType, string> = {
  CRITICAL: "bg-[#FEE2E2] text-[#B91C1C]",
  HIGH:     "bg-[#F9EDB2] text-[#B45309]",
  NORMAL:   "bg-[#EEF2FF] text-[#1D4ED8]",
  LOW:      "bg-[#F3F4F6] text-[#6B7280]",
};

// ── Component ───────────────────────────────────────────────────────────────

type Props = {
  pickups?:   CollectorPickup[];
  isLoading?: boolean;
};

export function UrgentRequestsTable({ pickups, isLoading }: Props) {
  const navigate = useNavigate();

  return (
    <div className="mt-6 rounded-[16px] border border-[#E5E7EB] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-4 md:px-6">
        <div className="flex items-center gap-2">
          <span className="text-yellow-500">⚡</span>
          <p className="text-[14px] font-semibold text-[#111827]">URGENT REQUESTS</p>
        </div>
        <button
          onClick={() => navigate(`${Routes.requests}?tab=incoming`)}
          className="flex items-center gap-1 text-[14px] font-semibold text-[#344E41] hover:text-[#618171]"
        >
          View All
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 12L10 8L6 4" stroke="#344E41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Table header */}
      <div className="hidden md:grid grid-cols-[140px_1fr_150px_270px_120px] gap-2 px-6 py-3 text-[14px] text-[#999CA0]">
        <p>Date</p>
        <p>Request Details</p>
        <p>Priority</p>
        <p>Materials</p>
        <p className="flex justify-end pr-2">Action</p>
      </div>

      {isLoading ? (
        <div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-t px-6 py-4">
              <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
            </div>
          ))}
        </div>
      ) : !pickups?.length ? (
        <p className="px-6 py-8 text-center text-sm text-[#9CA3AF]">
          No pending requests right now.
        </p>
      ) : (
        pickups.map((pickup) => {
          const priority   = getPriority(pickup.scheduledAt);
          const totalUnits = pickup.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
          const materials  = (pickup.items ?? [])
            .map((i) => i.material?.name)
            .filter(Boolean) as string[];

          return (
            <div
              key={pickup.pickupId}
              className="border-t px-4 py-4 md:grid md:grid-cols-[140px_1fr_150px_270px_120px] md:items-center md:gap-2 md:px-6"
            >
              {/* Date */}
              <p className="mb-2 text-[12px] text-[#9CA3AF] md:mb-0 md:text-[14px] md:text-black">
                {formatDate(pickup.scheduledAt)}
              </p>

              {/* Request Details */}
              <div className="mb-3 md:mb-0">
                <p className="text-[14px] font-medium text-[#111827]">
                  {pickup.requester?.name ?? "Customer"}
                </p>
                <p className="text-[12px] text-[#9CA3AF]">
                  {pickup.address?.line1
                    ? `${pickup.address.line1}${pickup.address.city ? `, ${pickup.address.city}` : ""}`
                    : "Address unavailable"
                  }
                  {" • "}{totalUnits} unit{totalUnits !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Priority */}
              <div className="mb-3 md:mb-0 md:justify-self-start">
                <span
                  className={`inline-flex w-[85px] items-center justify-center rounded-full px-3 py-1 text-[12px] font-semibold ${PRIORITY_STYLES[priority]}`}
                >
                  {priority}
                </span>
              </div>

              {/* Materials — max 3, overflow badge */}
              <div className="mb-4 flex flex-wrap gap-2 md:mb-0">
                {(materials.length > 0 ? materials.slice(0, 3) : ["Mixed"]).map((m, i) => (
                  <span
                    key={i}
                    className="flex h-[30px] min-w-[72px] items-center justify-center rounded-full bg-[#618171] px-3 py-1 text-[13px] text-white"
                  >
                    {m}
                  </span>
                ))}
                {materials.length > 3 && (
                  <span className="flex h-[30px] items-center justify-center rounded-full bg-[#F3F4F6] px-3 text-[13px] text-[#6B7280]">
                    +{materials.length - 3}
                  </span>
                )}
              </div>

              {/* Action */}
              <div className="md:flex md:justify-end">
                <Button
                  size="sm"
                  onClick={() => navigate(`${Routes.requests}?tab=incoming&pickup=${pickup.pickupId}`)}
                  className="h-9 w-full rounded-xl border border-[#344E41] bg-white px-4 text-[14px] text-[#344E41] hover:bg-[#344E41]/5 md:h-6 md:w-auto"
                >
                  View
                </Button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
