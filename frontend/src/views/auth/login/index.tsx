import { useLogin } from "@/api-hooks/useAuth";
import InputField from "@/components/forms/input-field";
import AuthHeader from "@/components/shared/headerauth";
import { Button } from "@/components/ui/button";
import { saveToken, setUserRole } from "@/lib/helper";
import { loginSchema, type LoginFormValues } from "@/lib/validation";
import { Routes } from "@/routes/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";


const Login = () => {
  const { mutate, isPending } = useLogin();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = (data: LoginFormValues) => {
    mutate(data, {
      onSuccess: ({ data: { user, token }, message }) => {
        // Email not verified — send to verification first
        if (!user.emailVerified) {
          toast.warning("Please verify your email to continue.");
          navigate(Routes.verification, {
            state: {
              email: user.email,
              purpose: "account-verification",
            },
          });
          return;
        }

        saveToken(token);
        setUserRole(user.role as "CUSTOMER" | "COLLECTOR");
        toast.success(message);

        if (user.role === "COLLECTOR") {
          navigate(Routes.collectordashboard);
        } else {
          navigate(Routes.dashboard);
        }
      },
      onError: (error) => {
        toast.error(error.message ?? "Login failed. Please check your credentials.");
      },
    });
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
      <Button
        type="submit"
        className="w-full"
        disabled={!isDirty || isPending}
        loading={isPending}
      >
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
