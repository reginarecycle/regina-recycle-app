import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2 } from "lucide-react";
import InputField from "@/components/forms/input-field";
import { withdrawBankSchema, type WithdrawBankFormValues } from "@/lib/validation";
import { ModalFooter } from "../../components";

interface WithdrawBankStepProps {
  defaultValues: Partial<WithdrawBankFormValues>;
  onBack: () => void;
  onContinue: (data: WithdrawBankFormValues) => void;
}

export const WithdrawBankStep: React.FC<WithdrawBankStepProps> = ({
  defaultValues,
  onBack,
  onContinue,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<WithdrawBankFormValues>({
    resolver: zodResolver(withdrawBankSchema),
    mode: "onChange",
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onContinue)} className="flex-1 flex flex-col">
      <div className="flex-1 px-6 py-5 flex flex-col gap-4">
        {/* Bank info banner */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-foreground text-sm">Bank Account Details</div>
            <div className="text-xs text-muted-foreground">
              Enter your bank information for withdrawal
            </div>
          </div>
        </div>

        {/* Account Holder — no numbers (enforced by zod regex) */}
        <InputField
          label="Account Holder Name"
          register={register("accountHolder")}
          error={errors.accountHolder?.message}
          placeholder="Jane Doe"
          required
        />

        {/* Bank Name — no digits (enforced by zod regex) */}
        <InputField
          label="Bank Name"
          register={register("bankName")}
          error={errors.bankName?.message}
          placeholder="TD Bank"
          required
        />

        {/* Account Number — digits only (enforced by zod regex) */}
        <InputField
          label="Account Number"
          register={register("accountNumber")}
          error={errors.accountNumber?.message}
          placeholder="Enter your account number"
          required
        />

        {/* Routing Number — digits only (enforced by zod regex) */}
        <InputField
          label="Routing Number"
          register={register("routingNumber")}
          error={errors.routingNumber?.message}
          placeholder="Enter routing number"
          required
        />
      </div>

      <ModalFooter
        onBack={onBack}
        onContinue={() => {}}
        continueDisabled={!isValid}
      />
    </form>
  );
};