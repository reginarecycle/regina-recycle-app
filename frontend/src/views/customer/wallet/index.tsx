import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowUpRight, ChevronRight } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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

// ── Types ─────────────────────────────────────────────────────────────────────

type TxStatus = "CREDIT" | "WITHDRAWAL" | "FAILED";

type RecentTx = {
  id: string;
  date: string;
  status: TxStatus;
  desc: string;
  amount: string;
};

// ── Static data ───────────────────────────────────────────────────────────────

const BALANCE = 3000500;

const RECENT_TX: RecentTx[] = [
  { id: "WALLET-TX-1", date: "14, Jan 2023", status: "CREDIT",     desc: "Payment for plastic recyclables", amount: "CAD 1,558" },
  { id: "WALLET-TX-2", date: "14, Jan 2023", status: "WITHDRAWAL", desc: "Withdrew via Interac",             amount: "CAD 1,558" },
  { id: "WALLET-TX-3", date: "14, Jan 2023", status: "CREDIT",     desc: "Payment for tins",                amount: "CAD 1,558" },
  { id: "WALLET-TX-4", date: "14, Jan 2023", status: "WITHDRAWAL", desc: "Withdrew via Interac",             amount: "CAD 1,558" },
  { id: "WALLET-TX-5", date: "14, Jan 2023", status: "CREDIT",     desc: "Payment for tins",                amount: "CAD 1,558" },
];


const WEEKLY_DATA = [
  { label: "Sun", earnings: 0   },
  { label: "Mon", earnings: 80  },
  { label: "Tue", earnings: 45  },
  { label: "Wed", earnings: 120 },
  { label: "Thu", earnings: 0   },
  { label: "Fri", earnings: 95  },
  { label: "Sat", earnings: 60  },
];

const MONTHLY_DATA = [
  { label: "JAN",  earnings: 0   },
  { label: "FEB",  earnings: 193 },
  { label: "MAR",  earnings: 0   },
  { label: "APR",  earnings: 129 },
  { label: "MAY",  earnings: 0   },
  { label: "JUN",  earnings: 0   },
  { label: "JUL",  earnings: 0   },
  { label: "AUG",  earnings: 0   },
  { label: "SEPT", earnings: 0   },
  { label: "OCT",  earnings: 0   },
  { label: "NOV",  earnings: 0   },
  { label: "DEC",  earnings: 0   },
];

const chartConfig: ChartConfig = {
  earnings: { label: "Earnings", color: "rgba(52,78,65,0.6)" },
};

// ── Component ─────────────────────────────────────────────────────────────────

function CustomerWallet() {
  const navigate = useNavigate();
  const [visible, setVisible]           = useState(true);
  const [chartTab, setChartTab]         = useState<"weekly" | "monthly">("weekly");
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [openDetails, setOpenDetails]   = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<TransactionDetails | null>(null);

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

  const columns: ColumnDef<RecentTx>[] = [
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
      key: "desc",
      header: "Description",
      cell: (row) => <span className="text-sm text-foreground">{row.desc}</span>,
    },
    {
      key: "amount",
      header: "Amount (CAD)",
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

  const chartData = chartTab === "weekly" ? WEEKLY_DATA : MONTHLY_DATA;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-muted/30 min-h-screen">

      {/* Balance card */}
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
            {visible ? `$${BALANCE.toFixed(2)}` : (
              <>$<span className="text-2xl self-center tracking-widest leading-none">*******</span></>
            )}
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

      {/* Earnings chart */}
      <div className="w-full rounded-2xl border border-border bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Earnings Overview</h2>
            <p className="text-xs text-muted-foreground">
              {chartTab === "weekly" ? "Sun – Sat earnings" : "Jan – Dec earnings (2026)"}
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
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 11 }} />
            <ChartTooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} content={<ChartTooltipContent />} />
            <Bar dataKey="earnings" fill="var(--color-earnings)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Recent transactions */}
      <DataTable
        data={RECENT_TX}
        columns={columns}
        rowKey={(r) => r.id}
        title="Recent Transaction"
        headerRight={
          <button
            type="button"
            onClick={() => navigate(Routes.transactionhistory)}
            className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 whitespace-nowrap"
          >
            View All <ChevronRight className="w-4 h-4"/>
          </button>
        }
        showTabs={false}
        showPagination={false}
        minHeight="0px"
      />

      <WithdrawModal isOpen={withdrawOpen} onClose={() => setWithdrawOpen(false)} />
      <TransactionDetailsModal
        open={openDetails}
        onClose={() => { setOpenDetails(false); setSelectedDetails(null); }}
        details={selectedDetails}
      />
    </div>
  );
}
export default CustomerWallet
