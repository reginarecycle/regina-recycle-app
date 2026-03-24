import * as React from "react";
import { cn } from "@/lib/utils";
import { CreditCard, Smartphone } from "lucide-react";
import { ModalFooter } from "../../components";
import type { PaymentMethod } from "@/lib/validation";

interface AddFundsPaymentStepProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  onBack: () => void;
  onContinue: () => void;
}

const PAYMENT_OPTIONS: Array<{
  key: NonNullable<PaymentMethod>;
  label: string;
  sub: string;
  icon: React.ReactNode;
}> = [
  {
    key: "card",
    label: "Credit/Debit Card",
    sub: "Instant transfer • Visa, Mastercard, Amex",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    key: "mobile",
    label: "Mobile Payment",
    sub: "Instant transfer • Apple Pay, Google Pay",
    icon: <Smartphone className="w-5 h-5" />,
  },
];

export const AddFundsPaymentStep: React.FC<AddFundsPaymentStepProps> = ({
  selected,
  onSelect,
  onBack,
  onContinue,
}) => (
  <div className="flex-1 flex flex-col">
    <div className="flex-1 px-6 py-5 flex flex-col gap-3">
      {PAYMENT_OPTIONS.map(({ key, label, sub, icon }) => {
        const isSelected = selected === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={cn(
              "flex items-center gap-4 px-4 py-4 rounded-xl border transition-all text-left w-full",
              isSelected ? "border-primary bg-light-green" : "border-border bg-white hover:bg-gray-50"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
              isSelected ? "bg-primary text-primary-foreground" : "bg-gray-100 text-foreground"
            )}>
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-foreground text-sm">{label}</div>
              <div className="text-xs text-muted-foreground">{sub}</div>
            </div>
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
              isSelected ? "border-primary" : "border-gray-300"
            )}>
              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
            </div>
          </button>
        );
      })}
    </div>

    <ModalFooter onBack={onBack} onContinue={onContinue} continueDisabled={!selected} />
  </div>
);
