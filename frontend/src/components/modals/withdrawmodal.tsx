import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWithdrawSchema, type WithdrawFormValues } from "@/lib/validation";
import InputField from "@/components/forms/input-field";
import { useCustomerWithdraw } from "@/api-hooks/useCustomerWallet";

type WithdrawModalProps = {
  isOpen:           boolean;
  onClose:          () => void;
  availableBalance: number;
};

export default function WithdrawModal({ isOpen, onClose, availableBalance }: WithdrawModalProps) {
  const schema = useMemo(() => createWithdrawSchema(availableBalance), [availableBalance]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<WithdrawFormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const { mutate: withdraw, isPending } = useCustomerWithdraw();

  if (!isOpen) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: WithdrawFormValues) => {
    withdraw(
      {
        amount:           Number(data.amount),
        interacEmail:     data.recipientEmail,
        securityQuestion: data.securityQuestion ?? "",
        securityAnswer:   data.securityAnswer   ?? "",
      },
      { onSuccess: handleClose },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[4px]"
        onClick={handleClose}
      />

      <div
        className="
          relative z-10
          w-full max-w-[562px]
          rounded-[8px]
          border border-border
          bg-white
          px-6 py-5
        "
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-foreground">
            Withdraw Funds
          </h2>

          <button
            type="button"
            onClick={handleClose}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F2F2F7]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 3L11 11M11 3L3 11"
                stroke="#3C3C43"
                strokeOpacity="0.6"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-3">

            {/* Amount */}
            <InputField
              label="Amount"
              register={register("amount")}
              error={errors.amount?.message}
              placeholder="Enter an amount"
              required
              helperText={`Available: $${availableBalance.toFixed(2)}`}
            />

            {/* Recipient Email */}
            <InputField
              label="Recipient Email"
              register={register("recipientEmail")}
              error={errors.recipientEmail?.message}
              placeholder="Enter email"
              type="email"
              required
              helperText="They'll receive an email notification"
            />

            {/* Security Question */}
            <InputField
              label="Security Question"
              register={register("securityQuestion")}
              error={errors.securityQuestion?.message}
              placeholder="Enter a security question"
            />

            {/* Security Answer */}
            <InputField
              label="Security Answer"
              register={register("securityAnswer")}
              error={errors.securityAnswer?.message}
              placeholder="Enter a security answer"
            />

            {/* Message */}
            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-semibold text-foreground">
                Message (Optional)
              </label>
              <textarea
                placeholder="Narration..."
                {...register("message")}
                className="
                  h-[83px]
                  resize-none
                  rounded-[8px]
                  border border-border
                  bg-card
                  px-4 py-3
                  text-[14px]
                  outline-none
                  focus:border-primary
                "
              />
            </div>
          </div>

          <div className="mt-6 flex justify-between gap-4">
            <button
              type="button"
              onClick={handleClose}
              className="
                h-[52px] w-[240px]
                rounded-[8px]
                border border-destructive
                font-semibold
                text-destructive
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isDirty || isPending}
              className="
                h-[52px] w-[240px]
                rounded-[8px]
                bg-primary
                font-semibold
                text-white
                disabled:opacity-50
              "
            >
              {isPending ? "Processing..." : "Withdraw"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}