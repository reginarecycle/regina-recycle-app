import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import AuthHeader from "@/components/shared/headerauth";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Routes } from "@/routes/routes";
import {
  useForgotPassword,
  useResendOtp,
  useVerifyEmail,
} from "@/api-hooks/useAuth";
import { maskEmail } from "@/lib/utils";

const AccountVerification: React.FC = () => {
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const purpose = location.state?.purpose as
    | "password-reset"
    | "account-verification"
    | undefined;
  const email = location.state?.email as string | undefined;

  const { mutate: verifyEmail, isPending: isVerifying } = useVerifyEmail();
  const { mutate: resendOtp, isPending: isResendingOtp } = useResendOtp();
  const { mutate: forgotPassword, isPending: isResendingReset } =
    useForgotPassword();

  const isResending = isResendingOtp || isResendingReset;

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm<{ otp: string }>({ mode: "onSubmit" });

  const startCountdown = () => {
    setCountdown(30);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = () => {
    if (!email) return;

    if (purpose === "password-reset") {
      // Generates a fresh passwordOtp and resends the reset email
      forgotPassword(
        { email },
        {
          onSuccess: ({ message }) => {
            toast.success(message);
            startCountdown();
          },
          onError: (error) => toast.error(error.message),
        }
      );
    } else {
      resendOtp(
        { email },
        {
          onSuccess: ({ message }) => {
            toast.success(message);
            startCountdown();
          },
          onError: (error) => toast.error(error.message),
        }
      );
    }
  };

  const onSubmit = ({ otp }: { otp: string }) => {
    if (!email) {
      toast.error("Session expired. Please start again.");
      return;
    }

    if (purpose === "password-reset") {
      navigate(Routes.reset, { state: { email, otp } });
      return;
    }

    verifyEmail(
      { email, otp },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
          navigate(`${Routes.success}?type=email-verification`);
        },
        onError: (error) => {
          setError("otp", { type: "manual", message: error.message });
        },
      }
    );
  };

  return (
    <main>
      <AuthHeader
        title="Verify Email Address"
        subtitle={`We have sent a 6-digit code to ${
          email ? maskEmail(email) : "your email"
        } for verification. Please enter it below to continue.`}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 mt-24.5 w-full max-w-xl"
      >
        <div className="space-y-2">
          <Controller
            name="otp"
            control={control}
            rules={{ required: "OTP is required" }}
            render={({ field }) => (
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={field.value}
                onChange={field.onChange}
                containerClassName="!justify-between"
              >
                <InputOTPGroup className={errors.otp ? "animate-shake" : ""}>
                  {Array.from({ length: 6 }, (_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      aria-invalid={!!errors.otp}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          {errors.otp && (
            <p className="text-red-500 text-sm text-left">
              {errors.otp.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!isDirty || isVerifying}
          loading={isVerifying}
        >
          Verify
        </Button>

        {countdown > 0 ? (
          <p className="text-center text-muted-foreground">
            Resend code in:{" "}
            <span className="text-primary font-medium">{countdown}s</span>
          </p>
        ) : (
          <p className="text-center text-muted-foreground">
            Didn't receive the code?{" "}
            <button
              type="button"
              className="text-primary font-medium hover:underline disabled:opacity-50"
              onClick={handleResend}
              disabled={isResending}
            >
              {isResending ? "Sending…" : "Resend"}
            </button>
          </p>
        )}
      </form>
    </main>
  );
};

export default AccountVerification;
