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
        <Button variant="outline" className="min-w-48 lg:min-w-56" onClick={onBack}>
          Back
        </Button>
      )}
      <Button
      className="min-w-48 lg:min-w-56"
        onClick={onContinue}
        disabled={continueDisabled}
      >
        {continueLabel}
      </Button>
    </div>
  );
}
