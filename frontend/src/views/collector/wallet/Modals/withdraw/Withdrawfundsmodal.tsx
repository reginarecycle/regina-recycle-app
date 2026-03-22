import * as React from "react";
import { useState } from "react";
import { WithdrawAmountStep } from "./Withdrawamountstep";
import { WithdrawBankStep } from "./Withdrawbankstep";
import { WithdrawReviewStep } from "./Withdrawreviewstep";
import { ModalShell, StepIndicator, SuccessScreen } from "../../shared";
import type { WithdrawBankFormValues } from "@/lib/validation";

interface WithdrawFundsModalProps {
  open: boolean;
  onClose: () => void;
  availableBalance: number;
}

export const WithdrawFundsModal: React.FC<WithdrawFundsModalProps> = ({
  open,
  onClose,
  availableBalance,
}) => {
  const [step, setStep]     = useState(1);
  const [amount, setAmount] = useState<number | null>(null);
  const [bankData, setBankData] = useState<WithdrawBankFormValues>({
    accountHolder: "",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
  });

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setAmount(null);
      setBankData({ accountHolder: "", bankName: "", accountNumber: "", routingNumber: "" });
    }, 300);
  };

  const subtitles: Record<number, string> = {
    1: "Enter the amount you want to withdraw",
    2: "Enter your bank account details",
    3: "Review and confirm withdrawal",
    4: "Withdrawal successful",
  };

  const isSuccess    = step === 4;
  const stepperStep  = Math.min(step, 3);
  const totalSteps   = 3;

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      title="Withdraw Funds"
      subtitle={subtitles[step] ?? ""}
    >
      {/* Stepper */}
      <div className="px-6 pt-5 shrink-0">
        <StepIndicator totalSteps={totalSteps} currentStep={stepperStep} />
      </div>
      <div className="h-px bg-border mt-4 shrink-0" />

      {/* Step 1 — Amount */}
      {step === 1 && (
        <WithdrawAmountStep
          defaultAmount={amount}
          availableBalance={availableBalance}
          onBack={handleClose}
          onContinue={(a) => { setAmount(a); setStep(2); }}
        />
      )}

      {/* Step 2 — Bank Details */}
      {step === 2 && (
        <WithdrawBankStep
          defaultValues={bankData}
          onBack={() => setStep(1)}
          onContinue={(data) => { setBankData(data); setStep(3); }}
        />
      )}

      {/* Step 3 — Review */}
      {step === 3 && (
        <WithdrawReviewStep
          amount={amount ?? 0}
          bankData={bankData}
          onBack={() => setStep(2)}
          onConfirm={() => setStep(4)}
        />
      )}

      {/* Step 4 — Success */}
      {isSuccess && (
        <SuccessScreen
          title="Withdrawal Successfully!"
          subtitle="Your account has been debited"
          onClose={handleClose}
        />
      )}
    </ModalShell>
  );
};