import { Fragment } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

export function StepIndicator({ totalSteps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center w-full">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const done   = step < currentStep;
        const active = step === currentStep;
        return (
          <Fragment key={step}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-colors",
              done   && "bg-primary text-primary-foreground",
              active && "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2",
              !done && !active && "bg-muted text-muted-foreground"
            )}>
              {done ? <Check className="w-3.5 h-3.5" /> : step}
            </div>
            {i < totalSteps - 1 && (
              <div className={cn("flex-1 h-0.5 transition-colors", done ? "bg-primary" : "bg-border")} />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
