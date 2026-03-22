import * as React from "react";
import { Eye, Plus, ArrowUpRight } from "lucide-react";

// Wallet icon matching Figma — card with horizontal lines
const WalletCardIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="3" />
    <path d="M2 10h20" />
    <circle cx="17" cy="15" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

interface WalletBalanceCardProps {
  balance: number;
  onAddFunds: () => void;
  onWithdraw: () => void;
}

export const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({
  balance,
  onAddFunds,
  onWithdraw,
}) => (
  <div className="rounded-2xl bg-primary p-7 relative overflow-hidden shadow-md">
    {/* Top-right wallet icon button */}
    <div className="absolute right-6 top-6 w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-primary-foreground">
      <WalletCardIcon />
    </div>

    {/* Available Balance label */}
    <div className="flex items-center gap-2 mb-2">
      <span className="text-sm text-primary-foreground/70 font-medium">Available Balance</span>
      <Eye className="w-4 h-4 text-primary-foreground/70" />
    </div>

    {/* Balance amount */}
    <div className="flex items-baseline gap-2 mb-6">
      <span className="text-5xl font-bold text-primary-foreground tracking-tight">
        ${balance.toLocaleString("en-CA", { minimumFractionDigits: 2 })}
      </span>
      <span className="text-lg font-medium text-primary-foreground/60">CAD</span>
    </div>

    {/* Action buttons */}
    <div className="flex gap-3">
      <button
        onClick={onAddFunds}
        className="flex-1 h-12 rounded-xl bg-white text-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Funds
      </button>
      <button
        onClick={onWithdraw}
        className="flex-1 h-12 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-foreground/20 transition-colors"
      >
        <ArrowUpRight className="w-4 h-4" />
        Withdraw Funds
      </button>
    </div>
  </div>
);