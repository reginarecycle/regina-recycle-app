import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TransactionDetailsModal from "../../components/modals/transactiondetailmodal";
import type { TransactionDetails } from "../../components/modals/transactiondetailmodal";

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

  return (
    <div className="w-full bg-[#F7F7F7]">
      <div className="mx-auto w-full max-w-[1512px] min-h-[1086px] px-6 py-6">
       
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-[16px] font-bold text-[#0C111D]"
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
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            Back
          </button>
        </div>

        {/* Card */}
        <section className="w-full max-w-[1208px] rounded-[8px] border border-[#CFCFCF] bg-white">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="text-[16px] font-bold">Transaction History</div>

            <input
              placeholder="Search for transaction id.."
              className="w-[300px] h-[36px] px-3 border border-[#CFCFCF] rounded-[8px]"
            />
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[175px_136px_1fr_181px_205px] h-[44px] px-6 items-center border-y border-[#CFCFCF] text-[#999CA0] font-bold text-[14px]">
            <div>Date</div>
            <div>Status</div>
            <div>Description</div>
            <div>Amount</div>
            <div>Action</div>
          </div>

          {/* Body */}
          <div className="min-h-[560px] bg-white">
            {mockData.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-[175px_136px_1fr_181px_205px] h-[56px] px-6 items-center border-b border-[#CFCFCF]"
              >
                <div className="font-bold text-[14px]">{t.date}</div>

                <div>
                  <span
                    className="inline-flex px-2 rounded-full text-[10px] font-bold uppercase"
                    style={{ background: t.badgeBg, color: t.badgeText }}
                  >
                    {t.status}
                  </span>
                </div>

                <div className="font-bold text-[14px]">{t.description}</div>

                <div
                  className="font-bold text-[14px]"
                  style={{ color: t.amountColor }}
                >
                  {t.amount}
                </div>

                <div>
                  
                  <button
                    type="button"
                    className="font-bold text-[14px] text-[#0C111D] cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewMore(t);
                    }}
                  >
                    View More
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between h-[62px] px-6 border-t border-[#CFCFCF] bg-white">
            <div className="text-[16px] text-[#0C111D]/70">
              Showing 1 to 8 of 1
            </div>

            <div className="inline-flex border border-[#CFCFCF] rounded-[8px] overflow-hidden bg-white">
              <button className="h-[40px] px-4 border-r border-[#CFCFCF] font-bold text-[14px]">
                Previous
              </button>

              <div className="h-[40px] w-[40px] flex items-center justify-center border-r border-[#CFCFCF] bg-[#344E41] text-white font-bold text-[14px]">
                1
              </div>

              <div className="h-[40px] w-[40px] flex items-center justify-center border-r border-[#CFCFCF] font-bold text-[14px]">
                2
              </div>
              <div className="h-[40px] w-[40px] flex items-center justify-center border-r border-[#CFCFCF] font-bold text-[14px]">
                3
              </div>
              <div className="h-[40px] w-[40px] flex items-center justify-center border-r border-[#CFCFCF] font-bold text-[14px]">
                1
              </div>
              <div className="h-[40px] w-[40px] flex items-center justify-center border-r border-[#CFCFCF] font-bold text-[14px]">
                8
              </div>
              <div className="h-[40px] w-[40px] flex items-center justify-center border-r border-[#CFCFCF] font-bold text-[14px]">
                9
              </div>
              <div className="h-[40px] w-[40px] flex items-center justify-center border-r border-[#CFCFCF] font-bold text-[14px]">
                10
              </div>

              <button className="h-[40px] px-4 font-bold text-[14px]">
                Next
              </button>
            </div>
          </div>
        </section>

        {/* Modal */}
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