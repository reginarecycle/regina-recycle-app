import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CreditCard, Smartphone, Check } from "lucide-react";
import {
  ModalShell,
  ModalFooter,
  StepIndicator,
  AmountInput,
  QuickAmountBtn,
  SuccessScreen,
  ModalInput,
} from "./shared";
import { QUICK_AMOUNTS } from "./constants";
import type { PaymentMethod } from "./types";

interface AddFundsModalProps {
  open: boolean;
  onClose: () => void;
}

// Focused card input: grey bg → white on focus/filled
interface CardInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}
const CardInput: React.FC<CardInputProps> = ({ value, onChange, placeholder, error }) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          "w-full px-4 py-3 rounded-xl border text-foreground outline-none transition-all text-sm",
          focused || value ? "border-primary bg-white" : "border-border bg-gray-50"
        )}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
};

export const AddFundsModal: React.FC<AddFundsModalProps> = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardNameError, setCardNameError] = useState("");
  const [cvvError, setCvvError] = useState("");

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1); setAmount(null); setPaymentMethod(null);
      setCardNumber(""); setCardName(""); setExpiry(""); setCvv("");
      setCardNameError(""); setCvvError("");
    }, 300);
  };

  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const handleCardName = (v: string) => {
    const cleaned = v.replace(/[0-9]/g, "");
    setCardName(cleaned);
    setCardNameError(v !== cleaned ? "Card name cannot contain numbers" : "");
  };

  const handleCvv = (v: string) => {
    const cleaned = v.replace(/\D/g, "").slice(0, 3);
    setCvv(cleaned);
    setCvvError(cleaned.length > 0 && cleaned.length < 3 ? "CVV must be exactly 3 digits" : "");
  };

  const cardFieldsFilled =
    cardNumber.replace(/\s/g, "").length === 16 &&
    cardName.trim().length >= 2 &&
    !cardNameError &&
    expiry.length === 5 &&
    cvv.length === 3 &&
    !cvvError;

  const continueDisabled =
    (step === 1 && (!amount || amount <= 0)) ||
    (step === 2 && !paymentMethod) ||
    (step === 3 && paymentMethod === "card" && !cardFieldsFilled);

  const subtitles: Record<number, string> = {
    1: "Enter the amount you want to add",
    2: "Choose your payment method",
    3: paymentMethod === "card" ? "Enter payment details" : "Review and confirm",
    4: "Review and confirm",
    5: "Payment successful",
  };

  const isSuccess = step === 5;
  const stepperStep = Math.min(step, 4);

  return (
    <ModalShell open={open} onClose={handleClose} title="Add Funds" subtitle={subtitles[step] ?? ""}>
      <div className="px-6 pt-5 shrink-0">
        <StepIndicator totalSteps={4} currentStep={stepperStep} />
      </div>
      <div className="h-px bg-border mt-4 shrink-0" />

      {/* Step 1 — Amount */}
      {step === 1 && (
        <div className="flex-1 px-6 py-5 flex flex-col gap-5">
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Enter Amount (CAD)</label>
            <AmountInput value={amount} onChange={setAmount} />
          </div>
          <div>
            <label className="text-sm font-semibold text-foreground mb-3 block">Quick Amounts</label>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_AMOUNTS.map((a) => (
                <QuickAmountBtn key={a} amount={a} selected={amount === a} onClick={() => setAmount(a)} />
              ))}
            </div>
          </div>
          {amount != null && amount > 0 && (
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-light-green">
              <span className="text-sm text-foreground">Amount to add:</span>
              <span className="text-base font-bold text-green-600">${amount.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}

      {/* Step 2 — Payment Method */}
      {step === 2 && (
        <div className="flex-1 px-6 py-5 flex flex-col gap-3">
          {([
            { key: "card" as PaymentMethod, label: "Credit/Debit Card", sub: "Instant transfer • Visa, Mastercard, Amex", icon: <CreditCard className="w-5 h-5" /> },
            { key: "mobile" as PaymentMethod, label: "Mobile Payment", sub: "Instant transfer • Apple Pay, Google Pay", icon: <Smartphone className="w-5 h-5" /> },
          ] as Array<{ key: PaymentMethod; label: string; sub: string; icon: React.ReactNode }>).map(({ key, label, sub, icon }) => {
            const selected = paymentMethod === key;
            return (
              <button key={key!} onClick={() => setPaymentMethod(key)}
                className={cn("flex items-center gap-4 px-4 py-4 rounded-xl border transition-all text-left w-full",
                  selected ? "border-primary bg-light-green" : "border-border bg-white hover:bg-gray-50")}>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  selected ? "bg-primary text-primary-foreground" : "bg-gray-100 text-foreground")}>
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground text-sm">{label}</div>
                  <div className="text-xs text-muted-foreground">{sub}</div>
                </div>
                <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                  selected ? "border-primary" : "border-gray-300")}>
                  {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Step 3 — Card Details */}
      {step === 3 && paymentMethod === "card" && (
        <div className="flex-1 px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-foreground mb-1.5 block">Card Number</label>
            <CardInput value={cardNumber} onChange={(v) => setCardNumber(formatCardNumber(v))} placeholder="1234 5678 9012 3456" />
          </div>
          <ModalInput label="Card Name" value={cardName} onChange={handleCardName} placeholder="Jane Doe" error={cardNameError} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Expiry Date</label>
              <CardInput value={expiry} onChange={(v) => setExpiry(formatExpiry(v))} placeholder="07/26" />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">CVV</label>
              <CardInput value={cvv} onChange={handleCvv} placeholder="123" error={cvvError} />
            </div>
          </div>
        </div>
      )}

      {/* Step 3 — Mobile Ready */}
      {step === 3 && paymentMethod === "mobile" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-10">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <Smartphone className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Ready to Pay</h3>
          <p className="text-sm text-muted-foreground text-center">Click continue to complete payment with your mobile wallet</p>
        </div>
      )}

      {/* Step 4 — Review & Confirm */}
      {step === 4 && (
        <div className="flex-1 px-6 py-5 flex flex-col gap-4">
          <div className="rounded-xl bg-gray-50 border border-border p-5 flex flex-col gap-3">
            {[
              { label: "Amount:", value: `$${(amount ?? 0).toFixed(2)} CAD` },
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
              <span className="font-bold text-green-600 text-lg">${(amount ?? 0).toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-light-green">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0 mt-0.5">
              <Check className="w-3 h-3" />
            </div>
            <p className="text-sm text-foreground">By confirming, you authorize this transaction and agree to our terms and conditions.</p>
          </div>
        </div>
      )}

      {/* Step 5 — Success: no footer, no divider */}
      {isSuccess && (
        <SuccessScreen title="Funds Added Successfully!" subtitle="Your wallet has been updated" onClose={handleClose} />
      )}

      {/* Footer hidden on success */}
      {!isSuccess && (
        <ModalFooter
          onBack={step === 1 ? handleClose : () => setStep((s) => s - 1)}
          onContinue={() => setStep((s) => s + 1)}
          continueDisabled={continueDisabled}
        />
      )}
    </ModalShell>
  );
};