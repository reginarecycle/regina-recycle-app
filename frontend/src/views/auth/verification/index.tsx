import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import AuthHeader from "@/components/shared/headerauth";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useLocation, useNavigate } from "react-router-dom";
import { Routes } from "@/routes/routes";

type Props = {};

const AccountVerification: React.FC<Props> = () => {
  const [shakeKey] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const purpose = location.state?.purpose; // 'password-reset' or 'account-verification'
  const email = location.state?.email;

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isDirty },
  } = useForm<{ otp: string }>({
    mode: "onSubmit",
  });

  const handleResend = () => {
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
    //  logic goes here
  };

  const onSubmit = (data: { otp: string }) => {
    if (data.otp !== "123456") {
      setError("otp", {
        type: "manual",
        message: "Invalid OTP. Please try again.",
      });
    } else {
      console.log("OTP Verified:", data.otp);
      clearErrors("otp");
      if (purpose === "password-reset") {
        navigate(Routes.reset, { state: { email, verified: true } });
      } else {
        navigate(`${Routes.success}?type=email-verification`);
      }
    }
  };

  return (
    <main>
      <AuthHeader
        title="Verify Email Address"
        subtitle="We have sent a 6-digit code to joh******e@gmail.com for verification. Please enter it below to continue."
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-24.5">
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
                <InputOTPGroup
                  key={shakeKey}
                  className={errors.otp ? "animate-shake" : ""}
                >
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
        <Button type="submit" className="w-full" disabled={!isDirty}>
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
              className="text-primary font-medium hover:underline"
              onClick={handleResend}
            >
              Resend
            </button>
          </p>
        )}
      </form>
    </main>
  );
};

export default AccountVerification;
