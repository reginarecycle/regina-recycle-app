import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Check, X } from "lucide-react";

// ─── Step Indicator ───────────────────────────────────────────────────────────

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ totalSteps, currentStep }) => (
  <div className="flex items-center w-full">
    {Array.from({ length: totalSteps }).map((_, i) => {
      const step = i + 1;
      const isCompleted = step < currentStep;
      const isCurrent = step === currentStep;
      return (
        <React.Fragment key={step}>
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-all duration-300",
              isCompleted && "bg-green-500 text-white",
              isCurrent && "bg-primary text-primary-foreground",
              !isCompleted && !isCurrent && "bg-gray-100 text-gray-400"
            )}
          >
            {isCompleted ? <Check className="w-3.5 h-3.5" /> : step}
          </div>
          {i < totalSteps - 1 && (
            <div
              className={cn(
                "flex-1 h-0.5 transition-all duration-300",
                step < currentStep ? "bg-green-500" : "bg-gray-200"
              )}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── Modal Shell ──────────────────────────────────────────────────────────────

interface ModalShellProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const ModalShell: React.FC<ModalShellProps> = ({
  open,
  onClose,
  title,
  subtitle,
  children,
}) => (
  <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
    <DialogContent className="p-0 gap-0 max-w-[480px] w-full rounded-2xl overflow-hidden border border-border [&>button]:hidden">
      {/* Header — fixed height so modal never shrinks */}
      <div className="flex items-start justify-between px-6 pt-6 pb-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors shrink-0 ml-4"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="h-px bg-border shrink-0" />
      {/* Body — min-height keeps modal size stable across steps */}
      <div className="flex flex-col min-h-[420px]">
        {children}
      </div>
    </DialogContent>
  </Dialog>
);

// ─── Modal Footer ─────────────────────────────────────────────────────────────

interface ModalFooterProps {
  onBack?: () => void;
  onContinue: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  onBack,
  onContinue,
  continueLabel = "Continue",
  continueDisabled = false,
}) => (
  <div className="flex items-center gap-3 px-6 py-5 border-t border-border mt-auto">
    {onBack && (
      <Button variant="outline" className="flex-1 h-12 font-semibold min-w-0" onClick={onBack}>
        Back
      </Button>
    )}
    <Button
      variant="default"
      className={cn("h-12 font-semibold min-w-0", onBack ? "flex-1" : "w-full")}
      onClick={onContinue}
      disabled={continueDisabled}
    >
      {continueLabel}
    </Button>
  </div>
);

// ─── Quick Amount Button ──────────────────────────────────────────────────────

interface QuickAmountBtnProps {
  amount: number;
  selected: boolean;
  onClick: () => void;
}

export const QuickAmountBtn: React.FC<QuickAmountBtnProps> = ({ amount, selected, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "rounded-xl py-4 text-sm font-semibold transition-all duration-150 border",
      selected
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-gray-50 text-foreground border-transparent hover:bg-gray-100"
    )}
  >
    ${amount.toLocaleString()}
  </button>
);

// ─── Amount Input ─────────────────────────────────────────────────────────────

interface AmountInputProps {
  value: number | null;
  onChange: (v: number | null) => void;
}

export const AmountInput: React.FC<AmountInputProps> = ({ value, onChange }) => {
  const [raw, setRaw] = React.useState(value != null ? value.toFixed(2) : "");
  const [focused, setFocused] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^0-9.]/g, "");
    setRaw(v);
    const parsed = parseFloat(v);
    onChange(isNaN(parsed) ? null : parsed);
  };

  React.useEffect(() => {
    if (value != null) setRaw(value.toFixed(2));
    else setRaw("");
  }, [value]);

  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-4 rounded-xl border transition-all",
      focused ? "border-primary bg-white" : "border-border bg-gray-50"
    )}>
      <span className="text-muted-foreground font-medium text-lg">$</span>
      <input
        type="text"
        inputMode="decimal"
        value={raw || ""}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="0.00"
        className="flex-1 bg-transparent outline-none text-2xl font-bold text-foreground placeholder:text-gray-300"
      />
    </div>
  );
};

// ─── Reusable Modal Input Field ───────────────────────────────────────────────

interface ModalInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}

export const ModalInput: React.FC<ModalInputProps> = ({ label, value, onChange, placeholder, error }) => {
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

// ─── Success Screen — no footer, just centred content ────────────────────────

interface SuccessScreenProps {
  title: string;
  subtitle: string;
  /** Called when user clicks the X to close — no Done button rendered */
  onClose: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ title, subtitle }) => (
  <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-12">
    <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
      <div className="w-14 h-14 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500">
        <Check className="w-8 h-8" />
      </div>
    </div>
    <h3 className="text-2xl font-bold text-foreground text-center">{title}</h3>
    <p className="text-sm text-muted-foreground text-center">{subtitle}</p>
  </div>
);
























































































