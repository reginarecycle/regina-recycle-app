import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowUpRight, ChevronRight } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Routes } from "@/routes/routes";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { StatusBadge, getAmountColor } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import WithdrawModal from "@/components/modals/withdrawmodal";
import TransactionDetailsModal from "@/components/modals/transactiondetailmodal";
import type { TransactionDetails } from "@/components/modals/transactiondetailmodal";
import { useGetCustomerWallet } from "@/api-hooks/useCustomerWallet";
import { useGetWalletTransactions } from "@/api-hooks/useWallet";

// ── Types ─────────────────────────────────────────────────────────────────────

type TxStatusUI = "CREDIT" | "WITHDRAWAL" | "FAILED";

type RecentTx = {
  id: string;
  date: string;
  status: TxStatusUI;
  desc: string;
  amount: string;
};

// ── Mapper ────────────────────────────────────────────────────────────────────
// Backend sends "CREDIT" | "DEBIT" — we translate to what the UI expects

function mapTransaction(tx: {
  walletId: string;
  type: string;
  amount: number;
  status: string;
  description?: string;
  referenceType?: string;
  referenceId?: string;
  createdAt: string;
}): RecentTx {
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
    amount: `CAD ${tx.amount.toFixed(2)}`,
  };
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function WalletSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-muted/30 min-h-screen animate-pulse">
      <div className="rounded-2xl bg-gray-300 h-44" />
      <div className="rounded-2xl bg-gray-200 h-72" />
      <div className="rounded-2xl bg-gray-200 h-64" />
    </div>
  );
}

// ── Chart config ──────────────────────────────────────────────────────────────

const chartConfig: ChartConfig = {
  earnings: { label: "Earnings", color: "rgba(52,78,65,0.6)" },
};

// ── Component ─────────────────────────────────────────────────────────────────

function CustomerWallet() {
  const navigate = useNavigate();

  const [visible, setVisible]                   = useState(true);
  const [chartTab, setChartTab]                 = useState<"weekly" | "monthly">("weekly");
  const [withdrawOpen, setWithdrawOpen]         = useState(false);
  const [openDetails, setOpenDetails]           = useState(false);
  const [selectedDetails, setSelectedDetails]   = useState<TransactionDetails | null>(null);

  // ── Data fetching ──────────────────────────────────────────────────────────

  const {
    data: walletResult,
    isLoading: walletLoading,
    isError: walletError,
  } = useGetCustomerWallet();

  const {
    data: txResult,
    isLoading: txLoading,
    isError: txError,
  } = useGetWalletTransactions({ page: 1, limit: 5 });

  // Surface errors via toast (same pattern as collector)
  if (walletError) toast.error("Failed to load wallet. Please refresh.");
  if (txError)     toast.error("Failed to load transactions. Please refresh.");

  // ── Derived state ──────────────────────────────────────────────────────────

  // useGetOne<CustomerWallet> unwraps one level — same as collector does:
  // const wallet = walletResult?.data  (the API response body)
  const wallet = walletResult?.data;

  // useGetOne<PaginatedTransactions> → txResult is the raw response
  // PaginatedTransactions shape: { data: WalletTransaction[], meta: {...} }
  // so the array is at txResult?.data?.data  — same as collector
  const transactions = useMemo(
    () => (txResult?.data?.data ?? []).map(mapTransaction),
    [txResult]
  );

  // Chart data driven from wallet summary fields
  const WEEKLY_DATA = [
    { label: "This Month", earnings: wallet?.monthlyEarnings ?? 0 },
    { label: "Pending",    earnings: wallet?.pendingEarningsAmount ?? 0 },
  ];

  const MONTHLY_DATA = [
    { label: "This Year",  earnings: wallet?.yearlyEarnings ?? 0 },
    { label: "This Month", earnings: wallet?.monthlyEarnings ?? 0 },
  ];

  const chartData = chartTab === "weekly" ? WEEKLY_DATA : MONTHLY_DATA;

  // ── Guards ─────────────────────────────────────────────────────────────────

  if (walletLoading) return <WalletSkeleton />;

  if (!wallet) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <p className="text-sm text-muted-foreground">
          Failed to load wallet. Please refresh.
        </p>
      </div>
    );
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleViewMore = (tx: RecentTx) => {
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

  // ── Columns ────────────────────────────────────────────────────────────────

  const columns: ColumnDef<RecentTx>[] = [
    {
      key: "date",
      header: "Date",
      cell: (row) => (
        <span className="text-sm font-semibold text-foreground">{row.date}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "desc",
      header: "Description",
      cell: (row) => (
        <span className="text-sm text-foreground">{row.desc}</span>
      ),
    },
    {
      key: "amount",
      header: "Amount (CAD)",
      cell: (row) => (
        <span
          className="text-sm font-semibold"
          style={{ color: getAmountColor(row.status) }}
        >
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

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-muted/30 min-h-screen">

      {/* ── Balance card ── */}
      <div className="w-full rounded-2xl border-2 border-primary bg-linear-to-b from-[#618171] to-[#344E41] px-6 py-5 text-white">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-bold">Available Balance</span>
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="text-white/80 hover:text-white transition-colors"
          >
            {visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">
              {visible
                ? `$${wallet.balance.toFixed(2)}`
                : (
                  <>
                    $<span className="text-2xl self-center tracking-widest leading-none">*******</span>
                  </>
                )
              }
            </span>
            <span className="text-sm font-bold">CAD</span>
          </div>

          <Button
            variant="outline"
            className="h-12 w-full sm:w-60 border-white/30 bg-white text-primary hover:bg-white/90 font-semibold rounded-xl"
            onClick={() => setWithdrawOpen(true)}
          >
            <ArrowUpRight className="w-4 h-4 mr-1" />
            Withdraw Funds
          </Button>
        </div>
      </div>

      {/* ── Earnings chart ── */}
      <div className="w-full rounded-2xl border border-border bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Earnings Overview</h2>
            <p className="text-xs text-muted-foreground">
              {chartTab === "weekly"
                ? `Monthly: $${wallet.monthlyEarnings.toFixed(2)} | Pending: $${wallet.pendingEarningsAmount.toFixed(2)}`
                : `Yearly: $${wallet.yearlyEarnings.toFixed(2)} | This Month: $${wallet.monthlyEarnings.toFixed(2)}`
              }
            </p>
          </div>

          <div className="inline-flex items-center gap-1 rounded-lg bg-muted p-1">
            {(["weekly", "monthly"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setChartTab(tab)}
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-semibold transition-all",
                  chartTab === tab
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <ChartContainer config={chartConfig} className="h-65 w-full">
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#CFCFCF" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="earnings" fill="var(--color-earnings)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>

      {/* ── Recent transactions ── */}
      <DataTable
        data={txLoading ? [] : transactions}
        columns={columns}
        rowKey={(r) => r.id}
        title="Recent Transaction"
        headerRight={
          <button
            type="button"
            onClick={() => navigate(Routes.transactionhistory)}
            className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 whitespace-nowrap"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        }
        showTabs={false}
        showPagination={false}
        emptyText={txLoading ? "Loading..." : "No transactions yet"}
        minHeight="0px"
      />

      {/* ── Modals ── */}
      <WithdrawModal
        isOpen={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
      />

      <TransactionDetailsModal
        open={openDetails}
        onClose={() => {
          setOpenDetails(false);
          setSelectedDetails(null);
        }}
        details={selectedDetails}
      />
    </div>
  );
}

export default CustomerWallet;