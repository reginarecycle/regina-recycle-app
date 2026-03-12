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

const balanceCad = 3000500;

type RecentTxStatus = "CREDIT" | "WITHDRAWAL" | "FAILED";

type RecentTx = {
  id: string;
  date: string;
  status: RecentTxStatus;
  desc: string;
  amount: string;
  amountColor: string;
  badgeBg: string;
  badgeText: string;
};

const RECENT_TX: RecentTx[] = [
  {
    id: "WALLET-TX-1",
    date: "14, Jan 2023",
    status: "CREDIT",
    desc: "Payment for plastic recyclables",
    amount: "CAD 1,558",
    amountColor: "#166534",
    badgeBg: "#DCFCE7",
    badgeText: "#166534",
  },
  {
    id: "WALLET-TX-2",
    date: "14, Jan 2023",
    status: "WITHDRAWAL",
    desc: "Withdraw via Interac",
    amount: "CAD 1,558",
    amountColor: "#DD1E1E",
    badgeBg: "#EAF2FF",
    badgeText: "#2563EB",
  },
  {
    id: "WALLET-TX-3",
    date: "14, Jan 2023",
    status: "CREDIT",
    desc: "Payment for tins",
    amount: "CAD 1,558",
    amountColor: "#166534",
    badgeBg: "#DCFCE7",
    badgeText: "#166534",
  },
  {
    id: "WALLET-TX-4",
    date: "14, Jan 2023",
    status: "WITHDRAWAL",
    desc: "Withdraw via Interac",
    amount: "CAD 1,558",
    amountColor: "#DD1E1E",
    badgeBg: "#EAF2FF",
    badgeText: "#2563EB",
  },
  {
    id: "WALLET-TX-5",
    date: "14, Jan 2023",
    status: "CREDIT",
    desc: "Payment for tins",
    amount: "CAD 1,558",
    amountColor: "#166534",
    badgeBg: "#DCFCE7",
    badgeText: "#166534",
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
      render: (item) => (
        <span
          className="inline-flex items-center justify-center rounded-[34px] px-[8px] py-[0px]"
          style={{ background: item.badgeBg }}
        >
          <span
            className="text-[10px] font-bold leading-[18px] uppercase"
            style={{ color: item.badgeText }}
          >
            {item.status}
          </span>
        </span>
      ),
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
          style={{ color: item.amountColor }}
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
          {/* Account Balance Card */}
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
              <span className="text-white text-[16px] font-bold leading-[24px]">
                Available Balance
              </span>

              <span className="inline-flex h-6 w-6 items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </span>
            </div>

            <div className="mt-14 flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-white text-[36px] font-bold leading-[44px]">
                  ${balanceCad.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-white text-[14px] font-bold leading-[20px]">
                  CAD
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                className="
                  w-[255px] h-[52px] min-w-0
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

          {/* Earnings Overview */}
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

    <TabsList className="w-auto border-none gap-2 rounded-[4px] bg-[rgba(52,78,65,0.08)] p-[4px] h-[32px]">
      <TabsTrigger
        value="monthly"
        className="h-[24px] rounded-[4px] px-3 py-[5px] text-[14px] font-medium leading-[20px] data-[state=active]:bg-[#344E41] data-[state=active]:text-white data-[state=active]:border-b-0"
      >
        Monthly
      </TabsTrigger>

      <TabsTrigger
        value="yearly"
        className="h-[24px] rounded-[4px] px-3 py-[5px] text-[14px] font-medium leading-[20px] text-black data-[state=active]:bg-[#344E41] data-[state=active]:text-white data-[state=active]:border-b-0"
      >
        Yearly
      </TabsTrigger>
    </TabsList>
  </div>

  <TabsContent value="monthly" className="mt-3">
    <div className="p-4">
      <ChartContainer
        config={earningsChartConfig}
        className="h-[260px] w-full"
      >
        <BarChart data={earningsData}>
          <CartesianGrid vertical={false} stroke="#CFCFCF" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="earnings"
            fill="var(--color-earnings)"
            radius={4}
            barSize={50}
          />
        </BarChart>
      </ChartContainer>
    </div>
  </TabsContent>

  <TabsContent value="yearly" className="mt-3">
    <div className="p-4">
      <ChartContainer
        config={earningsChartConfig}
        className="h-[260px] w-full"
      >
        <BarChart data={earningsData}>
          <CartesianGrid vertical={false} stroke="#CFCFCF" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="earnings"
            fill="var(--color-earnings)"
            radius={4}
            barSize={50}
          />
        </BarChart>
      </ChartContainer>
    </div>
  </TabsContent>
</Tabs>
          </section>

          {/* Recent Transaction */}
          <section className="w-full max-w-[1208px]">
            <div
              className="
                flex items-center justify-between
                rounded-t-[8px]
                border-t border-l border-r border-b border-[#CFCFCF]
                bg-white
                px-[24px] py-[12px]
              "
            >
              <h3 className="text-[16px] font-bold leading-[24px] text-[#0C111D]">
                Recent Transaction
              </h3>

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
            </div>

            <div className="rounded-b-[8px] border border-[#CFCFCF] border-t-0 bg-white overflow-hidden">
              <DataTable
                data={RECENT_TX}
                columns={recentTransactionColumns}
                keyExtractor={(item) => item.id}
                className="space-y-0"
              />
            </div>
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