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

type Props = {};

const CollectiorRegistration = (props: Props) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<CollectorRegistrationFormValues>({
    resolver: zodResolver(collectorRegistrationSchema),
    mode: "onChange",
  });

  const onSubmit = (data: CollectorRegistrationFormValues) => {
    console.log(data);
    navigate(Routes.verification);
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
        <InputField
          label="Business Address"
          register={register("address")}
          error={errors.address?.message}
          placeholder="123 Lane Str."
          required
        />
        <InputField
          label="Business License ID"
          register={register("businessLicenseID")}
          error={errors.businessLicenseID?.message}
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
      <Button type="submit" className="w-full" disabled={!isValid}>
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
