import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ModalFooterProps {
  onBack?: () => void;
  onContinue: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
}

export function ModalFooter({ onBack, onContinue, continueLabel = "Continue", continueDisabled = false }: ModalFooterProps) {
  return (
    <div className="flex items-center gap-3 px-6 py-5 border-t border-border mt-auto">
      {onBack && (
        <Button variant="outline" className="flex-1 h-12 font-semibold" onClick={onBack}>
          Back
        </Button>
      )}
      <Button
        className={cn("h-12 font-semibold", onBack ? "flex-1" : "w-full")}
        onClick={onContinue}
        disabled={continueDisabled}
      >
        {continueLabel}
      </Button>
    </div>
  );
}
