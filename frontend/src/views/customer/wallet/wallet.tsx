import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Routes } from "@/routes/routes";
import WithdrawModal from "@/components/modals/withdrawmodal";
import TransactionDetailsModal from "@/components/modals/transactiondetailmodal";
import type { TransactionDetails } from "@/components/modals/transactiondetailmodal";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import DataTable, { type Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusBadge, getAmountColor } from "@/components/ui/status-badge";

const balanceCad = 3000500;


type RecentTxStatus = "CREDIT" | "WITHDRAWAL" | "FAILED";

type RecentTx = {
  id: string;
  date: string;
  status: RecentTxStatus;
  desc: string;
  amount: string;
  
};

const RECENT_TX: RecentTx[] = [
  {
    id: "WALLET-TX-1",
    date: "14, Jan 2023",
    status: "CREDIT",
    desc: "Payment for plastic recyclables",
    amount: "CAD 1,558",
  },
  {
    id: "WALLET-TX-2",
    date: "14, Jan 2023",
    status: "WITHDRAWAL",
    desc: "Withdraw via Interac",
    amount: "CAD 1,558",
  },
  {
    id: "WALLET-TX-3",
    date: "14, Jan 2023",
    status: "CREDIT",
    desc: "Payment for tins",
    amount: "CAD 1,558",
  },
  {
    id: "WALLET-TX-4",
    date: "14, Jan 2023",
    status: "WITHDRAWAL",
    desc: "Withdraw via Interac",
    amount: "CAD 1,558",
  },
  {
    id: "WALLET-TX-5",
    date: "14, Jan 2023",
    status: "CREDIT",
    desc: "Payment for tins",
    amount: "CAD 1,558",
  },
];

const DETAILS_BY_ID: Record<string, TransactionDetails> = {
  "WALLET-TX-1": {
    amount: "$150.00",
    currency: "CAD",
    status: "CREDIT",
    date: "01-12-2026",
    time: "10:00am",
    sender: "Shahnaz Recycle",
    receiver: "Jane Doe",
    fees: "0.00CAD",
    reference: "20005487594",
  },
  "WALLET-TX-2": {
    amount: "$200.00",
    currency: "CAD",
    status: "WITHDRAWAL",
    date: "01-12-2026",
    time: "11:00am",
    sender: "Jane Doe",
    receiver: "Interac",
    fees: "0.00CAD",
    reference: "20005487595",
  },
};

const earningsData = [
  { month: "JAN", earnings: 0 },
  { month: "FEB", earnings: 193 },
  { month: "MAR", earnings: 0 },
  { month: "APR", earnings: 129 },
  { month: "MAY", earnings: 0 },
  { month: "JUN", earnings: 0 },
  { month: "JUL", earnings: 0 },
  { month: "AUG", earnings: 0 },
  { month: "SEPT", earnings: 0 },
  { month: "OCT", earnings: 0 },
  { month: "NOV", earnings: 0 },
  { month: "DEC", earnings: 0 },
];

const earningsChartConfig: ChartConfig = {
  earnings: {
    label: "Earnings",
    color: "rgba(52,78,65,0.6)",
  },
};

export default function CustomerWallet() {
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedDetails, setSelectedDetails] =
    useState<TransactionDetails | null>(null);

  const navigate = useNavigate();

  const handleWalletViewMore = (tx: RecentTx) => {
    const details = DETAILS_BY_ID[tx.id];
    if (!details) return;
    setSelectedDetails(details);
    setOpenDetails(true);
  };

  const recentTransactionColumns: Column<RecentTx>[] = [
    {
      key: "date",
      header: "Date",
      headerClassName: "w-[175px]",
      render: (item) => (
        <span className="text-[14px] font-bold leading-[20px] text-[#0C111D]">
          {item.date}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      headerClassName: "w-[136px]",
      
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "desc",
      header: "Description",
      headerClassName: "w-[295px]",
      render: (item) => (
        <span className="text-[14px] font-bold leading-[20px] text-[#0C111D]">
          {item.desc}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount (CAD)",
      headerClassName: "w-[181px]",
      
      render: (item) => (
        <span
          className="text-[14px] font-bold leading-[20px]"
          style={{ color: getAmountColor(item.status) }}
        >
          {item.amount}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      headerClassName: "w-[205px]",
      render: (item) => (
        <button
          type="button"
          className="text-[14px] font-bold leading-[20px] text-[#0C111D]"
          onClick={() => handleWalletViewMore(item)}
        >
          View More
        </button>
      ),
    },
  ];

  return (
    <div className="w-full bg-[#F7F7F7]">
      <div className="mx-auto w-full max-w-[1512px] min-h-[1086px] px-6 py-6">
        <div className="flex flex-col gap-4">
          {/* Balance Card */}
          <div
            className="
              w-full max-w-[1208px] min-h-[167px]
              rounded-[16px]
              border-[2px] border-[#618171]
              bg-[linear-gradient(179deg,#618171_0.98%,#344E41_98.86%)]
              px-6 py-5
              text-white
            "
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[16px] font-bold leading-[24px] text-white">
                Available Balance
              </span>
              <span className="inline-flex h-6 w-6 items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </span>
            </div>

            <div className="mt-14 flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-[36px] font-bold leading-[44px] text-white">
                  ${balanceCad.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-[14px] font-bold leading-[20px] text-white">
                  CAD
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                className="
                  h-[52px] w-[255px] min-w-0
                  border-[#344E41] bg-white text-[#344E41]
                  hover:bg-gray-50
                "
                onClick={() => setIsWithdrawOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path d="M7 7H17V17M7 17L17 7L7 17Z" fill="#344E41" />
                  <path
                    d="M7 7H17M17 7V17M17 7L7 17"
                    stroke="#344E41"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Withdraw Funds
              </Button>
            </div>
          </div>

          {/* Earnings Chart */}
          <section
            className="
              w-full max-w-[1208px] min-h-[385px]
              rounded-[16px]
              border border-[#CFCFCF]
              bg-white
              p-4
            "
          >
            <Tabs defaultValue="monthly" className="w-full">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <h2 className="text-[18px] font-semibold leading-[28px] text-black">
                    Earnings Overview
                  </h2>
                  <p className="text-[14px] font-medium leading-[20px] text-[#999CA0]">
                    Monthly rewards income (2026)
                  </p>
                </div>

                <TabsList className="h-[32px] w-auto gap-2 rounded-[4px] border-none bg-[rgba(52,78,65,0.08)] p-[4px]">
                  <TabsTrigger
                    value="monthly"
                    className="h-[24px] rounded-[4px] px-3 py-[5px] text-[14px] font-medium leading-[20px] data-[state=active]:border-b-0 data-[state=active]:bg-[#344E41] data-[state=active]:text-white"
                  >
                    Monthly
                  </TabsTrigger>
                  <TabsTrigger
                    value="yearly"
                    className="h-[24px] rounded-[4px] px-3 py-[5px] text-[14px] font-medium leading-[20px] text-black data-[state=active]:border-b-0 data-[state=active]:bg-[#344E41] data-[state=active]:text-white"
                  >
                    Yearly
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="monthly" className="mt-3">
                <ChartContainer
                  config={earningsChartConfig}
                  className="h-[260px] w-full"
                >
                  <BarChart data={earningsData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#CFCFCF" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      tick={{ fontSize: 11 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="earnings"
                      fill="var(--color-earnings)"
                      radius={4}
                      barSize={80}
                    />
                  </BarChart>
                </ChartContainer>
              </TabsContent>

              <TabsContent value="yearly" className="mt-3">
                <ChartContainer
                  config={earningsChartConfig}
                  className="h-[260px] w-full"
                >
                  <BarChart data={earningsData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#CFCFCF" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      tick={{ fontSize: 11 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="earnings"
                      fill="var(--color-earnings)"
                      radius={4}
                      barSize={30}
                    />
                  </BarChart>
                </ChartContainer>
              </TabsContent>
            </Tabs>
          </section>

          {/* Recent Transactions Table */}
          <section className="w-full max-w-[1208px]">
            <DataTable
              data={RECENT_TX}
              columns={recentTransactionColumns}
              keyExtractor={(item) => item.id}
              header={{
                title: "Recent Transaction",
                action: (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-[14px] font-bold leading-[20px] text-[#618171]"
                    onClick={() => navigate(Routes.transactionhistory)}
                  >
                    View All
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M6 12L10 8L6 4"
                        stroke="#618171"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ),
              }}
            />
          </section>
        </div>
      </div>

      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
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