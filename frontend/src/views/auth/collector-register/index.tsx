import { useRegister } from "@/api-hooks/useAuth";
import { AddressAutocompleteField } from "@/components/forms/address-field";
import CheckboxField from "@/components/forms/checkbox-field";
import InputField from "@/components/forms/input-field";
import AuthHeader from "@/components/shared/headerauth";
import { Button } from "@/components/ui/button";
import {
  collectorRegistrationSchema,
  type CollectorRegistrationFormValues,
} from "@/lib/validation";
import { Routes } from "@/routes/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CollectiorRegistration = () => {
  const {mutate, isPending} = useRegister();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<CollectorRegistrationFormValues>({
    resolver: zodResolver(collectorRegistrationSchema),
    mode: "onChange",
  });

  const onSubmit = (data: CollectorRegistrationFormValues) => {
    mutate(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        role: "COLLECTOR",
        agreedToTerms: data.terms,
        address: data.address,
        licenseId: data.licenseID,
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
        title="Business Information"
        subtitle="Provide your professional details to start collecting."
      />
      <div className="space-y-4 mb-12">
        <InputField
          label="Company Name"
          register={register("name")}
          error={errors.name?.message}
          placeholder="Enter your company name"
          required
        />
        <InputField
          label="Business Email"
          register={register("email")}
          error={errors.email?.message}
          placeholder="Enter your business email"
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
          label="Business License ID"
          register={register("licenseID")}
          error={errors.licenseID?.message}
          placeholder="Enter your business license ID"
          required
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
      <Button type="submit" className="w-full" disabled={!isValid || isPending} loading={isPending}>
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

export default CollectiorRegistration;
