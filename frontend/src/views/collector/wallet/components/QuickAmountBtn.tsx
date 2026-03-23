import { cn } from "@/lib/utils";

interface QuickAmountBtnProps {
  amount: number;
  selected: boolean;
  onClick: () => void;
}

export function QuickAmountBtn({ amount, selected, onClick }: QuickAmountBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl py-4 text-sm font-semibold border transition-colors",
        selected
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-muted text-foreground border-transparent hover:bg-muted/80"
      )}
    >
      ${amount.toLocaleString()}
    </button>
  );
}
