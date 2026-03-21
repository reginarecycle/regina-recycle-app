import type { AddFundsCardFormValues, PaymentMethod } from "@/lib/validation";
import * as React from "react";
import { useState } from "react";
import { ModalShell, StepIndicator, SuccessScreen } from "../../shared";
import { AddFundsAmountStep } from "./AddFundsAmountStep";
import { AddFundsPaymentStep } from "./AddFundsPaymentStep";
import { AddFundsCardStep } from "./AddFundsCardStep";
import { AddFundsMobileStep } from "./AddFundsMobileStep";
import { AddFundsReviewStep } from "./AddFundsReviewStep";

interface AddFundsModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddFundsModal: React.FC<AddFundsModalProps> = ({ open, onClose }) => {
  const [step, setStep]                   = useState(1);
  const [amount, setAmount]               = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [cardData, setCardData]           = useState<Partial<AddFundsCardFormValues>>({});

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setAmount(null);
      setPaymentMethod(null);
      setCardData({});
    }, 300);
  };

  const subtitles: Record<number, string> = {
    1: "Enter the amount you want to add",
    2: "Choose your payment method",
    3: paymentMethod === "card" ? "Enter payment details" : "Review and confirm",
    4: "Review and confirm",
    5: "Payment successful",
  };

  const isSuccess   = step === 5;
  const totalSteps  = 4;
  const stepperStep = Math.min(step, totalSteps);

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      title="Add Funds"
      subtitle={subtitles[step] ?? ""}
    >
      {/* Stepper */}
      <div className="px-6 pt-5 shrink-0">
        <StepIndicator totalSteps={totalSteps} currentStep={stepperStep} />
      </div>
      <div className="h-px bg-border mt-4 shrink-0" />

      {/* Step 1 — Amount */}
      {step === 1 && (
        <AddFundsAmountStep
          defaultAmount={amount}
          onBack={handleClose}
          onContinue={(a) => { setAmount(a); setStep(2); }}
        />
      )}

      {/* Step 2 — Payment Method */}
      {step === 2 && (
        <AddFundsPaymentStep
          selected={paymentMethod}
          onSelect={setPaymentMethod}
          onBack={() => setStep(1)}
          onContinue={() => setStep(3)}
        />
      )}

      {/* Step 3 — Card Details */}
      {step === 3 && paymentMethod === "card" && (
        <AddFundsCardStep
          defaultValues={cardData}
          onBack={() => setStep(2)}
          onContinue={(data) => { setCardData(data); setStep(4); }}
        />
      )}

      {/* Step 3 — Mobile Ready */}
      {step === 3 && paymentMethod === "mobile" && (
        <AddFundsMobileStep
          onBack={() => setStep(2)}
          onContinue={() => setStep(4)}
        />
      )}

      {/* Step 4 — Review & Confirm */}
      {step === 4 && (
        <AddFundsReviewStep
          amount={amount ?? 0}
          paymentMethod={paymentMethod}
          onBack={() => setStep(3)}
          onConfirm={() => setStep(5)}
        />
      )}

      {/* Step 5 — Success */}
      {isSuccess && (
        <SuccessScreen
          title="Funds Added Successfully!"
          subtitle="Your wallet has been updated"
          onClose={handleClose}
        />
      )}
    </ModalShell>
  );
};
