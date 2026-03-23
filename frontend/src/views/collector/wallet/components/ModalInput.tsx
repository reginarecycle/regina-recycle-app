import { cn } from "@/lib/utils";

interface ModalInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}

export function ModalInput({ label, value, onChange, placeholder, error }: ModalInputProps) {
  return (
    <div>
      <label className="text-sm font-semibold text-foreground mb-1.5 block">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full px-4 py-3 rounded-xl border text-foreground outline-none transition-colors text-sm",
          "bg-muted border-border focus:border-primary focus:bg-white"
        )}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
