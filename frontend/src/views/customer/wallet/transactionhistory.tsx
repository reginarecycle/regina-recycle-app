import * as React from "react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { buildDateRange } from "@/lib/utils";
import { DataTable, type ColumnDef, type DataTableTabItem } from "@/components/ui/data-table";
import {
  DataTableHeaderControls,
  type TableFilterState,
  type StatusOption,
  DEFAULT_TABLE_FILTERS,
} from "@/components/ui/data-table-header-controls";
import { useGetWalletTransactions } from "@/api-hooks/useWallet";
import type { TxStatus } from "@/api-hooks/useWallet";
import useDebounce from "@/hooks/useDebounce";
import { Routes } from "@/routes/routes";

// ─── Types ────────────────────────────────────────────────────────────────────

type TxStatusUI = "CREDIT" | "WITHDRAWAL" | "FAILED";

type CustomerTransaction = {
  id: string;
  date: string;
  status: TxStatusUI;
  desc: string;
  amount: number;
  rawStatus: string; // COMPLETED | PENDING | FAILED from backend
};

// ─── Mapper ───────────────────────────────────────────────────────────────────

function mapTransaction(tx: {
  walletId: string;
  type: string;
  amount: number;
  status: string;
  description?: string;
  referenceType?: string;
  referenceId?: string;
  createdAt: string;
}): CustomerTransaction {
  const statusUI: TxStatusUI =
    tx.type === "CREDIT"
      ? "CREDIT"
      : tx.status === "FAILED"
      ? "FAILED"
      : "WITHDRAWAL";

  return {
    id: tx.referenceId ?? `${tx.createdAt}-${tx.amount}`,
    date: new Date(tx.createdAt).toLocaleDateString("en-CA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    status: statusUI,
    desc: tx.description ?? "Wallet transaction",
    amount: tx.amount,
    rawStatus: tx.status, // keep original for tab filtering badge
  };
}

// ─── Status badge map ─────────────────────────────────────────────────────────

const statusBadgeMap: Record<string, { label: string; className: string }> = {
  COMPLETED: { label: "COMPLETED", className: "bg-green-50 text-green-700 border border-green-200"    },
  PENDING:   { label: "PENDING",   className: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
  FAILED:    { label: "FAILED",    className: "bg-red-50 text-red-500 border border-red-200"           },
};

// ─── Amount color ─────────────────────────────────────────────────────────────

function getAmountColor(status: TxStatusUI): string {
  if (status === "CREDIT")     return "#16a34a";
  if (status === "WITHDRAWAL") return "#2563EB";
  return "#ef4444";
}

// ─── Tabs & filters ───────────────────────────────────────────────────────────

type BackendStatus = "COMPLETED" | "PENDING" | "FAILED";

const TABS: DataTableTabItem[] = [
  { href: "ALL",       label: "All"       },
  { href: "PENDING",   label: "Pending"   },
  { href: "COMPLETED", label: "Completed" },
  { href: "FAILED",    label: "Failed"    },
];

const STATUS_OPTIONS: StatusOption<BackendStatus>[] = [
  { key: "COMPLETED", label: "Completed" },
  { key: "PENDING",   label: "Pending"   },
  { key: "FAILED",    label: "Failed"    },
];

const PAGE_SIZE = 8;

// ─── Columns ──────────────────────────────────────────────────────────────────

function buildColumns(): ColumnDef<CustomerTransaction>[] {
  return [
    {
      key: "desc",
      header: "Description",
      cell: (row) => (
        <div className="min-w-0">
          <div className="font-semibold text-sm text-foreground truncate">{row.desc}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{row.id}</div>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date",
      className: "w-48",
      cell: (row) => (
        <span className="text-sm text-muted-foreground">{row.date}</span>
      ),
    },
    {
      key: "amount",
      header: "Amount (CAD)",
      className: "w-44",
      cell: (row) => (
        <span
          className="text-sm font-semibold"
          style={{ color: getAmountColor(row.status) }}
        >
          ${row.amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: "type",
      header: "Type",
      className: "w-36",
      cell: (row) => {
        const colors: Record<TxStatusUI, string> = {
          CREDIT:     "bg-green-50 text-green-700 border border-green-200",
          WITHDRAWAL: "bg-blue-50 text-blue-700 border border-blue-200",
          FAILED:     "bg-red-50 text-red-500 border border-red-200",
        };
        return (
          <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wide whitespace-nowrap ${colors[row.status]}`}>
            {row.status}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      className: "w-44",
      cell: (row) => {
        const s = statusBadgeMap[row.rawStatus] ?? statusBadgeMap.PENDING;
        return (
          <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full tracking-wide whitespace-nowrap ${s.className}`}>
            {s.label}
          </span>
        );
      },
    },
  ];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CustomerTransactionHistory() {
  const navigate = useNavigate();

  const [tab, setTab]       = useState<BackendStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<TableFilterState<BackendStatus>>(
    DEFAULT_TABLE_FILTERS as TableFilterState<BackendStatus>
  );
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  // Reset to page 1 when filters change
  React.useEffect(() => { setPage(1); }, [debouncedSearch, tab, filters]);

  const handleTabChange = (t: string) => {
    setTab(t as BackendStatus | "ALL");
    setFilters((prev) => ({ ...prev, statuses: [] }));
  };

  const handleFiltersChange = (f: TableFilterState<BackendStatus>) => {
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

  const transactions = useMemo(() => {
    const raw = txResult?.data?.data ?? [];
    return raw.map(mapTransaction);
  }, [txResult]);

  const totalItems = txResult?.data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const columns    = useMemo(() => buildColumns(), []);

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-auto bg-background">
      {/* Back button — navigates to wallet page */}
      <button
        type="button"
        onClick={() => navigate(Routes.wallet)}
        className="flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary mb-5 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Wallet
      </button>

      <DataTable
        data={isLoading ? [] : transactions}
        columns={columns}
        rowKey={(r) => r.id}
        title="Transaction History"
        headerRight={
          <DataTableHeaderControls<BackendStatus>
            search={search}
            onSearchChange={(v) => setSearch(v)}
            searchPlaceholder="Search transactions..."
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
}