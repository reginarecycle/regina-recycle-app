import { Check } from "lucide-react";

interface SuccessScreenProps {
  title: string;
  subtitle: string;
}

export function SuccessScreen({ title, subtitle }: SuccessScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-12">
      <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center text-primary">
          <Check className="w-8 h-8" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-foreground text-center">{title}</h3>
      <p className="text-sm text-muted-foreground text-center">{subtitle}</p>
    </div>
  );
}
