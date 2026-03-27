import { useForgotPassword } from "@/api-hooks/useAuth";
import InputField from "@/components/forms/input-field";
import AuthHeader from "@/components/shared/headerauth";
import { Button } from "@/components/ui/button";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validation";
import { Routes } from "@/routes/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ForgotPassword = () => {
  const { mutate, isPending } = useForgotPassword();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    mutate(data, {
      onSuccess: ({ message }) => {
        toast.success(message);
        navigate(Routes.verification, {
          state: { purpose: "password-reset", email: data.email },
        });
      },
      onError: (error) => {
        toast.error(
          error.message ??
            "Failed to initiate password reset. Please try again."
        );
        // Handle error (e.g., show a toast notification)
      },
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xl">
      <AuthHeader
        title="Forgot Password"
        subtitle="Enter your correct details to access your account. "
      />
      <div className="space-y-4 my-12">
        <InputField
          label="Email"
          register={register("email")}
          error={errors.email?.message}
          placeholder="doe@gmail.com"
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={!isDirty || isPending}
        loading={isPending}
      >
        Proceed
      </Button>
    </form>
  );
};

export default ForgotPassword;
