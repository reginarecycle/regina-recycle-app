import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { StatusBadge, getAmountColor } from "@/components/ui/status-badge";
import { DataTableHeaderControls, type TableFilterState } from "@/components/ui/data-table-header-controls";
import TransactionDetailsModal from "@/components/modals/transactiondetailmodal";
import type { TransactionDetails } from "@/components/modals/transactiondetailmodal";

// ── Types ─────────────────────────────────────────────────────────────────────

type TxStatus = "CREDIT" | "WITHDRAWAL" | "FAILED";

type Transaction = {
  id: string;
  date: string;
  status: TxStatus;
  description: string;
  amount: string;
};

// ── Static data ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 8;

const MOCK_DATA: Transaction[] = [
  { id: "TX-1001", date: "14, Jan 2023", status: "CREDIT",     description: "Payment for plastic recyclables", amount: "CAD 1,558" },
  { id: "TX-1002", date: "14, Jan 2023", status: "WITHDRAWAL", description: "Withdrew via Interac",             amount: "CAD 1,558" },
  { id: "TX-1003", date: "14, Jan 2023", status: "CREDIT",     description: "Payment for tins",                amount: "CAD 1,558" },
  { id: "TX-1004", date: "14, Jan 2023", status: "FAILED",     description: "Withdrew via Interac",             amount: "CAD 1,558" },
  { id: "TX-1005", date: "14, Jan 2023", status: "CREDIT",     description: "Payment for tins",                amount: "CAD 1,558" },
  { id: "TX-1006", date: "14, Jan 2023", status: "CREDIT",     description: "Payment for tins",                amount: "CAD 1,558" },
  { id: "TX-1007", date: "14, Jan 2023", status: "CREDIT",     description: "Payment for glass",               amount: "CAD 1,558" },
  { id: "TX-1008", date: "14, Jan 2023", status: "CREDIT",     description: "Payment for plastics",            amount: "CAD 1,558" },
];

const STATUS_OPTIONS = [
  { key: "CREDIT" as TxStatus,     label: "Credit"     },
  { key: "WITHDRAWAL" as TxStatus, label: "Withdrawal" },
  { key: "FAILED" as TxStatus,     label: "Failed"     },
];


const DEFAULT_FILTERS: TableFilterState<TxStatus> = { statuses: [], dateRange: "alltime" };

// ── Component ─────────────────────────────────────────────────────────────────

export default function TransactionHistory() {
  const navigate = useNavigate();
  const [search, setSearch]           = useState("");
  const [filters, setFilters]         = useState<TableFilterState<TxStatus>>(DEFAULT_FILTERS);
  const [page, setPage]               = useState(1);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<TransactionDetails | null>(null);

  const handleViewMore = (tx: Transaction) => {
    setSelectedDetails({
      amount: tx.amount,
      currency: "CAD",
      status: tx.status,
      date: tx.date,
      time: "10:00am",
      sender: "Shahnaz Recycle",
      receiver: "Jane Doe",
      fees: "0.00 CAD",
      reference: tx.id,
    });
    setOpenDetails(true);
  };

  const filtered = MOCK_DATA.filter((tx) => {
    const matchesSearch =
      search.trim() === "" ||
      tx.id.toLowerCase().includes(search.toLowerCase()) ||
      tx.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filters.statuses.length === 0 || filters.statuses.includes(tx.status);
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
          className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
        >
          View More
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-muted/30 min-h-screen">

      {/* Back */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary transition-colors w-fit"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      <DataTable
        data={paginated}
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
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        emptyText="No transactions found"
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
