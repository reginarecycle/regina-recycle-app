import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AmountInputProps {
  value: number | null;
  onChange: (v: number | null) => void;
}

function formatWithCommas(raw: string): string {
  if (!raw) return "";
  const parts = raw.split(".");
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.length > 1 ? `${intPart}.${parts[1]}` : intPart;
}

export function AmountInput({ value, onChange }: AmountInputProps) {
  const valueAsString = value != null ? String(value) : "";
  const [displayValue, setDisplayValue] = useState(() => formatWithCommas(valueAsString));
  const [prevValue, setPrevValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync when value changes externally (e.g. quick amount buttons) — not while user is typing
  if (prevValue !== value) {
    setPrevValue(value);
    setDisplayValue(formatWithCommas(valueAsString));
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = e.target;
    const cursorPos = el.selectionStart ?? 0;
    const prevFormatted = displayValue;

    const raw = e.target.value.replace(/,/g, "");
    if (raw !== "" && !/^\d*\.?\d{0,2}$/.test(raw)) return;

    const formatted = formatWithCommas(raw);

    const prevCommasBefore = (prevFormatted.slice(0, cursorPos).match(/,/g) ?? []).length;
    const newCommasBefore = (formatted.slice(0, cursorPos).match(/,/g) ?? []).length;
    const adjustedCursor = cursorPos + (newCommasBefore - prevCommasBefore);

    setDisplayValue(formatted);

    const parsed = parseFloat(raw);
    onChange(isNaN(parsed) ? null : parsed);

    requestAnimationFrame(() => {
      inputRef.current?.setSelectionRange(adjustedCursor, adjustedCursor);
    });
  };

  const handleBlur = () => {
    if (value != null && !isNaN(value)) {
      setDisplayValue(
        value.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      );
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-4 rounded-xl border transition-colors",
        "border-border bg-muted focus-within:border-primary focus-within:bg-white",
      )}
    >
      <span className="text-muted-foreground font-medium text-lg">$</span>
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="0.00"
        className="flex-1 bg-transparent outline-none text-2xl font-bold text-foreground placeholder:text-muted-foreground/40"
      />
    </div>
  );
}
