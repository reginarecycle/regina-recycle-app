import { useState } from "react";
import { Eye, EyeOff, Plus, ArrowUpRight, Wallet } from "lucide-react";

interface WalletBalanceCardProps {
  balance: number;
  onAddFunds: () => void;
  onWithdraw: () => void;
}

export function WalletBalanceCard({ balance, onAddFunds, onWithdraw }: WalletBalanceCardProps) {
  const [visible, setVisible] = useState(true);

  return (
    <div className="rounded-2xl bg-primary p-7 relative overflow-hidden shadow-md">
      <div className="absolute right-6 top-6 w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-primary-foreground">
        <Wallet className="w-6 h-6" />
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm text-primary-foreground/70 font-medium">Available Balance</span>
        <button type="button" onClick={() => setVisible((v) => !v)} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
          {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-5xl font-bold text-primary-foreground tracking-tight">
          {visible ? `$${balance.toLocaleString("en-CA", { minimumFractionDigits: 2 })}` : "$•••••••"}
        </span>
        <span className="text-lg font-medium text-primary-foreground/60">CAD</span>
      </div>

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
}
