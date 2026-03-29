import warningIcon from "@/assets/material-symbols_warning-rounded.svg";
import locationPersonIcon from "@/assets/carbon_location-person-filled.svg";
import inventoryIcon from "@/assets/material-symbols_inventory-2-rounded.svg";
import cashIcon from "@/assets/mdi_cash-multiple.svg";
import trendingIcon from "@/assets/lucide_trending-up.svg";
import checkIcon from "@/assets/lucide_check.svg";
import graphIcon from "@/assets/mdi_graph-line-shimmer.svg";
import { formatAmount } from "@/lib/utils";
import type { CollectorStats } from "@/api-hooks/useCollectors";

type Props = {
  stats?:     CollectorStats;
  isLoading?: boolean;
};

function SkeletonCard() {
  return (
    <div className="flex min-h-[141px] w-full flex-col items-start gap-3 rounded-[8px] border border-[#E5E7EB] bg-white px-3 py-4 animate-pulse">
      <div className="h-4 w-32 bg-gray-200 rounded" />
      <div className="h-12 w-20 bg-gray-200 rounded" />
      <div className="h-4 w-40 bg-gray-200 rounded" />
    </div>
  );
}

export function CollectorStatCards({ stats, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {/* Pending Requests */}
      <div className="flex min-h-[141px] w-full flex-col items-start gap-3 rounded-[8px] border border-[#E5E7EB] bg-white px-3 py-4">
        <div className="flex w-full items-start justify-between">
          <p className="text-[14px] font-medium text-[#4B5563]">Pending Requests</p>
          <img src={warningIcon} className="h-6 w-6" alt="" />
        </div>
        <div className="flex items-center gap-3">
          <h2 className="text-[48px] font-bold leading-none text-[#111827]">{stats?.pendingRequests ?? 0}</h2>
          <span className="rounded-full border border-[#F59E0B] bg-[#FEF3C7]/50 px-[10px] py-[2px] text-[10px] font-medium text-[#F59E0B]">
            NEEDS ACTION
          </span>
        </div>
        <div className="flex items-center gap-1">
          <img src={trendingIcon} className="h-4 w-4" alt="" />
          <p className="text-[14px] text-[#6B7280]">Available to accept</p>
        </div>
      </div>

      {/* Accepted Requests */}
      <div className="flex min-h-[141px] w-full flex-col items-start gap-3 rounded-[8px] border border-[#E5E7EB] bg-white px-3 py-4">
        <div className="flex w-full items-start justify-between">
          <p className="text-[14px] font-medium text-[#4B5563]">Accepted Requests</p>
          <img src={locationPersonIcon} className="h-6 w-6" alt="" />
        </div>
        <div className="flex items-center gap-3">
          <h2 className="text-[48px] font-bold leading-none text-[#111827]">{stats?.acceptedRequests ?? 0}</h2>
          <span className="rounded-full border border-[#4ADE80] bg-[#DCFCE7] px-[10px] py-[2px] text-[10px] font-medium text-[#22C55E]">
            IN PROGRESS
          </span>
        </div>
        <div className="flex items-center gap-1">
          <img src={checkIcon} className="h-4 w-4" alt="" />
          <p className="text-[14px] text-[#6B7280]">Needs completion</p>
        </div>
      </div>

      {/* Total Items */}
      <div className="flex min-h-[141px] w-full flex-col items-start gap-3 rounded-[8px] border border-[#E5E7EB] bg-white px-3 py-4">
        <div className="flex w-full items-start justify-between">
          <p className="text-[14px] font-medium text-[#4B5563]">Total Items</p>
          <img src={inventoryIcon} className="h-6 w-6" alt="" />
        </div>
        <div className="flex items-end gap-2">
          <h2 className="text-[48px] font-bold leading-none text-[#111827]">
            {(stats?.totalItems ?? 0).toLocaleString()}
          </h2>
          <span className="mb-1.5 text-[12px] font-medium text-[#6B7280]">UNITS</span>
        </div>
        <div className="flex items-center gap-1">
          <img src={graphIcon} className="h-4 w-4" alt="" />
          <p className="text-[14px] text-[#6B7280]">Across all pickups</p>
        </div>
      </div>

      {/* Pending Amount */}
      <div className="flex min-h-[141px] w-full flex-col items-start gap-3 rounded-[8px] border border-[#E5E7EB] bg-white px-3 py-4">
        <div className="flex w-full items-start justify-between">
          <p className="text-[14px] font-medium text-[#4B5563]">Pending Amount</p>
          <img src={cashIcon} className="h-6 w-6" alt="" />
        </div>
        <div className="flex items-center gap-3">
          <h2 className="text-[48px] font-bold leading-none text-[#111827]">
            ${formatAmount(stats?.pendingAmount ?? 0)}
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <img src={cashIcon} className="h-4 w-4" alt="" />
          <p className="text-[14px] text-[#9CA3AF]">Estimated earnings</p>
        </div>
      </div>
    </div>
  );
}
