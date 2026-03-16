import { useState } from "react";

type WithdrawModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type FormErrors = {
  amount?: string;
  recipientEmail?: string;
};

const AVAILABLE_BALANCE = 245.5;

export default function WithdrawModal({
  isOpen,
  onClose,
}: WithdrawModalProps) {
  const [amount, setAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  if (!isOpen) return null;

  const resetForm = () => {
    setAmount("");
    setRecipientEmail("");
    setSecurityQuestion("");
    setSecurityAnswer("");
    setMessage("");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    const trimmedAmount = amount.trim();
    const trimmedEmail = recipientEmail.trim();

    if (!trimmedAmount) {
      newErrors.amount = "Amount is required.";
    } else {
      const numericAmount = Number(trimmedAmount);

      if (Number.isNaN(numericAmount)) {
        newErrors.amount = "Enter a valid amount.";
      } else if (numericAmount <= 0) {
        newErrors.amount = "Amount must be greater than 0.";
      } else if (numericAmount > AVAILABLE_BALANCE) {
        newErrors.amount = "Amount cannot exceed available balance.";
      }
    }

    if (!trimmedEmail) {
      newErrors.recipientEmail = "Recipient email is required.";
    } else if (!validateEmail(trimmedEmail)) {
      newErrors.recipientEmail = "Enter a valid email address.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[4px]"
        onClick={handleClose}
      />

      <div
        className="
          relative z-10
          w-full max-w-[562px]
          rounded-[8px]
          border border-border
          bg-white
          px-6 py-5
        "
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-foreground">
            Withdraw Funds
          </h2>

          <button
            type="button"
            onClick={handleClose}
            className="
              flex h-[30px] w-[30px]
              items-center justify-center
              rounded-full
              bg-[#F2F2F7]
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

        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-semibold text-foreground">
                Amount <span className="text-destructive">*</span>
              </label>

              <input
                type="text"
                placeholder="Enter an amount"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) {
                    setErrors((prev) => ({ ...prev, amount: undefined }));
                  }

                }}
                onBlur={() => {
                  const trimmed = amount.trim();
                  if (!trimmed) {
                    setErrors(prev => ({ ...prev, amount: "Amount is required." }));
                  } else if (isNaN(Number(trimmed))) {
                    setErrors(prev => ({ ...prev, amount: "Enter a valid amount." }));
                  } else if (Number(trimmed) <= 0) {
                    setErrors(prev => ({ ...prev, amount: "Amount must be greater than 0." }));
                  } else if (Number(trimmed) > AVAILABLE_BALANCE) {
                    setErrors(prev => ({ ...prev, amount: "Amount cannot exceed available balance." }));
                  }
                }}
                className={`
                  h-[48px]
                  rounded-[8px]
                  border
                  bg-card
                  px-4
                  text-[14px]
                  outline-none
                  focus:border-primary
                  ${errors.amount ? "border-red-500" : "border-border"}
                `}
              />

              <span className="text-[12px] text-muted-foreground">
                Available: ${AVAILABLE_BALANCE.toFixed(2)}
              </span>

              {errors.amount && (
                <p className="text-[12px] text-red-500">{errors.amount}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-semibold text-foreground">
                Recipient Email <span className="text-destructive">*</span>
              </label>

              <input
                type="email"
                placeholder="Enter email"
                value={recipientEmail}
                onChange={(e) => {
                  setRecipientEmail(e.target.value);
                  if (errors.recipientEmail) {
                    setErrors((prev) => ({
                      ...prev,
                      recipientEmail: undefined,
                    }));
                  }

                }}
                onBlur={() => {
                  const trimmed = recipientEmail.trim();
                  if (!trimmed) {
                    setErrors(prev => ({ ...prev, recipientEmail: "Recipient email is required." }));
                  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
                    setErrors(prev => ({ ...prev, recipientEmail: "Enter a valid email address." }));
                  }
                }}
                className={`
                  h-[48px]
                  rounded-[8px]
                  border
                  bg-card
                  px-4
                  text-[14px]
                  outline-none
                  focus:border-primary
                  ${errors.recipientEmail ? "border-red-500" : "border-border"
                  }
                `}
              />

              <span className="text-[12px] text-muted-foreground">
                They'll receive an email notification
              </span>

              {errors.recipientEmail && (
                <p className="text-[12px] text-red-500">
                  {errors.recipientEmail}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-semibold text-foreground">
                Security Question
              </label>

              <input
                type="text"
                placeholder="Enter a security question"
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
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
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
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
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="
                  h-[83px]
                  resize-none
                  rounded-[8px]
                  border border-border
                  bg-card
                  px-4 py-3
                  text-[14px]
                  outline-none
                  focus:border-primary
                "
              />
            </div>
          </div>

          <div className="mt-6 flex justify-between gap-4">
            <button
              type="button"
              onClick={handleClose}
              className="
                h-[52px] w-[240px]
                rounded-[8px]
                border border-destructive
                font-semibold
                text-destructive
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                h-[52px] w-[240px]
                rounded-[8px]
                bg-primary
                font-semibold
                text-white
              "
            >
              Withdraw
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}