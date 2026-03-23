import { cn } from "@/lib/utils";

export interface PillTabOption<T extends string = string> {
  key: T;
  label: string;
  icon?: string;
}

interface PillTabsProps<T extends string = string> {
  options: PillTabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function PillTabs<T extends string = string>({ options, value, onChange, className }: PillTabsProps<T>) {
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-lg bg-muted p-1", className)}>
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            value === opt.key
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {opt.icon && <span className="text-xs font-bold">{opt.icon}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  );
}