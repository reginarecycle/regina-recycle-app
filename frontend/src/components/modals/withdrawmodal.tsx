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
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[4px]"
        onClick={onClose}
      />

      <div
        className="
          relative z-10
          w-[562px] max-h-[90vh]
          rounded-[8px]
          border border-border
          bg-white
          px-6 py-5
          flex flex-col
          overflow-hidden
        "
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-foreground">
            Withdraw Funds
          </h2>

          <button
            onClick={onClose}
            className="
              flex h-[30px] w-[30px]
              items-center justify-center
              rounded-full
              bg-[#F2F2F7]
              backdrop-blur-[27px]
            "
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-semibold text-foreground">
                Amount <span className="text-destructive">*</span>
              </label>

              <input
                type="text"
                placeholder="Enter an amount"
                className="
                  h-[48px]
                  rounded-[8px]
                  border border-border
                  bg-card
                  px-4
                  text-[14px]
                  outline-none
                  focus:border-primary
                "
              />

              <span className="text-[12px] text-muted-foreground">
                Available: $245.50
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-semibold text-foreground">
                Recipient Email <span className="text-destructive">*</span>
              </label>

              <input
                type="email"
                placeholder="Enter email"
                className="
                  h-[48px]
                  rounded-[8px]
                  border border-border
                  bg-card
                  px-4
                  text-[14px]
                  outline-none
                  focus:border-primary
                "
              />

              <span className="text-[12px] text-muted-foreground">
                They'll receive an email notification
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-semibold text-foreground">
                Security Question
              </label>

              <input
                type="text"
                placeholder="Enter a security question"
                className="
                  h-[48px]
                  rounded-[8px]
                  border border-border
                  bg-card
                  px-4
                  text-[14px]
                  outline-none
                  focus:border-primary
                "
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-semibold text-foreground">
                Security Answer
              </label>

              <input
                type="text"
                placeholder="Enter a security answer"
                className="
                  h-[48px]
                  rounded-[8px]
                  border border-border
                  bg-card
                  px-4
                  text-[14px]
                  outline-none
                  focus:border-primary
                "
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-semibold text-foreground">
                Message (Optional)
              </label>

              <textarea
                placeholder="Narration..."
                className="
                  h-[83px]
                  rounded-[8px]
                  border border-border
                  bg-card
                  px-4 py-3
                  text-[14px]
                  outline-none
                  resize-none
                  focus:border-primary
                "
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between gap-4">
          <button
            onClick={onClose}
            className="
              h-[52px] w-[240px]
              rounded-[8px]
              border border-destructive
              text-destructive
              font-semibold
            "
          >
            Cancel
          </button>

          <button
            className="
              h-[52px] w-[240px]
              rounded-[8px]
              bg-primary
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