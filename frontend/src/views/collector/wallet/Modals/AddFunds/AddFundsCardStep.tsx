import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/components/forms/input-field";
import { ModalFooter } from "../../shared";
import { addFundsCardSchema, type AddFundsCardFormValues } from "@/lib/validation";

interface AddFundsCardStepProps {
  defaultValues: Partial<AddFundsCardFormValues>;
  onBack: () => void;
  onContinue: (data: AddFundsCardFormValues) => void;
}

export const AddFundsCardStep: React.FC<AddFundsCardStepProps> = ({
  defaultValues,
  onBack,
  onContinue,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<AddFundsCardFormValues>({
    resolver: zodResolver(addFundsCardSchema),
    mode: "onChange",
    defaultValues,
  });

  const cardNumber = watch("cardNumber") ?? "";
  const expiry     = watch("expiry")     ?? "";
  const cvv        = watch("cvv")        ?? "";

  return (
    <form onSubmit={handleSubmit(onContinue)} className="flex-1 flex flex-col">
      <div className="flex-1 px-6 py-5 flex flex-col gap-4">

        {/* Card Number — digits only, auto-spaced */}
        <div>
          <InputField
            label="Card Number"
            register={register("cardNumber")}
            error={errors.cardNumber?.message}
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const formatted = e.target.value
                .replace(/\D/g, "")
                .slice(0, 16)
                .replace(/(.{4})/g, "$1 ")
                .trim();
              setValue("cardNumber", formatted, { shouldValidate: true });
            }}
          />
        </div>

        {/* Card Name — no digits (zod regex enforces) */}
        <InputField
          label="Card Name"
          register={register("cardName")}
          error={errors.cardName?.message}
          placeholder="Jane Doe"
          required
        />

        <div className="grid grid-cols-2 gap-3">
          {/* Expiry — auto MM/YY format */}
          <InputField
            label="Expiry Date"
            register={register("expiry")}
            error={errors.expiry?.message}
            placeholder="07/26"
            value={expiry}
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const d = e.target.value.replace(/\D/g, "").slice(0, 4);
              const formatted = d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
              setValue("expiry", formatted, { shouldValidate: true });
            }}
          />

          {/* CVV — digits only, max 3 */}
          <InputField
            label="CVV"
            register={register("cvv")}
            error={errors.cvv?.message}
            placeholder="123"
            value={cvv}
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const cleaned = e.target.value.replace(/\D/g, "").slice(0, 3);
              setValue("cvv", cleaned, { shouldValidate: true });
            }}
          />
        </div>
      </div>

      <ModalFooter onBack={onBack} onContinue={() => {}} continueDisabled={!isValid} />
    </form>
  );
};
























































































