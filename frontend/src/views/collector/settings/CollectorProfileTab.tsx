import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import InputField from "@/components/forms/input-field";
import { ProfileHeader } from "@/components/shared/ProfileHeader";
import { collectorProfileSchema, type CollectorProfileFormValues } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";
import { useUpdateCollectorProfile } from "@/api-hooks/useCollector";
import { toast } from "sonner";

interface CurrentUser {
  userId:      string;
  name:        string;
  email:       string;
  phoneNumber: string | null;
  collectorProfile: { licenseId: string } | null;
}

export function CollectorProfileTab() {
  const { data: meData } = useQuery({
    queryKey: ["auth", "me"],
    queryFn:  () => apiFetch<CurrentUser>("/auth/me"),
  });

  const me = meData?.data;
  const { mutate: updateProfile, isPending } = useUpdateCollectorProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<CollectorProfileFormValues>({
    resolver: zodResolver(collectorProfileSchema),
    mode: "onBlur",
    defaultValues: {
      businessName:       "Shahnaz and Sons Recycling",
      businessEmail:      "ssr@gmail.com",
      businessPhone:      "1-(306)-0000",
      registrationNumber: "123456789",
      address:            "123 Lane Str.",
      city:               "",
      provinceState:      "",
      postalCode:         "",
    },
  });

  useEffect(() => {
    if (me) {
      reset({
        businessName:       me.name ?? "",
        businessEmail:      me.email ?? "",
        businessPhone:      me.phoneNumber ?? "",
        registrationNumber: me.collectorProfile?.licenseId ?? "",
        address:            "",
        city:               "",
        provinceState:      "",
        postalCode:         "",
      });
    }
  }, [me, reset]);

  const onSubmit = (data: CollectorProfileFormValues) => {
    updateProfile(
      {
        name:        data.businessName,
        phoneNumber: data.businessPhone,
        licenseId:   data.registrationNumber,
      },
      {
        onSuccess: () => toast.success("Profile updated successfully"),
        onError:   () => toast.error("Failed to update profile"),
      }
    );
  };

  return (
    <>
      <ProfileHeader
        avatarSrc="/collector-avatar.png"
        avatarFallback={me?.name?.slice(0, 2).toUpperCase() ?? "SS"}
        name={me?.name ?? "Shahnaz and Sons Recycling"}
        badge="VERIFIED COLLECTOR"
        memberSince="Member since January 2026"
      />

      <Separator />

      <div className="p-8 pt-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Business Info */}
          <div>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-xl">🏢</span> Business Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Legal Business Name"   register={register("businessName")}       error={errors.businessName?.message}       placeholder="John Doe"        required />
              <InputField label="Business Email"        register={register("businessEmail")}      error={errors.businessEmail?.message}      type="email" placeholder="doe@gmail.com" disabled required />
              <InputField label="Business Phone Number" register={register("businessPhone")}      error={errors.businessPhone?.message}      placeholder="1-(306)-0000"    required />
              <InputField label="Registration Number"   register={register("registrationNumber")} error={errors.registrationNumber?.message} placeholder="123456789"       required />
            </div>
          </div>

          {/* Business Address */}
          <div>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5" /> Business Address
            </h2>
            <div className="space-y-6">
              <InputField label="Address" register={register("address")} error={errors.address?.message} placeholder="123 Lane Str." required className="pl-10" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField label="City"           register={register("city")}          error={errors.city?.message}          placeholder="Input" required />
                <InputField label="Province/State" register={register("provinceState")} error={errors.provinceState?.message} placeholder="Input" required />
                <InputField label="Postal Code"    register={register("postalCode")}    error={errors.postalCode?.message}    placeholder="Input" required />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 pt-6">
            <Button type="button" variant="outline" disabled={!isDirty || isPending} onClick={() => reset()}
              className="w-full sm:w-[174px] h-11 min-w-0 border-[rgba(221,30,30,0.60)] text-red-500 hover:bg-red-50 disabled:opacity-60">
              Cancel
            </Button>
            <Button type="submit" disabled={!isDirty || isPending}
              className="w-full sm:w-[174px] h-11 min-w-0 bg-primary hover:bg-primary/90 disabled:opacity-60">
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}