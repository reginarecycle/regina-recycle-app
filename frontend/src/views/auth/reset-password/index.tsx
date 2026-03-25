import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import AuthHeader from "@/components/shared/headerauth";
import InputField from "@/components/forms/input-field";
import { Button } from "@/components/ui/button";
import { Routes } from "@/routes/routes";
import { useResetPassword } from "@/api-hooks/useAuth";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validation";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email as string | undefined;
  const otp = location.state?.otp as string | undefined;

  const { mutate: resetPassword, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = ({ newPassword }: ResetPasswordFormValues) => {
    if (!email || !otp) {
      toast.error("Session expired. Please start the reset process again.");
      navigate(Routes.forgot);
      return;
    }

    resetPassword(
      { email, token: otp, newPassword },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
          navigate(`${Routes.success}?type=reset-password`);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <main className="w-full max-w-xl">
      <AuthHeader
        title="Reset Password"
        subtitle="Enter your new password below."
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-24.5 ">
        <InputField
          label="New Password"
          register={register("newPassword")}
          error={errors.newPassword?.message}
          type="password"
          placeholder="New password"
          showPasswordToggle
          required
        />
        <InputField
          label="Confirm Password"
          register={register("confirmPassword")}
          error={errors.confirmPassword?.message}
          type="password"
          placeholder="Confirm new password"
          showPasswordToggle
          required
        />
        <Button
          type="submit"
          className="w-full"
          disabled={!isValid || isPending}
          loading={isPending}
        >
          Reset Password
        </Button>
      </form>
    </main>
  );
};

export default ResetPassword;
