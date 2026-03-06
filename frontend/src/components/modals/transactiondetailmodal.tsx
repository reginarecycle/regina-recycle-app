export type TxStatus = "CREDIT" | "WITHDRAWAL" | "FAILED";

export type TransactionDetails = {
  amount: string;
  currency: string;
  status: TxStatus;
  date: string;
  time: string;
  sender: string;
  receiver: string;
  fees: string;
  reference: string;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div
        className="text-[14px] font-medium leading-[20px]"
        style={{ color: "rgba(17, 24, 39, 0.75)" }}
      >
        {label}
      </div>
      <div className="text-[14px] font-medium leading-[20px] text-[#0C111D]">
        {value}
      </div>
    </div>
  );
}

export default function TransactionDetailsModal({
  open,
  onClose,
  details,
}: {
  open: boolean;
  onClose: () => void;
  details: TransactionDetails | null;
}) {
  if (!open || !details) return null;

  const statusStyles =
    details.status === "FAILED"
      ? {
          badgeBg: "#FEE2E2",
          badgeText: "#DC2626",
          summaryBg: "rgba(221, 30, 30, 0.06)",
          amountColor: "#DD1E1E",
          amountCardBg: "rgba(221, 30, 30, 0.06)", 
        }
      : details.status === "WITHDRAWAL"
      ? {
          badgeBg: "#DBEAFF",
          badgeText: "#1E40AF",
          summaryBg: "rgba(30, 64, 175, 0.06)",
          amountColor: "#1E40AF",
          amountCardBg: "#F7F7F7",
        }
      : {
          badgeBg: "#DCFCE7",
          badgeText: "#166534",
          summaryBg: "rgba(22, 101, 52, 0.06)",
          amountColor: "#166534",
          amountCardBg: "#F7F7F7",
        };

  return (
    <div className="fixed inset-0 z-[999]">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/20"
        aria-label="Close modal overlay"
      />

      <aside
        className="absolute right-0 top-0 h-full bg-white border-l border-[#CFCFCF] shadow-xl flex flex-col"
        style={{ width: 470 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7EB]">
          <div className="text-[18px] font-bold leading-[28px] text-black">
            Transaction Details
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center"
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              background: "#F2F2F7",
              backdropFilter: "blur(27.182817459106445px)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
            >
              <rect width="30" height="30" rx="15" fill="#F2F2F7" />
              <path
                d="M10.0493 19.1811C9.73828 19.4921 9.73193 20.0444 10.0557 20.3681C10.3857 20.6918 10.938 20.6855 11.2427 20.3808L15.0005 16.623L18.752 20.3745C19.0693 20.6918 19.6152 20.6918 19.939 20.3681C20.2627 20.038 20.2627 19.4985 19.9453 19.1811L16.1938 15.4296L19.9453 11.6718C20.2627 11.3544 20.269 10.8085 19.939 10.4848C19.6152 10.1611 19.0693 10.1611 18.752 10.4785L15.0005 14.2299L11.2427 10.4785C10.938 10.1674 10.3794 10.1547 10.0557 10.4848C9.73193 10.8085 9.73828 11.3671 10.0493 11.6718L13.8008 15.4296L10.0493 19.1811Z"
                fill="#3C3C43"
                fillOpacity="0.6"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 py-4 space-y-4">
          {/* Summary */}
          <div
            style={{
              borderRadius: 14,
              border: "1px solid #CFCFCF",
              background: statusStyles.summaryBg,
              backdropFilter: "blur(20px)",
              padding: 12,
            }}
          >
            <div className="flex items-center justify-between" style={{ height: 20 }}>
              <div
                className="text-[14px] font-medium leading-[20px]"
                style={{ color: "rgba(17, 24, 39, 0.75)" }}
              >
                Summary
              </div>

              <div
                className="flex items-center justify-center uppercase font-bold"
                style={{
                  width: 69,
                  height: 18,
                  borderRadius: 34,
                  background: statusStyles.badgeBg,
                  color: statusStyles.badgeText,
                  fontFamily: "Satoshi",
                  fontSize: 10,
                  lineHeight: "18px",
                }}
              >
                {details.status}
              </div>
            </div>

            <div
              className="mt-3 flex flex-col items-center justify-center"
              style={{
                height: 191,
                borderRadius: 14,
                border: "1px solid #CFCFCF",
                background: statusStyles.amountCardBg, 
              }}
            >
              <div className="text-[14px] font-medium leading-[20px] text-black">
                Amount
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <div
                  style={{
                    color: statusStyles.amountColor,
                    fontFamily: "Satoshi",
                    fontSize: 36,
                    fontWeight: 700,
                    lineHeight: "44px",
                  }}
                >
                  {details.amount}
                </div>
                <div
                  style={{
                    color: statusStyles.amountColor,
                    fontFamily: "Satoshi",
                    fontSize: 24,
                    fontWeight: 400,
                    lineHeight: "32px",
                  }}
                >
                  {details.currency}
                </div>
              </div>
            </div>
          </div>

          {/* History */}
          <div
            style={{
              borderRadius: 14,
              border: "1px solid #CFCFCF",
              background: "#F7F7F7",
              padding: "12px 17px",
            }}
          >
            <div style={{ height: 20 }}>
              <div
                className="text-[14px] font-medium leading-[20px]"
                style={{ color: "rgba(17, 24, 39, 0.75)" }}
              >
                History
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <Row label="Date" value={details.date} />
              <Row label="Time" value={details.time} />
              <Row label="Sender" value={details.sender} />
              <Row label="Our fees" value={details.fees} />
              <Row label="Receiver" value={details.receiver} />

              <div className="flex items-center justify-between">
                <div
                  className="text-[14px] font-medium leading-[20px]"
                  style={{ color: "rgba(17, 24, 39, 0.75)" }}
                >
                  Transaction Reference
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-[14px] font-medium leading-[20px] text-[#0C111D]">
                    {details.reference}
                  </div>

                  <button
                    type="button"
                    aria-label="Copy reference"
                    onClick={() => navigator.clipboard?.writeText(details.reference)}
                    className="flex items-center justify-center"
                    style={{ width: 16, height: 16 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M13.333 5.33301H6.66634C5.92996 5.33301 5.33301 5.92996 5.33301 6.66634V13.333C5.33301 14.0694 5.92996 14.6663 6.66634 14.6663H13.333C14.0694 14.6663 14.6663 14.0694 14.6663 13.333V6.66634C14.6663 5.92996 14.0694 5.33301 13.333 5.33301Z"
                        stroke="#344E41"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.66634 10.6663C1.93301 10.6663 1.33301 10.0663 1.33301 9.33301V2.66634C1.33301 1.93301 1.93301 1.33301 2.66634 1.33301H9.33301C10.0663 1.33301 10.6663 1.93301 10.6663 2.66634"
                        stroke="#344E41"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* footer */}
        <div
          className="px-6 flex items-center justify-between gap-4"
          style={{
            height: 100,
            borderTop: "1px solid #CFCFCF",
            background: "#F7F7F7",
          }}
        >
          <button
            type="button"
            className="font-bold"
            style={{
              width: 184,
              height: 52,
              borderRadius: 8,
              border: "1px solid #DD1E1E",
              color: "#DD1E1E",
              background: "transparent",
              fontSize: 16,
              lineHeight: "24px",
            }}
          >
            Dispute
          </button>

          <button
            type="button"
            className="font-bold"
            style={{
              width: 184,
              height: 52,
              borderRadius: 8,
              background: "#344E41",
              color: "#FFF",
              fontSize: 16,
              lineHeight: "24px",
            }}
            onClick={() => window.print()}
          >
            Print
          </button>
        </div>
      </aside>
    </div>
  );
}