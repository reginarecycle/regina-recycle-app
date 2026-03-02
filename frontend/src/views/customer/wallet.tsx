import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Routes } from "@/routes/routes";
import WithdrawModal from "@/components/modals/withdrawmodal";

import TransactionDetailsModal from "@/components/modals/transactiondetailmodal";
import type { TransactionDetails } from "@/components/modals/transactiondetailmodal";

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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M2.06153 12.3484C1.97819 12.1238 1.97819 11.8769 2.06153 11.6524C2.87323 9.68421 4.25104 8.0014 6.0203 6.81726C7.78955 5.63312 9.87057 5.00098 11.9995 5.00098C14.1285 5.00098 16.2095 5.63312 17.9788 6.81726C19.748 8.0014 21.1258 9.68421 21.9375 11.6524C22.0209 11.8769 22.0209 12.1238 21.9375 12.3484C21.1258 14.3165 19.748 15.9993 17.9788 17.1835C16.2095 18.3676 14.1285 18.9997 11.9995 18.9997C9.87057 18.9997 7.78955 18.3676 6.0203 17.1835C4.25104 15.9993 2.87323 14.3165 2.06153 12.3484Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
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

              <button
                type="button"
                className="
                  inline-flex items-center justify-center gap-2
                  w-[255px] h-[52px]
                  px-4 py-2
                  rounded-[8px]
                  border border-[#344E41]
                  bg-white
                  text-[#344E41]
                  text-[16px] font-bold leading-[24px]
                  hover:bg-gray-50 active:scale-[0.99]
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
              </button>
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
            <div className="mb-2 flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-semibold leading-[28px] text-black">
                  Earnings Overview
                </h2>
                <p className="text-[14px] font-medium leading-[20px] text-[#999CA0]">
                  Monthly rewards income (2026)
                </p>
              </div>

              <div
                className="
                  inline-flex items-center gap-2
                  h-[32px]
                  rounded-[4px]
                  bg-[rgba(52,78,65,0.08)]
                  p-[4px]
                "
              >
                <button
                  type="button"
                  className="
                    h-[28px]
                    rounded-[4px]
                    bg-[#344E41]
                    px-3 py-[5px]
                    text-white
                    text-[14px] font-medium leading-[20px]
                  "
                >
                  Monthly
                </button>

                <button
                  type="button"
                  className="
                    h-[28px]
                    rounded-[4px]
                    bg-transparent
                    px-3 py-[5px]
                    text-black
                    text-[14px] font-medium leading-[20px]
                  "
                >
                  Yearly
                </button>
              </div>
            </div>

            <div className="mt-3 p-4">
              <div className="relative h-[220px] w-full">
                <div className="absolute inset-0 flex flex-col justify-between">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-px bg-[#CFCFCF]" />
                  ))}
                </div>

                <div className="absolute bottom-0 left-0 right-0 px-2">
                  <div className="grid grid-cols-12 items-end gap-0">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const isFeb = i === 1;
                      const isApr = i === 3;

                      return (
                        <div key={i} className="flex items-end justify-center">
                          {isFeb && (
                            <div className="h-[193px] w-[94px] rounded bg-[rgba(52,78,65,0.6)] backdrop-blur-[2px]" />
                          )}
                          {isApr && (
                            <div className="h-[129px] w-[94px] rounded bg-[rgba(52,78,65,0.6)] backdrop-blur-[2px]" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-12 px-2 text-[14px] font-medium leading-[20px] text-black">
                {[
                  "JAN",
                  "FEB",
                  "MAR",
                  "APR",
                  "MAY",
                  "JUN",
                  "JUL",
                  "AUG",
                  "SEPT",
                  "OCT",
                  "NOV",
                  "DEC",
                ].map((m) => (
                  <div key={m} className="text-center">
                    {m}
                  </div>
                ))}
              </div>
            </div>
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
              <div
                className="
                  grid grid-cols-[175px_136px_295px_181px_205px]
                  items-center
                  h-[44px]
                  px-[24px]
                  text-[14px] font-bold leading-[20px]
                  text-[#999CA0]
                  border-b border-[#CFCFCF]
                  bg-white
                "
              >
                <div>Date</div>
                <div>Status</div>
                <div>Description</div>
                <div>Amount (CAD)</div>
                <div>Action</div>
              </div>

              {RECENT_TX.map((r) => (
                <div
                  key={r.id}
                  className="
                    grid grid-cols-[175px_136px_295px_181px_205px]
                    items-center
                    h-[56px]
                    px-[24px]
                    border-b border-[#CFCFCF]
                    bg-white
                    last:border-b-0
                  "
                >
                  <div className="text-[14px] font-bold leading-[20px] text-[#0C111D]">
                    {r.date}
                  </div>

                  <div>
                    <span
                      className="inline-flex items-center justify-center rounded-[34px] px-[8px] py-[0px]"
                      style={{ background: r.badgeBg }}
                    >
                      <span
                        className="text-[10px] font-bold leading-[18px] uppercase"
                        style={{ color: r.badgeText }}
                      >
                        {r.status}
                      </span>
                    </span>
                  </div>

                  <div className="text-[14px] font-bold leading-[20px] text-[#0C111D]">
                    {r.desc}
                  </div>

                  <div
                    className="text-[14px] font-bold leading-[20px]"
                    style={{ color: r.amountColor }}
                  >
                    {r.amount}
                  </div>

                  <div className="flex items-start">
                    <button
                      type="button"
                      className="text-[14px] font-bold leading-[20px] text-[#0C111D]"
                      onClick={() => handleWalletViewMore(r)}
                    >
                      View More
                    </button>
                  </div>
                </div>
              ))}
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