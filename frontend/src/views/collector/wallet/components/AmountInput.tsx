import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AmountInputProps {
  value: number | null;
  onChange: (v: number | null) => void;
}

export function AmountInput({ value, onChange }: AmountInputProps) {
  const [raw, setRaw] = useState(value != null ? value.toFixed(2) : "");

  useEffect(() => {
    setRaw(value != null ? value.toFixed(2) : "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^0-9.]/g, "");
    setRaw(v);
    const parsed = parseFloat(v);
    onChange(isNaN(parsed) ? null : parsed);
  };

  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-4 rounded-xl border transition-colors",
      "border-border bg-muted focus-within:border-primary focus-within:bg-white"
    )}>
      <span className="text-muted-foreground font-medium text-lg">$</span>
      <input
        type="text"
        inputMode="decimal"
        value={raw}
        onChange={handleChange}
        placeholder="0.00"
        className="flex-1 bg-transparent outline-none text-2xl font-bold text-foreground placeholder:text-muted-foreground/40"
      />
    </div>
  );
}
