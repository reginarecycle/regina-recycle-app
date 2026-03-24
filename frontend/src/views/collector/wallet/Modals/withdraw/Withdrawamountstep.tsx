import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { withdrawAmountSchema, type WithdrawAmountFormValues } from "@/lib/validation";
import { AmountInput, ModalFooter, QuickAmountBtn } from "../../components";

interface WithdrawAmountStepProps {
  defaultAmount: number | null;
  availableBalance: number;
  onBack: () => void;
  onContinue: (amount: number) => void;
}
const QUICK_AMOUNTS = [100, 250, 500, 1000, 2500, 5000];
export const WithdrawAmountStep: React.FC<WithdrawAmountStepProps> = ({
  defaultAmount,
  availableBalance,
  onBack,
  onContinue,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<WithdrawAmountFormValues>({
    resolver: zodResolver(
      withdrawAmountSchema.refine(
        (d) => d.amount <= availableBalance,
        { message: "Amount exceeds available balance", path: ["amount"] }
      )
    ),
    mode: "onChange",
    defaultValues: { amount: defaultAmount ?? undefined },
  });

  const currentAmount = watch("amount");

  const onSubmit = (data: WithdrawAmountFormValues) => {
    onContinue(data.amount);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
      <div className="flex-1 px-6 py-5 flex flex-col gap-5">
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Enter Amount (CAD)
          </label>
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <AmountInput
                value={field.value ?? null}
                onChange={(v) => field.onChange(v)}
              />
            )}
          />
          {errors.amount && (
            <p className="text-xs text-destructive mt-1">{errors.amount.message}</p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            Available Balance:{" "}
            <span className="font-semibold text-foreground">
              ${availableBalance.toLocaleString("en-CA", { minimumFractionDigits: 2 })}
            </span>
          </p>
        </div>

        <div>
          <label className="text-sm font-semibold text-foreground mb-3 block">
            Quick Amounts
          </label>
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
          <div className="rounded-xl border border-border bg-gray-50 p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Withdrawal amount:</span>
              <span className="font-semibold text-foreground">
                ${currentAmount?.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Processing fee:</span>
              <span className="font-semibold text-foreground">$0.00</span>
            </div>
          </div>
        )}
      </div>

      <ModalFooter
        onBack={onBack}
        onContinue={() => {}}
        continueDisabled={!isValid}
      />
    </form>
  );
};