import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { StatusBadge, getAmountColor } from "@/components/ui/status-badge";
import { DataTableHeaderControls, type TableFilterState } from "@/components/ui/data-table-header-controls";
import TransactionDetailsModal from "@/components/modals/transactiondetailmodal";
import type { TransactionDetails } from "@/components/modals/transactiondetailmodal";
import { useGetWalletTransactions } from "@/api-hooks/useWallet";

// ── Types ─────────────────────────────────────────────────────────────────────

type TxStatusUI = "CREDIT" | "WITHDRAWAL" | "FAILED";

type Transaction = {
  id:          string;
  date:        string;
  status:      TxStatusUI;
  description: string;
  amount:      string;
};

// ── Mapper ────────────────────────────────────────────────────────────────────

function mapTransaction(tx: {
  transactionId: string;
  type:          string;
  amount:        number;
  status:        string;
  description?:  string;
  createdAt:     string;
}): Transaction {
  const status: TxStatusUI =
    tx.type === "CREDIT"     ? "CREDIT"
    : tx.status === "FAILED" ? "FAILED"
    : "WITHDRAWAL";

  return {
    id:          tx.transactionId,
    date:        new Date(tx.createdAt).toLocaleDateString("en-CA", {
      day: "numeric", month: "short", year: "numeric",
    }),
    status,
    description: tx.description ?? "Wallet transaction",
    amount:      `CAD ${tx.amount.toFixed(2)}`,
  };
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 8;

const STATUS_OPTIONS = [
  { key: "CREDIT"     as TxStatusUI, label: "Credit"     },
  { key: "WITHDRAWAL" as TxStatusUI, label: "Withdrawal" },
  { key: "FAILED"     as TxStatusUI, label: "Failed"     },
];

const DEFAULT_FILTERS: TableFilterState<TxStatusUI> = { statuses: [], dateRange: "alltime" };

// ── Component ─────────────────────────────────────────────────────────────────

export default function TransactionHistory() {
  const navigate = useNavigate();

  const [search, setSearch]                     = useState("");
  const [filters, setFilters]                   = useState<TableFilterState<TxStatusUI>>(DEFAULT_FILTERS);
  const [page, setPage]                         = useState(1);
  const [openDetails, setOpenDetails]           = useState(false);
  const [selectedDetails, setSelectedDetails]   = useState<TransactionDetails | null>(null);

  // ── Data fetching ──────────────────────────────────────────────────────────

  const { data: txResult, isLoading } = useGetWalletTransactions({
    page,
    limit:     PAGE_SIZE,
    search:    search.trim() || undefined,
    startDate: filters.dateRange !== "alltime" ? filters.dateRange : undefined,
  });

  const allTransactions = useMemo(
    () => (txResult?.data?.data ?? []).map(mapTransaction),
    [txResult],
  );

  const meta       = txResult?.data?.meta;
  const totalPages = meta ? Math.max(1, Math.ceil(meta.total / PAGE_SIZE)) : 1;

  // ── Client-side status filter (backend handles search + date) ─────────────

  const filtered = useMemo(
    () =>
      filters.statuses.length === 0
        ? allTransactions
        : allTransactions.filter((tx) => filters.statuses.includes(tx.status)),
    [allTransactions, filters.statuses],
  );

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleViewMore = (tx: Transaction) => {
    setSelectedDetails({
      amount:    tx.amount,
      currency:  "CAD",
      status:    tx.status,
      date:      tx.date,
      time:      "10:00am",
      sender:    "Shahnaz Recycle",
      receiver:  "Jane Doe",
      fees:      "0.00 CAD",
      reference: tx.id,
    });
    setOpenDetails(true);
  };

  // ── Columns ────────────────────────────────────────────────────────────────

  const columns: ColumnDef<Transaction>[] = [
    {
      key: "date",
      header: "Date",
      cell: (row) => <span className="text-sm font-semibold text-foreground">{row.date}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "description",
      header: "Description",
      cell: (row) => <span className="text-sm text-foreground">{row.description}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      cell: (row) => (
        <span className="text-sm font-semibold" style={{ color: getAmountColor(row.status) }}>
          {row.amount}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      cell: (row) => (
        <button
          type="button"
          onClick={() => handleViewMore(row)}
          className="text-sm font-semibold text-foreground hover:text-primary transition-colors w-fit"
        >
          View More
        </button>
      ),
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-muted/30 min-h-screen">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary transition-colors w-fit"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      <DataTable
        data={isLoading ? [] : filtered}
        columns={columns}
        rowKey={(r) => r.id}
        title="Transaction History"
        headerRight={
          <DataTableHeaderControls
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            searchPlaceholder="Search for transaction id..."
            filters={filters}
            onFiltersChange={(f) => { setFilters(f); setPage(1); }}
            statusOptions={STATUS_OPTIONS}
            showDateRange={true}
          />
        }
        showTabs={false}
        page={page}
        totalPages={totalPages}
        totalItems={meta?.total ?? 0}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        emptyText={isLoading ? "Loading..." : "No transactions found"}
        minHeight="300px"
      />

      <TransactionDetailsModal
        open={openDetails}
        onClose={() => { setOpenDetails(false); setSelectedDetails(null); }}
        details={selectedDetails}
      />
    </div>
  );
}