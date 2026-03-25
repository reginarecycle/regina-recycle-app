import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Minus, Plus, ArrowUpRight } from "lucide-react";
import { formatAmount } from "@/lib/utils";
import type { Transaction, TransactionStatus, TransactionType } from "./types";
import { WalletBalanceCard, WalletStats } from "./components";
import { Routes } from "@/routes/routes";
import { WithdrawFundsModal } from "./Modals/withdraw/Withdrawfundsmodal";
import { AddFundsModal } from "./Modals/AddFunds/AddFundsModal";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { useGetCollectorWallet, useGetWalletTransactions } from "@/api-hooks/useWallet";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TX_ICONS: Record<TransactionType, { bg: string; Icon: React.ElementType; color: string }> = {
  payout: { bg: "bg-yellow-100", Icon: Minus, color: "text-yellow-600" },
  topup: { bg: "bg-green-100", Icon: Plus, color: "text-green-600" },
  withdrawal: { bg: "bg-blue-100", Icon: ArrowUpRight, color: "text-blue-600" },
};

function mapTransaction(tx: {
  transactionId: string;
  referenceNumber?: string;
  walletId: string;
  type: string;
  amount: number;
  status: string;
  description?: string;
  referenceType?: string;
  referenceId?: string;
  createdAt: string;
}): Transaction {
  let uiType: TransactionType = "topup";
  if (tx.referenceType === "WITHDRAWAL" || tx.type === "DEBIT") {
    uiType = "withdrawal";
  } else if (tx.description?.toLowerCase().includes("payout") || tx.referenceType === "PICKUP") {
    uiType = "payout";
  }
  return {
    id: tx.referenceNumber ?? `RRY-${parseInt(tx.transactionId.replace(/-/g, "").slice(0, 8), 16) % 900000 + 100000}`,
    name: tx.description ?? "Transaction",
    type: uiType,
    date: new Date(tx.createdAt).toLocaleDateString("en-CA", { day: "numeric", month: "short", year: "numeric" }),
    amount: tx.amount,
    status: tx.status as TransactionStatus,
  };
}

// ─── Columns ──────────────────────────────────────────────────────────────────

const COLUMNS: ColumnDef<Transaction>[] = [
  {
    key: "transaction",
    header: "Transaction",
    cell: (row) => {
      const { bg, Icon, color } = TX_ICONS[row.type];
      return (
        <div className="flex items-center gap-4 min-w-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-foreground truncate">{row.name}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{row.id}</div>
          </div>
        </div>
      );
    },
  },
  {
    key: "date",
    header: "Date",
    cell: (row) => <span className="text-sm text-foreground">{row.date}</span>,
  },
  {
    key: "amount",
    header: "Amount",
    cell: (row) => <span className="text-sm font-medium text-foreground">${formatAmount(row.amount)}</span>,
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <StatusBadge status={row.status} />,
  },
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function WalletSkeleton() {
  return (
    <div className="flex-1 p-6 lg:p-8 bg-background flex flex-col gap-5 animate-pulse">
      <div className="rounded-2xl bg-gray-200 h-52" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="rounded-2xl bg-gray-200 h-32" />
        <div className="rounded-2xl bg-gray-200 h-32" />
      </div>
      <div className="rounded-2xl bg-gray-200 h-80" />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function WalletManagement() {
  const navigate = useNavigate();
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const { data: walletResult, isLoading: walletLoading, isError: walletError } = useGetCollectorWallet();
  const { data: txResult, isLoading: txLoading, isError: txError } = useGetWalletTransactions({ page: 1, limit: 4 });

  if (walletError) toast.error("Failed to load wallet. Please refresh.");
  if (txError) toast.error("Failed to load transactions. Please refresh.");

  const wallet = walletResult?.data;
  const transactions = useMemo(() => (txResult?.data?.data ?? []).map(mapTransaction), [txResult]);

  if (walletLoading) return <WalletSkeleton />;
  if (!wallet) return (
    <div className="flex-1 flex items-center justify-center p-8">
      <p className="text-muted-foreground text-sm">Failed to load wallet. Please refresh.</p>
    </div>
  );


  return (
    <div className="flex-1 p-6 lg:p-8 overflow-auto bg-background flex flex-col gap-5">
      <WalletBalanceCard
        balance={wallet.balance}
        onAddFunds={() => setAddFundsOpen(true)}
        onWithdraw={() => setWithdrawOpen(true)}
      />

      <WalletStats
        totalPayouts={wallet.monthlyPayouts}
        netFlow={wallet.monthlyNetFlow}
        payoutsChange={wallet.monthlyPayoutsChange}
        netFlowChange={wallet.monthlyNetChange}
      />

      <DataTable
        data={txLoading ? [] : transactions}
        columns={COLUMNS}
        rowKey={(r) => r.id}
        title="Transaction History"
        headerRight={
          <button
            onClick={() => navigate(Routes.collectortransactionhistory)}
            className="text-sm text-primary font-semibold hover:underline whitespace-nowrap"
          >
            View All
          </button>
        }
        showTabs={false}
        showPagination={false}
        emptyText={txLoading ? "Loading..." : "No transactions yet"}
        minHeight="300px"
      />

      <AddFundsModal open={addFundsOpen} onClose={() => setAddFundsOpen(false)} />
      <WithdrawFundsModal open={withdrawOpen} onClose={() => setWithdrawOpen(false)} availableBalance={wallet.balance} />
    </div>
  );
}
