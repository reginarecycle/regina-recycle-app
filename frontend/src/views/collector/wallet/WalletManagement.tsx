import * as React from "react";
import { useState } from "react";
import type { WalletManagementProps } from "./types";
import { SAMPLE_TRANSACTIONS } from "./constants";
import { WalletBalanceCard } from "./WalletBalanceCard.tsx";
import { WalletStatsRow } from "./WalletStatsRow.tsx";
import { TransactionRow, TX_GRID } from "./TransactionRow";
import { TransactionHistoryPage } from "./TransactionHistoryPage";
import { WithdrawFundsModal } from "./Modals/withdraw/Withdrawfundsmodal";
import { AddFundsModal } from "./Modals/AddFunds/AddFundsModal";

const WalletManagement: React.FC<WalletManagementProps> = ({
  balance      = 4850.0,
  totalPayouts = 12450.0,
  netFlow      = 1850.0,
  transactions = SAMPLE_TRANSACTIONS,
}) => {
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [viewAllOpen,  setViewAllOpen]  = useState(false);

  if (viewAllOpen) {
    return (
      <TransactionHistoryPage
        transactions={transactions}
        onBack={() => setViewAllOpen(false)}
      />
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto bg-background flex flex-col gap-4 sm:gap-5">
      <WalletBalanceCard
        balance={balance}
        onAddFunds={() => setAddFundsOpen(true)}
        onWithdraw={() => setWithdrawOpen(true)}
      />

      <WalletStatsRow totalPayouts={totalPayouts} netFlow={netFlow} />

      {/* Transaction History */}
      <div className="rounded-2xl bg-white border border-border overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border">
          <h2 className="font-bold text-base text-foreground">Transaction History</h2>
          <button
            onClick={() => setViewAllOpen(true)}
            className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
          >
            View All <span className="text-base leading-none">›</span>
          </button>
        </div>

        {/* Table Header — desktop only */}
        <div className={`hidden sm:grid ${TX_GRID} text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4 border-b border-border`}>
          <span>Transaction</span>
          <span>Date</span>
          <span>Amount</span>
          <span>Status</span>
        </div>

        {/* Rows */}
        <div className="px-4 sm:px-6">
          {transactions.slice(0, 4).map((tx) => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </div>
      </div>

      <AddFundsModal open={addFundsOpen} onClose={() => setAddFundsOpen(false)} />
      <WithdrawFundsModal
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        availableBalance={balance}
      />
    </div>
  );
};

export default WalletManagement;
