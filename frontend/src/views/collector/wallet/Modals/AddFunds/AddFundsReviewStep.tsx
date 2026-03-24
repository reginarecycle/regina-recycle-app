import * as React from "react";
import { Check } from "lucide-react";
import { formatAmount } from "@/lib/utils";
import { ModalFooter } from "../../components";
import type { PaymentMethod } from "@/lib/validation";

interface AddFundsReviewStepProps {
  amount: number;
  paymentMethod: PaymentMethod;
  onBack: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}

export const AddFundsReviewStep: React.FC<AddFundsReviewStepProps> = ({
  amount,
  paymentMethod,
  onBack,
  onConfirm,
  isPending = false,
}) => (
  <div className="flex-1 flex flex-col">
    <div className="flex-1 px-6 py-5 flex flex-col gap-4">
      <div className="rounded-xl bg-gray-50 border border-border p-5 flex flex-col gap-3">
        {[
          { label: "Amount:",         value: `$${formatAmount(amount)} CAD` },
          { label: "Payment Method:", value: paymentMethod === "card" ? "Credit/Debit Card" : "Mobile Payment" },
          { label: "Processing Fee:", value: "$0.00" },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-semibold text-foreground">{value}</span>
          </div>
        ))}
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between">
          <span className="font-bold text-foreground">Total:</span>
          <span className="font-bold text-green-600 text-lg">${formatAmount(amount)}</span>
        </div>
      </div>

      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-light-green">
        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0 mt-0.5">
          <Check className="w-3 h-3" />
        </div>
        <p className="text-sm text-foreground">
          By confirming, you authorize this transaction and agree to our terms and conditions.
        </p>
      </div>
    </div>

    <ModalFooter
      onBack={onBack}
      onContinue={onConfirm}
      continueLabel={isPending ? "Processing..." : "Confirm"}
      continueDisabled={isPending}
    />
  </div>
);