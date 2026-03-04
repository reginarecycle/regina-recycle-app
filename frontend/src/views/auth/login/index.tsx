import InputField from "@/components/forms/input-field";
import AuthHeader from "@/components/shared/headerauth";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginFormValues } from "@/lib/validation";
import { Routes } from "@/routes/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FC } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

type Props = {};

const Login: FC<Props> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xl">
      <AuthHeader
        title="Welcome"
        subtitle="Enter your correct details to access your account."
      />
      <div className="space-y-4 mb-12">
        <InputField
          label="Email"
          register={register("email")}
          error={errors.email?.message}
          placeholder="doe@gmail.com"
          required
        />
        <InputField
          label="Password"
          register={register("password")}
          error={errors.password?.message}
          placeholder="Enter your password"
          type="password"
          showPasswordToggle
          helperText={
            <Link
              to={Routes.forgot}
              className="text-accent-foreground font-bold hover:underline flex items-end justify-end text-sm"
            >
              Forgot Password?
            </Link>
          }
        />
      </div>
      <Button type="submit" className="w-full" disabled={!isDirty}>
        Login
      </Button>
      <p className="text-center mt-3 font-">
        Don't have an account?{" "}
        <Link
          to={Routes.onboarding}
          className="text-accent-foreground font-black"
        >
          Create Account
        </Link>
      </p>
    </form>
  );
};

export default Login;
