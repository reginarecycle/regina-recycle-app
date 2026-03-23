import * as React from "react";

const PayoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 3L13 13M13 13V6M13 13H6" stroke="#CA8A04" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NetFlowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M1 11L5.5 6L8.5 9L13 4" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 4H13V7" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BadgePayoutArrow = () => (
  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
    <path d="M1 4C2 2.5 3 2.5 4 4C5 5.5 6 5.5 7 4" stroke="#CA8A04" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 4L10 7M10 7H7M10 7V4" stroke="#CA8A04" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BadgeNetFlowArrow = () => (
  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
    <path d="M1 8L4 5L6.5 7L10 3" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 3H10V5" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface WalletStatsRowProps {
  totalPayouts: number;
  netFlow: number;
}

export const WalletStatsRow: React.FC<WalletStatsRowProps> = ({ totalPayouts, netFlow }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
    {/* Total Payouts */}
    <div className="rounded-2xl bg-white border border-border p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center shrink-0">
            <PayoutIcon />
          </div>
          <span className="text-sm text-muted-foreground">Total Payouts</span>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1.5 rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1 shrink-0">
          <BadgePayoutArrow />
          12%
        </span>
      </div>
      <div className="text-2xl sm:text-[28px] font-bold text-foreground leading-none mb-1 sm:mb-2">
        ${totalPayouts.toLocaleString("en-CA", { minimumFractionDigits: 2 })}
      </div>
      <div className="text-xs text-muted-foreground">This month</div>
    </div>

    {/* Net Flow */}
    <div className="rounded-2xl bg-white border border-border p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
            <NetFlowIcon />
          </div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">NET FLOW</span>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1 shrink-0">
          <BadgeNetFlowArrow />
          8%
        </span>
      </div>
      <div className="text-2xl sm:text-[28px] font-bold text-green-600 leading-none mb-1 sm:mb-2">
        +${netFlow.toLocaleString("en-CA", { minimumFractionDigits: 2 })}
      </div>
      <div className="text-xs text-muted-foreground">Last 30 days</div>
    </div>
  </div>
);
