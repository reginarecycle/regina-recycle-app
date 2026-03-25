import * as React from "react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { buildDateRange, formatAmount } from "@/lib/utils";
import { DataTable, type ColumnDef, type DataTableTabItem } from "@/components/ui/data-table";
import {
  DataTableHeaderControls,
  type TableFilterState,
  type StatusOption,
  DEFAULT_TABLE_FILTERS,
} from "@/components/ui/data-table-header-controls";
import type { Transaction, TransactionStatus, TransactionType } from "./types";
import { useGetWalletTransactions } from "@/api-hooks/useWallet";
import type { TxStatus } from "@/api-hooks/useWallet";
import useDebounce from "@/hooks/useDebounce";

// ─── Transaction mapper ───────────────────────────────────────────────────────

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
  if (tx.referenceType === "WITHDRAWAL" || tx.type === "DEBIT") uiType = "withdrawal";
  else if (tx.description?.toLowerCase().includes("payout") || tx.referenceType === "PICKUP") uiType = "payout";
  else if (tx.referenceType === "TOP_UP" || tx.type === "CREDIT") uiType = "topup";
  return {
    id: tx.referenceNumber ?? `RRY-${parseInt(tx.transactionId.replace(/-/g, "").slice(0, 8), 16) % 900000 + 100000}`,
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

const PAGE_SIZE = 8;

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
      cell: (row) => <span className="text-sm ">{row.date}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      cell: (row) => <span className="text-sm font-medium text-foreground">${formatAmount(row.amount)}</span>,
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TransactionHistoryPage() {
  const navigate = useNavigate();
  const [tab, setTab]       = useState<TransactionStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<TableFilterState<TransactionStatus>>(
    DEFAULT_TABLE_FILTERS as TableFilterState<TransactionStatus>
  );
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  React.useEffect(() => { setPage(1); }, [debouncedSearch, tab, filters]);

  const handleTabChange = (t: string) => {
    setTab(t as TransactionStatus | "ALL");
    setFilters((prev) => ({ ...prev, statuses: [] }));
  };

  const handleFiltersChange = (f: TableFilterState<TransactionStatus>) => {
    setFilters(f);
    if (f.statuses.length > 0) setTab("ALL");
  };

  const { startDate, endDate } = buildDateRange(filters.dateRange);

  const { data: txResult, isLoading, isError } = useGetWalletTransactions({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    status: (tab !== "ALL" ? tab : filters.statuses[0]) as TxStatus | undefined,
    startDate,
    endDate,
  });

  React.useEffect(() => {
    if (isError) toast.error("Failed to load transactions. Please refresh.");
  }, [isError]);

  const transactions: Transaction[] = useMemo(() => {
    const raw = txResult?.data?.data ?? [];
    return raw.map(mapTransaction);
  }, [txResult]);

  const totalItems = txResult?.data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const columns    = useMemo(() => buildColumns(), []);

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-auto bg-background">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary mb-5 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      <DataTable
        data={isLoading ? [] : transactions}
        columns={columns}
        rowKey={(r) => r.id}
        title="Transaction History"
        headerRight={
          <DataTableHeaderControls<TransactionStatus>
            search={search}
            onSearchChange={(v) => setSearch(v)}
            searchPlaceholder="Search for transaction..."
            filters={filters}
            onFiltersChange={handleFiltersChange}
            statusOptions={STATUS_OPTIONS}
          />
        }
        tabs={TABS}
        tabBarProps={{ mode: "none", value: tab, onChange: handleTabChange }}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        emptyText={isLoading ? "Loading..." : "No transactions found"}
        minHeight="400px"
      />
    </div>
  );
};