import * as React from "react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import type { Transaction, TransactionStatus, TransactionType } from "./types";
import { WalletBalanceCard } from "./WalletBalanceCard";
import { WalletStatsRow } from "./WalletStatsRow";
import { TransactionHistoryPage } from "./TransactionHistoryPage";
import { WithdrawFundsModal } from "./Modals/withdraw/Withdrawfundsmodal";
import { AddFundsModal } from "./Modals/AddFunds/AddFundsModal";
import { DataTable, type ColumnDef, type DataTableTabItem } from "@/components/ui/data-table";
import {
  DataTableHeaderControls,
  type TableFilterState,
  type StatusOption,
  type DateRange,
  DEFAULT_TABLE_FILTERS,
} from "@/components/ui/data-table-header-controls";
import { useGetCollectorWallet, useGetWalletTransactions } from "@/api-hooks/useWallet";
import type { TxStatus } from "@/api-hooks/useWallet";
import useDebounce from "@/hooks/useDebounce";

// ─── Date range helper ────────────────────────────────────────────────────────

function buildDateRange(dateRange: DateRange): { startDate?: string; endDate?: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (dateRange === "today") {
    const d = today.toISOString().split("T")[0];
    return { startDate: d, endDate: d };
  }
  if (dateRange === "7days") {
    const start = new Date(today);
    start.setDate(start.getDate() - 7);
    return { startDate: start.toISOString().split("T")[0] };
  }
  if (dateRange === "30days") {
    const start = new Date(today);
    start.setDate(start.getDate() - 30);
    return { startDate: start.toISOString().split("T")[0] };
  }
  return {};
}

// ─── Transaction mapper ───────────────────────────────────────────────────────

function mapTransaction(tx: {
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
  } else if (
    tx.description?.toLowerCase().includes("payout") ||
    tx.referenceType === "PICKUP"
  ) {
    uiType = "payout";
  } else if (tx.referenceType === "TOP_UP" || tx.type === "CREDIT") {
    uiType = "topup";
  }
  return {
    id: tx.referenceId ?? tx.walletId,
    name: tx.description ?? "Transaction",
    type: uiType,
    date: new Date(tx.createdAt).toLocaleDateString("en-CA", {
      day: "numeric", month: "short", year: "numeric",
    }),
    amount: tx.amount,
    status: tx.status as TransactionStatus,
  };
}

// ─── Icons ────────────────────────────────────────────────────────────────────

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

// ─── Tabs & filters ───────────────────────────────────────────────────────────

const TABS: DataTableTabItem[] = [
  { href: "ALL",       label: "All"       },
  { href: "PENDING",   label: "Pending"   },
  { href: "COMPLETED", label: "Completed" },
  { href: "FAILED",    label: "Failed"    },
];

const STATUS_OPTIONS: StatusOption<TransactionStatus>[] = [
  { key: "COMPLETED", label: "Completed" },
  { key: "PENDING",   label: "Pending"   },
  { key: "FAILED",    label: "Failed"    },
];

const PAGE_SIZE = 4;

// ─── Columns ──────────────────────────────────────────────────────────────────

function buildColumns(): ColumnDef<Transaction>[] {
  return [
    {
      key: "transaction",
      header: "Transaction",
      cell: (row) => {
        const icon = txIconMap[row.type];
        return (
          <div className="flex items-center gap-4 min-w-0">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${icon.bg}`}>
              {icon.icon}
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
      className: "w-48",
      cell: (row) => <span className="text-sm text-muted-foreground">{row.date}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      className: "w-44",
      cell: (row) => <span className="text-sm font-medium text-foreground">${row.amount.toFixed(2)}</span>,
    },
    {
      key: "status",
      header: "Status",
      className: "w-44",
      cell: (row) => {
        const s = statusMap[row.status];
        return (
          <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full tracking-wide whitespace-nowrap ${s.className}`}>
            {s.label}
          </span>
        );
      },
    },
  ];
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function WalletSkeleton() {
  return (
    <div className="flex-1 p-6 lg:p-8 overflow-auto bg-background flex flex-col gap-5 animate-pulse">
      <div className="rounded-2xl bg-gray-200 h-52" />
      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-2xl bg-gray-200 h-32" />
        <div className="rounded-2xl bg-gray-200 h-32" />
      </div>
      <div className="rounded-2xl bg-gray-200 h-80" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const WalletManagement: React.FC = () => {
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [viewAllOpen, setViewAllOpen]   = useState(false);
  const [tab, setTab]                   = useState<TransactionStatus | "ALL">("ALL");
  const [search, setSearch]             = useState("");
  const [filters, setFilters]           = useState<TableFilterState<TransactionStatus>>(
    DEFAULT_TABLE_FILTERS as TableFilterState<TransactionStatus>
  );
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  React.useEffect(() => { setPage(1); }, [debouncedSearch, tab, filters]);

  const { data: walletResult, isLoading: walletLoading, isError: walletError } = useGetCollectorWallet();

  const { startDate, endDate } = buildDateRange(filters.dateRange);

  const { data: txResult, isLoading: txLoading, isError: txError } = useGetWalletTransactions({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    status: tab !== "ALL"
      ? tab as TxStatus
      : filters.statuses.length === 1
      ? filters.statuses[0] as TxStatus
      : undefined,
    startDate,
    endDate,
  });

  React.useEffect(() => {
    if (walletError) toast.error("Failed to load wallet. Please refresh.");
  }, [walletError]);

  React.useEffect(() => {
    if (txError) toast.error("Failed to load transactions. Please refresh.");
  }, [txError]);

  const wallet = walletResult?.data;

  const transactions: Transaction[] = useMemo(() => {
    const raw = txResult?.data?.data ?? [];
    return raw.map(mapTransaction);
  }, [txResult]);

  const totalItems = txResult?.data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const columns    = useMemo(() => buildColumns(), []);

  if (walletLoading) return <WalletSkeleton />;

  if (!wallet) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-muted-foreground text-sm">Failed to load wallet. Please refresh.</p>
      </div>
    );
  }

  if (viewAllOpen) {
    return <TransactionHistoryPage onBack={() => setViewAllOpen(false)} />;
  }

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-auto bg-background flex flex-col gap-5">
      <WalletBalanceCard
        balance={wallet.balance}
        onAddFunds={() => setAddFundsOpen(true)}
        onWithdraw={() => setWithdrawOpen(true)}
      />

      <WalletStatsRow
        totalPayouts={wallet.monthlyPayouts}
        netFlow={wallet.monthlyNetFlow}
      />

      <DataTable
        data={txLoading ? [] : transactions}
        columns={columns}
        rowKey={(r) => r.id}
        title="Transaction History"
        headerRight={
          <div className="flex items-center gap-2">
            <DataTableHeaderControls<TransactionStatus>
              search={search}
              onSearchChange={(v) => setSearch(v)}
              searchPlaceholder="Search transactions..."
              filters={filters}
              onFiltersChange={(f) => setFilters(f)}
              statusOptions={STATUS_OPTIONS}
            />
            <button
              onClick={() => setViewAllOpen(true)}
              className="text-sm text-primary font-semibold hover:underline whitespace-nowrap"
            >
              View All
            </button>
          </div>
        }
        tabs={TABS}
        tabBarProps={{ mode: "none", value: tab, onChange: (t) => setTab(t as TransactionStatus | "ALL") }}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        emptyText={txLoading ? "Loading..." : "No transactions yet"}
        minHeight="300px"
      />

      <AddFundsModal open={addFundsOpen} onClose={() => setAddFundsOpen(false)} />
      <WithdrawFundsModal
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        availableBalance={wallet.balance}
      />
    </div>
  );
};

export default WalletManagement;