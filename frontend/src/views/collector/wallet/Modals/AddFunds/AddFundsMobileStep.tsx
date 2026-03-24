import * as React from "react";
import { Smartphone } from "lucide-react";
import { ModalFooter } from "../../components";

interface AddFundsMobileStepProps {
  onBack: () => void;
  onContinue: () => void;
}

export const AddFundsMobileStep: React.FC<AddFundsMobileStepProps> = ({ onBack, onContinue }) => (
  <div className="flex-1 flex flex-col">
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-10">
      <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
        <Smartphone className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-foreground">Ready to Pay</h3>
      <p className="text-sm text-muted-foreground text-center">
        Click continue to complete payment with your mobile wallet
      </p>
    </div>

    <ModalFooter onBack={onBack} onContinue={onContinue} />
  </div>
);
