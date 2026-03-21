import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AmountInput, QuickAmountBtn, ModalFooter } from "../../shared";
import { QUICK_AMOUNTS } from "../../constants";
import { addFundsAmountSchema, type AddFundsAmountFormValues } from "@/lib/validation";

interface AddFundsAmountStepProps {
  defaultAmount: number | null;
  onBack: () => void;
  onContinue: (amount: number) => void;
}

export const AddFundsAmountStep: React.FC<AddFundsAmountStepProps> = ({
  defaultAmount,
  onBack,
  onContinue,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<AddFundsAmountFormValues>({
    resolver: zodResolver(addFundsAmountSchema),
    mode: "onChange",
    defaultValues: { amount: defaultAmount ?? undefined },
  });

  const currentAmount = watch("amount");

  return (
    <form onSubmit={handleSubmit((d) => onContinue(d.amount))} className="flex-1 flex flex-col">
      <div className="flex-1 px-6 py-5 flex flex-col gap-5">
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Enter Amount (CAD)
          </label>
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <AmountInput value={field.value ?? null} onChange={(v) => field.onChange(v)} />
            )}
          />
          {errors.amount && (
            <p className="text-xs text-destructive mt-1">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold text-foreground mb-3 block">Quick Amounts</label>
          <div className="grid grid-cols-3 gap-2">
            {QUICK_AMOUNTS.map((a) => (
              <QuickAmountBtn
                key={a}
                amount={a}
                selected={currentAmount === a}
                onClick={() => setValue("amount", a, { shouldValidate: true })}
              />
            ))}
          </div>
        </div>

        {currentAmount > 0 && !errors.amount && (
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-light-green">
            <span className="text-sm text-foreground">Amount to add:</span>
            <span className="text-base font-bold text-green-600">${currentAmount?.toFixed(2)}</span>
          </div>
        )}
      </div>

      <ModalFooter onBack={onBack} onContinue={() => {}} continueDisabled={!isValid} />
    </form>
  );
};
