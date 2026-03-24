import React from "react";
import { useForm } from "react-hook-form";
import InputField from "@/components/forms/input-field";
import {
  userRegistrationSchema,
  type UserRegistrationFormValues,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthHeader from "@/components/shared/headerauth";
import { Button } from "@/components/ui/button";
import CheckboxField from "@/components/forms/checkbox-field";
import { Routes } from "@/routes/routes";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "@/api-hooks/useAuth";
import { toast } from "sonner";
import { AddressAutocompleteField } from "@/components/forms/address-field";

const UserRegistration: React.FC = () => {
  const { mutate, isPending } = useRegister();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    control,
    formState: { errors, isValid },
  } = useForm<UserRegistrationFormValues>({
    resolver: zodResolver(userRegistrationSchema),
    mode: "onChange",
  });

  const onSubmit = (data: UserRegistrationFormValues) => {
    mutate(
      {
        name: data.fullName,
        email: data.email,
        password: data.password,
        role: "CUSTOMER",
        agreedToTerms: data.terms,
        address: data.address,
      },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
          navigate(Routes.verification, {
            state: {
              email: data.email,
              purpose: "account-verification",
            },
          });
        },
        onError: (error) => {
          toast.error(
            error.message ?? "Registration failed. Please try again."
          );
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xl">
      <AuthHeader
        title="Tell us more about you"
        subtitle="Setting up your customer account for easier pickup."
      />
      <div className="space-y-4 mb-12">
        <InputField
          label="Full Name"
          register={register("fullName")}
          error={errors.fullName?.message}
          placeholder="John Doe"
          required
        />
        <InputField
          label="Email"
          register={register("email")}
          error={errors.email?.message}
          placeholder="doe@gmail.com"
          required
        />
        <AddressAutocompleteField
          required
          error={errors.address?.line1?.message ?? errors.address?.message}
          onAddressSelect={(parsed) => {
            setValue("address.line1", parsed.line1);
            setValue("address.city", parsed.city);
            setValue("address.province", parsed.province);
            setValue("address.postalCode", parsed.postalCode);
            if (parsed.latitude) setValue("address.latitude", parsed.latitude);
            if (parsed.longitude)
              setValue("address.longitude", parsed.longitude);
            trigger("address");
          }}
        />
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

        <CheckboxField
          name="terms"
          control={control}
          error={errors.terms?.message}
          label={
            <>
              I agree to the{" "}
              <span className="text-accent-foreground font-semibold">
                Terms of Service{" "}
              </span>
              and
              <span className="text-accent-foreground font-semibold">
                {" "}
                Privacy Policy
              </span>
            </>
          }
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={!isValid || isPending}
        loading={isPending}
      >
        Create Account
      </Button>
      <p className="text-center mt-3 font-">
        Already have an account?{" "}
        <Link to={Routes.login} className="text-accent-foreground font-black">
          Login
        </Link>
      </p>
    </form>
  );
};

export default UserRegistration;
