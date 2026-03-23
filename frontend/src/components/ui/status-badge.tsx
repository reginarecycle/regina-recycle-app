import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  COMPLETED:   "bg-green-100 text-green-700 border border-green-200",
  APPROVED:    "bg-green-100 text-green-700 border border-green-200",
  SUCCESS:     "bg-green-100 text-green-700 border border-green-200",
  CREDIT:      "bg-green-100 text-green-700 border border-green-200",
  ACTIVE:      "bg-primary/10 text-primary border border-primary/20",
  PENDING:     "bg-yellow-100 text-yellow-600 border border-yellow-200",
  PROCESSING:  "bg-yellow-100 text-yellow-600 border border-yellow-200",
  IN_PROGRESS: "bg-yellow-100 text-yellow-600 border border-yellow-200",
  UPCOMING:    "bg-blue-100 text-blue-600 border border-blue-200",
  WITHDRAWAL:  "bg-[#DBEAFE] text-[#1E40AF] border border-[#DBEAFE]",
  CANCELLED:   "bg-red-100 text-red-700 border border-red-200",
  REJECTED:    "bg-red-100 text-red-700 border border-red-200",
  FAILED:      "bg-red-100 text-red-700 border border-red-200",
  INACTIVE:    "bg-muted text-muted-foreground border border-border",
};

export function StatusBadge({ status, label, className }: { status: string; label?: string; className?: string }) {
  const key = status.toUpperCase();
  const style = STYLES[key] ?? "bg-muted text-muted-foreground border border-border";
  const text = label ?? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace(/_/g, " ");

  return (
    <span className={cn("inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap", style, className)}>
      {text}
    </span>
  );
}

export function getAmountColor(status: string): string {
  const map: Record<string, string> = {
    CREDIT:     "#166534",
    WITHDRAWAL: "#1E40AF",
    FAILED:     "#F04438",
  };
  return map[status.toUpperCase()] ?? "#0C111D";
}
