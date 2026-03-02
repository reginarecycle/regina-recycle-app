import React from "react";

type WithdrawModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function WithdrawModal({
  isOpen,
  onClose,
}: WithdrawModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[4px]"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className="
          relative z-10
          w-[562px] max-h-[90vh]
          rounded-[8px]
          border border-[#CFCFCF]
         bg-white
    px-6 py-5
    flex flex-col
    overflow-hidden
  "
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[20px] font-bold text-black">
            Withdraw Funds
          </h2>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="
              w-[30px] h-[30px]
              rounded-full
              flex items-center justify-center
              bg-[#F2F2F7]
              backdrop-blur-[27px]
            "
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M3 3L11 11M11 3L3 11"
                stroke="#3C3C43"
                strokeOpacity="0.6"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto pr-2">
  <div className="flex flex-col gap-3">
          {/* Amount */}
          <div className="flex flex-col gap-1">
            <label className="text-[14px] font-semibold text-black">
              Amount <span className="text-[#DD1E1E]">*</span>
            </label>

            <input
              type="text"
              placeholder="Enter an amount"
              className="
                h-[48px]
                rounded-[8px]
                border border-[#CFCFCF]
                bg-[#F7F7F7]
                px-4
                text-[14px]
                outline-none
                focus:border-[#344E41]
              "
            />

            <span className="text-[12px] text-gray-500">
              Available: $245.50
            </span>
          </div>

          {/* Recipient Email */}
          <div className="flex flex-col gap-1">
            <label className="text-[14px] font-semibold text-black">
              Recipient Email <span className="text-[#DD1E1E]">*</span>
            </label>

            <input
              type="email"
              placeholder="Enter email"
              className="
                h-[48px]
                rounded-[8px]
                border border-[#CFCFCF]
                bg-[#F7F7F7]
                px-4
                text-[14px]
                outline-none
                focus:border-[#344E41]
              "
            />

            <span className="text-[12px] text-gray-500">
              They'll receive an email notification
            </span>
          </div>

          {/* Security Question */}
          <div className="flex flex-col gap-1">
            <label className="text-[14px] font-semibold text-black">
              Security Question
            </label>

            <input
              type="text"
              placeholder="Enter a security question"
              className="
                h-[48px]
                rounded-[8px]
                border border-[#CFCFCF]
                bg-[#F7F7F7]
                px-4
                text-[14px]
                outline-none
                focus:border-[#344E41]
              "
            />
          </div>

          {/* Security Answer */}
          <div className="flex flex-col gap-1">
            <label className="text-[14px] font-semibold text-black">
              Security Answer
            </label>

            <input
              type="text"
              placeholder="Enter a security answer"
              className="
                h-[48px]
                rounded-[8px]
                border border-[#CFCFCF]
                bg-[#F7F7F7]
                px-4
                text-[14px]
                outline-none
                focus:border-[#344E41]
              "
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1">
            <label className="text-[14px] font-semibold text-black">
              Message (Optional)
            </label>

            <textarea
              placeholder="Narration..."
              className="
                h-[83px]
                rounded-[8px]
                border border-[#CFCFCF]
                bg-[#F7F7F7]
                px-4 py-3
                text-[14px]
                outline-none
                resize-none
                focus:border-[#344E41]
              "
            />
          </div>
        </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-6 flex justify-between gap-4">
          {/* Cancel */}
          <button
            onClick={onClose}
            className="
              w-[240px] h-[52px]
              rounded-[8px]
              border border-[#DD1E1E]
              text-[#DD1E1E]
              font-semibold
            "
          >
            Cancel
          </button>

          {/* Withdraw */}
          <button
            className="
              w-[240px] h-[52px]
              rounded-[8px]
              bg-[#344E41]
              text-white
              font-semibold
            "
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}