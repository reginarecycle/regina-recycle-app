import * as React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { WithdrawAmountStep } from "./Withdrawamountstep";
import { WithdrawBankStep } from "./Withdrawbankstep";
import { WithdrawReviewStep } from "./Withdrawreviewstep";
import { ModalShell, StepIndicator, SuccessScreen } from "../../components";
import type { WithdrawBankFormValues } from "@/lib/validation";
import { useCollectorWithdraw } from "@/api-hooks/useWallet";

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
    transitNumber: "",
    institutionNumber: "",
  });

  const { mutateAsync: withdraw, isPending } = useCollectorWithdraw();

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setAmount(null);
      setBankData({ accountHolder: "", bankName: "", accountNumber: "", transitNumber: "", institutionNumber: "" });
    }, 300);
  };

  const handleConfirm = async () => {
    try {
      await withdraw({
        accountHolderName: bankData.accountHolder,
        bankName: bankData.bankName,
        accountNumber: bankData.accountNumber,
        routingNumber: bankData.transitNumber,
        institutionNumber: bankData.institutionNumber,
        amount: amount ?? 0,
      });
      setStep(4);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to process withdrawal. Please try again.");
    }
  };

  const subtitles: Record<number, string> = {
    1: "Enter the amount you want to withdraw",
    2: "Enter your bank account details",
    3: "Review and confirm withdrawal",
    4: "Withdrawal successful",
  };

  const isSuccess   = step === 4;
  const stepperStep = Math.min(step, 3);
  const totalSteps  = 3;

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      title="Withdraw Funds"
      subtitle={subtitles[step] ?? ""}
    >
      <div className="px-6 pt-5 shrink-0">
        <StepIndicator totalSteps={totalSteps} currentStep={stepperStep} />
      </div>
      <div className="h-px bg-border mt-4 shrink-0" />

      {step === 1 && (
        <WithdrawAmountStep
          defaultAmount={amount}
          availableBalance={availableBalance}
          onBack={handleClose}
          onContinue={(a) => { setAmount(a); setStep(2); }}
        />
      )}

      {step === 2 && (
        <WithdrawBankStep
          defaultValues={bankData}
          onBack={() => setStep(1)}
          onContinue={(data) => { setBankData(data); setStep(3); }}
        />
      )}

      {step === 3 && (
        <WithdrawReviewStep
          amount={amount ?? 0}
          bankData={bankData}
          onBack={() => setStep(2)}
          onConfirm={handleConfirm}
          isPending={isPending}
        />
      )}

      {isSuccess && (
        <SuccessScreen
          title="Withdrawal Successful!"
          subtitle="Your account has been debited"
          onClose={handleClose}
        />
      )}
    </ModalShell>
  );
};