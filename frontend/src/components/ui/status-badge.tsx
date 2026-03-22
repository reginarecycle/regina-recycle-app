import { cn } from "@/lib/utils";

// ── Variant styles ─────────────────────────────────────────────────────────────
type BadgeVariant =
  | "COMPLETED" | "APPROVED" | "SUCCESS" | "CREDIT"
  | "PENDING"   | "PROCESSING" | "IN_PROGRESS" | "UPCOMING"
  | "CANCELLED" | "REJECTED"  | "FAILED" | "WITHDRAWAL"
  | "ACTIVE"    | "INACTIVE"
  | string; // fallback for unknown values

function getVariantClasses(status: string): { className: string; label: string } {
  switch (status.toUpperCase()) {
    case "COMPLETED":
    case "APPROVED":
    case "SUCCESS":
    case "CREDIT":
      return { 
        label: status.charAt(0) + status.slice(1).toLowerCase(), 
        className: "bg-green-100 text-green-700 border border-green-200" 
      };

    case "PENDING":
    case "PROCESSING":
    case "IN_PROGRESS":
      return { 
        label: status.charAt(0) + status.slice(1).toLowerCase().replace("_", " "), 
        className: "bg-yellow-100 text-yellow-600 border border-yellow-200" 
      };

    case "UPCOMING":
      return { 
        label: "Upcoming", 
        className: "bg-blue-100 text-blue-600 border border-blue-200" 
      };

    case "CANCELLED":
    case "REJECTED":
    case "FAILED":
    case "WITHDRAWAL":
      return { 
        label: status.charAt(0) + status.slice(1).toLowerCase(), 
        className: "bg-red-100 text-red-700 border border-red-200" 
      };

    case "ACTIVE":
      return { 
        label: "Active", 
        className: "bg-primary/10 text-primary border border-primary/20" 
      };

    case "INACTIVE":
      return { 
        label: "Inactive", 
        className: "bg-muted text-muted-foreground border border-border" 
      };

    default:
      return { 
        label: status, 
        className: "bg-muted text-muted-foreground border border-border" 
      };
  }
}

// ── Props ──────────────────────────────────────────────────────────────────────

interface StatusBadgeProps {
  /** Any status string — casing is normalised internally */
  status: BadgeVariant;
  /** Override the displayed label */
  label?: string;
  className?: string;
}

// ── Component ──────────────────────────────────────────────────────────────────

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const variant = getVariantClasses(status);
  return (
    <span
      className={cn(
        "inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap",
        variant.className,
        className
      )}
    >
      {label ?? variant.label}
    </span>
  );
}
export function getAmountColor(status: string): string {
  switch (status.toUpperCase()) {
    case "CREDIT":     return "#12B76A";
    case "WITHDRAWAL": return "#F79009";
    case "FAILED":     return "#F04438";
    default:           return "#0C111D";
  }
}