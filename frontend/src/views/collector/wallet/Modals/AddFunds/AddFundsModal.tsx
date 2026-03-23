import type { AddFundsCardFormValues, PaymentMethod } from "@/lib/validation";
import * as React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { ModalShell, StepIndicator, SuccessScreen } from "../../components";
import { AddFundsAmountStep } from "./AddFundsAmountStep";
import { AddFundsPaymentStep } from "./AddFundsPaymentStep";
import { AddFundsCardStep } from "./AddFundsCardStep";
import { AddFundsMobileStep } from "./AddFundsMobileStep";
import { AddFundsReviewStep } from "./AddFundsReviewStep";
import { useTopUp } from "@/api-hooks/useWallet";

interface AddFundsModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddFundsModal: React.FC<AddFundsModalProps> = ({ open, onClose }) => {
  const [step, setStep]                   = useState(1);
  const [amount, setAmount]               = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [cardData, setCardData]           = useState<Partial<AddFundsCardFormValues>>({});

  const { mutateAsync: topUp, isPending } = useTopUp();

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setAmount(null);
      setPaymentMethod(null);
      setCardData({});
    }, 300);
  };

  const handleConfirm = async () => {
    try {
      if (paymentMethod === "card" && cardData) {
        // Parse expiry MM/YY → expMonth, expYear
        const [mm, yy] = (cardData.expiry ?? "").split("/");
        await topUp({
          amount: amount ?? 0,
          paymentType: "CARD",
          cardLast4: (cardData.cardNumber ?? "").replace(/\s/g, "").slice(-4),
          cardBrand: "Visa", // card brand detection can be added later
          expMonth: parseInt(mm ?? "0"),
          expYear: parseInt(`20${yy ?? "00"}`),
        });
      } else {
        await topUp({
          amount: amount ?? 0,
          paymentType: "MOBILE_PAYMENT",
          mobileProvider: "Mobile Pay",
        });
      }
      setStep(5);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to add funds. Please try again.");
    }
  };

  const subtitles: Record<number, string> = {
    1: "Enter the amount you want to add",
    2: "Choose your payment method",
    3: paymentMethod === "card" ? "Enter payment details" : "Review and confirm",
    4: "Review and confirm",
    5: "Payment successful",
  };

  const isSuccess  = step === 5;
  const totalSteps = 4;
  const stepperStep = Math.min(step, totalSteps);

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      title="Add Funds"
      subtitle={subtitles[step] ?? ""}
    >
      <div className="px-6 pt-5 shrink-0">
        <StepIndicator totalSteps={totalSteps} currentStep={stepperStep} />
      </div>
      <div className="h-px bg-border mt-4 shrink-0" />

      {step === 1 && (
        <AddFundsAmountStep
          defaultAmount={amount}
          onBack={handleClose}
          onContinue={(a) => { setAmount(a); setStep(2); }}
        />
      )}

      {step === 2 && (
        <AddFundsPaymentStep
          selected={paymentMethod}
          onSelect={setPaymentMethod}
          onBack={() => setStep(1)}
          onContinue={() => setStep(3)}
        />
      )}

      {step === 3 && paymentMethod === "card" && (
        <AddFundsCardStep
          defaultValues={cardData}
          onBack={() => setStep(2)}
          onContinue={(data) => { setCardData(data); setStep(4); }}
        />
      )}

      {step === 3 && paymentMethod === "mobile" && (
        <AddFundsMobileStep
          onBack={() => setStep(2)}
          onContinue={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <AddFundsReviewStep
          amount={amount ?? 0}
          paymentMethod={paymentMethod}
          onBack={() => setStep(3)}
          onConfirm={handleConfirm}
          isPending={isPending}
        />
      )}

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