import type { WithdrawBankFormValues } from "@/lib/validation";
import * as React from "react";
import { ModalFooter } from "../../shared";

interface WithdrawReviewStepProps {
  amount: number;
  bankData: WithdrawBankFormValues;
  onBack: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}

export const WithdrawReviewStep: React.FC<WithdrawReviewStepProps> = ({
  amount,
  bankData,
  onBack,
  onConfirm,
  isPending = false,
}) => (
  <div className="flex-1 flex flex-col">
    <div className="flex-1 px-6 py-5">
      <div className="rounded-xl border border-border bg-gray-50 p-5 flex flex-col gap-4">

        {/* Withdrawal Details */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Withdrawal Details
          </span>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-bold text-foreground">${amount.toFixed(2)} CAD</span>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Bank Account */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Bank Account
          </span>
          {[
            { label: "Account Holder:", value: bankData.accountHolder },
            { label: "Bank:",           value: bankData.bankName       },
            { label: "Account:",        value: bankData.accountNumber  },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-semibold text-foreground">{value}</span>
            </div>
          ))}
        </div>

        <div className="h-px bg-border" />

        {/* Fees */}
        {[
          { label: "Withdrawal Amount:", value: `$${amount.toFixed(2)}` },
          { label: "Processing Fee:",    value: "$0.00"                 },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-semibold text-foreground">{value}</span>
          </div>
        ))}

        <div className="h-px bg-border" />

        <div className="flex items-center justify-between">
          <span className="font-bold text-foreground">Total Deduction:</span>
          <span className="font-bold text-destructive text-lg">-${amount.toFixed(2)}</span>
        </div>
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