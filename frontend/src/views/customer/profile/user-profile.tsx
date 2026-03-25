import InputField from "@/components/forms/input-field";
import { useForm, Controller } from 'react-hook-form';
import { profileDetailsSchema, type ProfileDetailsFormValues } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { useEffect, useRef, useState } from "react";
import { useUpdateUserProfile } from "@/api-hooks/useUsers";
import { useGetDefaultAddress, useUpdateAddress, useCreateAddress } from "@/api-hooks/useAddress";
import { useCurrentUser } from "@/api-hooks/useAuth";
import { AddressAutocompleteField, type ParsedAddress } from "@/components/forms/address-field";


function maskPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (!digits) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}


function maskDob(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (!digits) return "";
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
}

function isoToDmy(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${d.getUTCFullYear()}`;
}

function dmyToIso(dmy: string): string {
  const [dd, mm, yyyy] = dmy.split("-").map(Number);
  return new Date(Date.UTC(yyyy, mm - 1, dd)).toISOString();
}

const UserProfile = () => {
  const { data: addressData } = useGetDefaultAddress();
  const { mutate: updateUserProfile, isPending: profilePending } = useUpdateUserProfile();
  const { mutate: updateAddress, isPending: addressPending } = useUpdateAddress();
  const { mutate: createAddress, isPending: createPending } = useCreateAddress();

  const isSaving = profilePending || addressPending || createPending;
  const { data: currentUserData } = useCurrentUser();

  const parsedAddressRef = useRef<ParsedAddress | null>(null);
  const [addressKey, setAddressKey] = useState(0);

  const {
    register: registerDetails,
    handleSubmit: handleSubmitDetails,
    control,
    setValue,
    formState: { errors: detailsErrors, isDirty: detailsIsDirty },
    reset: resetDetails,
  } = useForm<ProfileDetailsFormValues>({
    resolver: zodResolver(profileDetailsSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
    },
  });

  const buildResetValues = () => ({
    fullName: currentUserData?.data?.name ?? "",
    email: currentUserData?.data?.email ?? "",
    phone: maskPhone(currentUserData?.data?.phoneNumber ?? ""),
    dateOfBirth: isoToDmy(currentUserData?.data?.customerDOB?.dob ?? ""),
    address: addressData?.data?.line1 ?? "",
  });

  useEffect(() => {
    resetDetails(buildResetValues());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserData, addressData]);

  const handleAddressSelect = (parsed: ParsedAddress) => {
    parsedAddressRef.current = parsed;
    setValue("address", parsed.line1, { shouldDirty: true });
  };

  const handleCancel = () => {
    parsedAddressRef.current = null;
    setAddressKey((k) => k + 1);
    resetDetails(buildResetValues());
  };

  const onSubmitDetails = (data: ProfileDetailsFormValues) => {
    const profileUpdate: Record<string, string> = {};
    if (data.fullName)    profileUpdate.name         = data.fullName;
    if (data.email)       profileUpdate.email        = data.email;
    if (data.phone)       profileUpdate.phoneNumber  = data.phone.replace(/\D/g, "");
    if (data.dateOfBirth) profileUpdate.dateOfBirth  = dmyToIso(data.dateOfBirth);

    if (Object.keys(profileUpdate).length > 0) {
      updateUserProfile(profileUpdate as any);
    }

    // Use the autocomplete-parsed address if the user picked one, otherwise fall
    // back to the raw form value (pre-filled existing address that wasn't changed)
    const parsed = parsedAddressRef.current;
    const addressLine = parsed?.line1 ?? data.address;
    if (addressLine) {
      if (addressData?.data?.addressId) {
        updateAddress({ id: addressData.data.addressId, body: { line1: addressLine } });
      } else if (parsed) {
        // Only create a new address when we have full geocoded data
        createAddress({
          line1: parsed.line1,
          city: parsed.city,
          province: parsed.province,
          postalCode: parsed.postalCode,
          latitude: parsed.latitude,
          longitude: parsed.longitude,
          isPrimary: true,
        });
      }
    }
  };

  return (
    <section className="mt-0 p-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-1">Personal Information</h2>
        <p className="text-sm text-muted-foreground">
          Update your account information and contact details
        </p>
      </div>

      <form onSubmit={handleSubmitDetails(onSubmitDetails)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Full name"
            register={registerDetails("fullName")}
            error={detailsErrors.fullName?.message}
            placeholder="John Doe"
          />
          <InputField
            label="Email"
            register={registerDetails("email")}
            error={detailsErrors.email?.message}
            type="email"
            placeholder="doe@gmail.com"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Field data-invalid={!!detailsErrors.phone}>
                <FieldLabel>Phone Number</FieldLabel>
                <Input
                  {...field}
                  inputMode="numeric"
                  placeholder="(306) 555-1234"
                  aria-invalid={!!detailsErrors.phone}
                  onChange={(e) => field.onChange(maskPhone(e.target.value))}
                />
                {detailsErrors.phone && (
                  <FieldError errors={[{ message: detailsErrors.phone.message }]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <Field data-invalid={!!detailsErrors.dateOfBirth}>
                <FieldLabel>Date of Birth</FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    inputMode="numeric"
                    placeholder="DD-MM-YYYY"
                    aria-invalid={!!detailsErrors.dateOfBirth}
                    onChange={(e) => field.onChange(maskDob(e.target.value))}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
                {detailsErrors.dateOfBirth && (
                  <FieldError errors={[{ message: detailsErrors.dateOfBirth.message }]} />
                )}
              </Field>
            )}
          />
        </div>

        <AddressAutocompleteField
          key={`${addressKey}-${addressData?.data?.addressId ?? "none"}`}
          initialValue={addressData?.data?.line1 ?? ""}
          onAddressSelect={handleAddressSelect}
          error={detailsErrors.address?.message}
        />

        <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-43.5 h-11 min-w-0 border-[rgba(221,30,30,0.60)] text-red-500 hover:bg-red-50 disabled:opacity-60"
            disabled={!detailsIsDirty || isSaving}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-43.5 h-11 min-w-0 bg-primary hover:bg-primary/90 disabled:opacity-60"
            disabled={!detailsIsDirty || isSaving}
            loading={isSaving}
          >
              Save Changes
          </Button>
        </div>
      </form>
    </section>
  );
};

export default UserProfile;