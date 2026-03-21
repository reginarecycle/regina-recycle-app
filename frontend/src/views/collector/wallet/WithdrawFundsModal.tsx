import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Building2 } from "lucide-react";
import { ModalShell, ModalFooter, StepIndicator, AmountInput, QuickAmountBtn, SuccessScreen, ModalInput } from "./shared";
import { QUICK_AMOUNTS } from "./constants";

interface WithdrawFundsModalProps {
  open: boolean;
  onClose: () => void;
  availableBalance: number;
}

// Focused input: grey → white on focus/filled
interface BankInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}
const BankInput: React.FC<BankInputProps> = ({ label, value, onChange, placeholder, error }) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <div>
      <label className="text-sm font-semibold text-foreground mb-1.5 block">{label}</label>
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

export const WithdrawFundsModal: React.FC<WithdrawFundsModalProps> = ({ open, onClose, availableBalance }) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState<number | null>(null);
  const [accountHolder, setAccountHolder] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");

  // Errors
  const [accountHolderError, setAccountHolderError] = useState("");
  const [bankNameError, setBankNameError] = useState("");
  const [accountNumberError, setAccountNumberError] = useState("");
  const [routingNumberError, setRoutingNumberError] = useState("");

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1); setAmount(null);
      setAccountHolder(""); setBankName(""); setAccountNumber(""); setRoutingNumber("");
      setAccountHolderError(""); setBankNameError(""); setAccountNumberError(""); setRoutingNumberError("");
    }, 300);
  };

  // ── Field handlers ──────────────────────────────────────────────────────────

  const handleAccountHolder = (v: string) => {
    // No numbers allowed
    const cleaned = v.replace(/[0-9]/g, "");
    setAccountHolder(cleaned);
    setAccountHolderError(v !== cleaned ? "Account holder name cannot contain numbers" : "");
  };

  const handleBankName = (v: string) => {
    // No digits allowed
    const cleaned = v.replace(/[0-9]/g, "");
    setBankName(cleaned);
    setBankNameError(v !== cleaned ? "Bank name cannot contain numbers" : "");
  };

  const handleAccountNumber = (v: string) => {
    // Digits only
    const cleaned = v.replace(/\D/g, "");
    setAccountNumber(cleaned);
    setAccountNumberError(v !== cleaned ? "Account number must contain digits only" : "");
  };

  const handleRoutingNumber = (v: string) => {
    // Digits only
    const cleaned = v.replace(/\D/g, "");
    setRoutingNumber(cleaned);
    setRoutingNumberError(v !== cleaned ? "Routing number must contain digits only" : "");
  };

  // ── Validation ──────────────────────────────────────────────────────────────

  const bankFieldsValid =
    accountHolder.trim().length >= 2 && !accountHolderError &&
    bankName.trim().length >= 2 && !bankNameError &&
    accountNumber.trim().length >= 4 && !accountNumberError &&
    routingNumber.trim().length >= 4 && !routingNumberError;

  const continueDisabled =
    (step === 1 && (!amount || amount <= 0 || amount > availableBalance)) ||
    (step === 2 && !bankFieldsValid);

  const subtitles: Record<number, string> = {
    1: "Enter the amount you want to withdraw",
    2: "Enter your bank account details",
    3: "Review and confirm withdrawal",
    4: "Withdrawal successful",
  };

  const isSuccess = step === 4;
  const stepperStep = Math.min(step, 3);

  return (
    <ModalShell open={open} onClose={handleClose} title="Withdraw Funds" subtitle={subtitles[step] ?? ""}>
      <div className="px-6 pt-5 shrink-0">
        <StepIndicator totalSteps={3} currentStep={stepperStep} />
      </div>
      <div className="h-px bg-border mt-4 shrink-0" />

      {/* Step 1 — Amount */}
      {step === 1 && (
        <div className="flex-1 px-6 py-5 flex flex-col gap-5">
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Enter Amount (CAD)</label>
            <AmountInput value={amount} onChange={setAmount} />
            <p className="text-sm text-muted-foreground mt-2">
              Available Balance:{" "}
              <span className="font-semibold text-foreground">
                ${availableBalance.toLocaleString("en-CA", { minimumFractionDigits: 2 })}
              </span>
            </p>
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
            <div className="rounded-xl border border-border bg-gray-50 p-4 flex flex-col gap-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Withdrawal amount:</span>
                <span className="font-semibold text-foreground">${amount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Processing fee:</span>
                <span className="font-semibold text-foreground">$0.00</span>
              </div>
            </div>
          )}
          {amount != null && amount > availableBalance && (
            <p className="text-xs text-destructive">Amount exceeds available balance.</p>
          )}
        </div>
      )}

      {/* Step 2 — Bank Details */}
      {step === 2 && (
        <div className="flex-1 px-6 py-5 flex flex-col gap-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-foreground text-sm">Bank Account Details</div>
              <div className="text-xs text-muted-foreground">Enter your bank information for withdrawal</div>
            </div>
          </div>

          {/* Account Holder — no numbers */}
          <BankInput label="Account Holder Name" value={accountHolder} onChange={handleAccountHolder} placeholder="Jane Doe" error={accountHolderError} />

          {/* Bank Name — no digits */}
          <BankInput label="Bank Name" value={bankName} onChange={handleBankName} placeholder="TD Bank" error={bankNameError} />

          {/* Account Number — digits only */}
          <BankInput label="Account Number" value={accountNumber} onChange={handleAccountNumber} placeholder="Enter your account number" error={accountNumberError} />

          {/* Routing Number — digits only */}
          <BankInput label="Routing Number" value={routingNumber} onChange={handleRoutingNumber} placeholder="Enter routing number" error={routingNumberError} />
        </div>
      )}

      {/* Step 3 — Review */}
      {step === 3 && (
        <div className="flex-1 px-6 py-5 flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-gray-50 p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Withdrawal Details</span>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-bold text-foreground">${(amount ?? 0).toFixed(2)} CAD</span>
              </div>
            </div>
            <div className="h-px bg-border" />
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Bank Account</span>
              {[
                { label: "Account Holder:", value: accountHolder },
                { label: "Bank:", value: bankName },
                { label: "Account:", value: accountNumber },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold text-foreground">{value}</span>
                </div>
              ))}
            </div>
            <div className="h-px bg-border" />
            {[
              { label: "Withdrawal Amount:", value: `$${(amount ?? 0).toFixed(2)}` },
              { label: "Processing Fee:", value: "$0.00" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-semibold text-foreground">{value}</span>
              </div>
            ))}
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Total Deduction:</span>
              <span className="font-bold text-destructive text-lg">-${(amount ?? 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 4 — Success: no footer, no divider */}
      {isSuccess && (
        <SuccessScreen title="Withdrawal Successfully!" subtitle="Your account has been debited" onClose={handleClose} />
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