import InputField from "@/components/forms/input-field";
import AuthHeader from "@/components/shared/headerauth";
import { Button } from "@/components/ui/button";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validation";
import { Routes } from "@/routes/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";


function ResetPassword() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    console.log(data);
    navigate(`${Routes.success}?type=reset-password`);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xl">
      <AuthHeader
        title="Create a new password"
        subtitle="Enter and confirm your new password"
      />
      <div className="space-y-4 my-12">
        <InputField
          label="Password"
          register={register("password")}
          error={errors.password?.message}
          type="password"
          placeholder="Password"
          showPasswordToggle
          required
        />
        <InputField
          label="Confirm Password"
          register={register("confirmPassword")}
          error={errors.confirmPassword?.message}
          type="password"
          placeholder="Confirm password"
          showPasswordToggle
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={!isDirty || !isValid}>
        Continue
      </Button>
    </form>
  );
}

export default ResetPassword;
