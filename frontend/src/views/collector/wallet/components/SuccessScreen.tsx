import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessScreenProps {
  title: string;
  subtitle: string;
  onClose?: () => void;
}

export function SuccessScreen({ title, subtitle, onClose }: SuccessScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-12">
      <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center text-primary">
          <Check className="w-8 h-8" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-foreground text-center">{title}</h3>
      <p className="text-sm text-muted-foreground text-center">{subtitle}</p>
      {onClose && (
        <Button className="mt-2 min-w-36" onClick={onClose}>
          Done
        </Button>
      )}
    </div>
  );
}
