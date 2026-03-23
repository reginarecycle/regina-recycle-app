import * as React from "react";
import { cn } from "@/lib/utils";
import type { Transaction, TransactionStatus, TransactionType } from "./types";

const PayoutTxIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 7H11" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const TopupTxIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 2V12M2 7H12" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const WithdrawalTxIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 11L11 3M11 3H5M11 3V9" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const txIconMap: Record<TransactionType, { bg: string; icon: React.ReactNode }> = {
  payout:     { bg: "bg-yellow-100", icon: <PayoutTxIcon />     },
  topup:      { bg: "bg-green-100",  icon: <TopupTxIcon />      },
  withdrawal: { bg: "bg-blue-100",   icon: <WithdrawalTxIcon /> },
};

const statusMap: Record<TransactionStatus, { label: string; className: string }> = {
  COMPLETED: { label: "COMPLETED", className: "bg-green-50 text-green-700 border border-green-200"    },
  PENDING:   { label: "PENDING",   className: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
  FAILED:    { label: "FAILED",    className: "bg-red-50 text-red-500 border border-red-200"           },
};

// Desktop grid — hidden on mobile
export const TX_GRID = "grid-cols-[minmax(0,2fr)_200px_180px_200px]";

interface TransactionRowProps {
  tx: Transaction;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({ tx }) => {
  const icon   = txIconMap[tx.type];
  const status = statusMap[tx.status];

  return (
    <>
      {/* ── Mobile layout (< sm) ── */}
      <div className="sm:hidden flex items-center gap-3 py-4 border-b border-border last:border-0">
        <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0", icon.bg)}>
          {icon.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-foreground truncate">{tx.name}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{tx.date}</div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-sm font-semibold text-foreground">${tx.amount.toFixed(2)}</span>
          <span className={cn("text-[9px] font-bold px-2.5 py-1 rounded-full tracking-wide whitespace-nowrap", status.className)}>
            {status.label}
          </span>
        </div>
      </div>

      {/* ── Desktop layout (sm+) ── */}
      <div className={`hidden sm:grid ${TX_GRID} items-center py-5 border-b border-border last:border-0`}>
        <div className="flex items-center gap-4 min-w-0">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", icon.bg)}>
            {icon.icon}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-foreground truncate">{tx.name}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{tx.id}</div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">{tx.date}</div>
        <div className="text-sm font-medium text-foreground">${tx.amount.toFixed(2)}</div>
        <div>
          <span className={cn("text-[10px] font-bold px-4 py-1.5 rounded-full tracking-wide whitespace-nowrap", status.className)}>
            {status.label}
          </span>
        </div>
      </div>
    </>
  );
};
