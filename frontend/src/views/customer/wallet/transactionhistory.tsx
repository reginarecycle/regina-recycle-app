import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TransactionDetailsModal from "../../../components/modals/transactiondetailmodal";
import type { TransactionDetails } from "../../../components/modals/transactiondetailmodal";

import DataTable, { type Column } from "@/components/ui/data-table";

type TxStatus = "CREDIT" | "WITHDRAWAL" | "FAILED";

type Transaction = {
  id: string;
  date: string;
  status: TxStatus;
  description: string;
  amount: string;
  amountColor: string;
  badgeBg: string;
  badgeText: string;
};

const mockData: Transaction[] = [
  {
    id: "TX-1001",
    date: "14, Jan 2023",
    status: "CREDIT",
    description: "Payment for plastic recyclables",
    amount: "CAD 1,558",
    amountColor: "#166534",
    badgeBg: "#DCFCE7",
    badgeText: "#166534",
  },
  {
    id: "TX-1002",
    date: "14, Jan 2023",
    status: "WITHDRAWAL",
    description: "Withdraw via Interac",
    amount: "CAD 1,558",
    amountColor: "#DD1E1E",
    badgeBg: "#EAF2FF",
    badgeText: "#2563EB",
  },
  {
    id: "TX-1003",
    date: "14, Jan 2023",
    status: "CREDIT",
    description: "Payment for tins",
    amount: "CAD 1,558",
    amountColor: "#166534",
    badgeBg: "#DCFCE7",
    badgeText: "#166534",
  },
  {
    id: "TX-1004",
    date: "14, Jan 2023",
    status: "FAILED",
    description: "Withdraw via Interac",
    amount: "CAD 1,558",
    amountColor: "#DD1E1E",
    badgeBg: "#FEE2E2",
    badgeText: "#DC2626",
  },
  {
    id: "TX-1005",
    date: "14, Jan 2023",
    status: "CREDIT",
    description: "Payment for tins",
    amount: "CAD 1,558",
    amountColor: "#166534",
    badgeBg: "#DCFCE7",
    badgeText: "#166534",
  },
  {
    id: "TX-1006",
    date: "14, Jan 2023",
    status: "CREDIT",
    description: "Payment for tins",
    amount: "CAD 1,558",
    amountColor: "#166534",
    badgeBg: "#DCFCE7",
    badgeText: "#166534",
  },
  {
    id: "TX-1007",
    date: "14, Jan 2023",
    status: "CREDIT",
    description: "Payment for glass",
    amount: "CAD 1,558",
    amountColor: "#166534",
    badgeBg: "#DCFCE7",
    badgeText: "#166534",
  },
  {
    id: "TX-1008",
    date: "14, Jan 2023",
    status: "CREDIT",
    description: "Payment for plastics",
    amount: "CAD 1,558",
    amountColor: "#166534",
    badgeBg: "#DCFCE7",
    badgeText: "#166534",
  },
];

const DETAILS_BY_ID: Record<string, TransactionDetails> = {
  "TX-1001": {
    amount: "$150.00",
    currency: "CAD",
    status: "WITHDRAWAL",
    date: "01-12-2026",
    time: "10:00am",
    sender: "Shahnaz Recycle",
    receiver: "Jane Doe",
    fees: "0.00CAD",
    reference: "20005487594",
  },
  "TX-1004": {
    amount: "$150.00",
    currency: "CAD",
    status: "FAILED",
    date: "01-12-2026",
    time: "10:00am",
    sender: "Shahnaz Recycle",
    receiver: "Jane Doe",
    fees: "0.00CAD",
    reference: "20005487594",
  },
};

export default function TransactionHistory() {
  const navigate = useNavigate();

  const [openDetails, setOpenDetails] = useState(false);
  const [selectedDetails, setSelectedDetails] =
    useState<TransactionDetails | null>(null);

  const handleViewMore = (tx: Transaction) => {
    const details = DETAILS_BY_ID[tx.id];
    if (!details) return;

    setSelectedDetails(details);
    setOpenDetails(true);
  };

  const columns: Column<Transaction>[] = [
    {
      key: "date",
      header: "Date",
      headerClassName: "w-[175px]",
      render: (item) => (
        <span className="font-bold text-[14px] text-foreground">
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
          className="inline-flex px-2 rounded-full text-[10px] font-bold uppercase"
          style={{ background: item.badgeBg, color: item.badgeText }}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (item) => (
        <span className="font-bold text-[14px] text-foreground">
          {item.description}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      headerClassName: "w-[181px]",
      render: (item) => (
        <span
          className="font-bold text-[14px]"
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
          className="font-bold text-[14px] cursor-pointer text-foreground"
          onClick={(e) => {
            e.stopPropagation();
            handleViewMore(item);
          }}
        >
          View More
        </button>
      ),
    },
  ];

  return (
    <div className="w-full bg-card">
      <div className="mx-auto w-full max-w-[1512px] min-h-[1086px] px-6 py-6">
        <div className="mb-4">
          <div
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-[16px] font-bold text-foreground cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </div>
        </div>

        <section className="w-full max-w-[1208px] rounded-[8px] border border-border bg-white">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="text-[16px] font-bold text-foreground">
              Transaction History
            </div>

            <input
              placeholder="Search for transaction id.."
              className="w-[300px] h-[36px] px-3 border border-border rounded-[8px]"
            />
          </div>

          <DataTable
            data={mockData}
            columns={columns}
            keyExtractor={(item) => item.id}
            pagination={{
              currentPage: 1,
              totalPages: 10,
              onPageChange: (page) => console.log(page),
              showText: "Showing 1 to 8 of 8",
            }}
          />
        </section>

        <TransactionDetailsModal
          open={openDetails}
          onClose={() => {
            setOpenDetails(false);
            setSelectedDetails(null);
          }}
          details={selectedDetails}
        />
      </div>
    </div>
  );
}