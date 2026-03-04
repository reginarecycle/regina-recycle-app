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

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    console.log(data);
    navigate(Routes.verification, {
      state: { purpose: "password-reset", email: data.email },
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
      <Button type="submit" className="w-full" disabled={!isDirty}>
        Proceed
      </Button>
    </form>
  );
};

export default ForgotPassword;
