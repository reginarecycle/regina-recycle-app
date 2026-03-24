import InputField from "@/components/forms/input-field";
import { useForm } from 'react-hook-form';
import { profileDetailsSchema, type ProfileDetailsFormValues } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Calendar,
  MapPin,
} from "lucide-react";
import { Button } from '@/components/ui/button';


const UserProfile = () => {
      const {
        register: registerDetails,
        handleSubmit: handleSubmitDetails,
        formState: { errors: detailsErrors, isDirty: detailsIsDirty },
        reset: resetDetails,
      } = useForm<ProfileDetailsFormValues>({
        resolver: zodResolver(profileDetailsSchema),
        mode: "onChange",
        defaultValues: {
          fullName: "John Doe",
          email: "doe@gmail.com",
          phone: "1-(306)-0000",
          dateOfBirth: "DD-MM-YYYY",
          address: "123 Lane Str.",
        },
      });
        // Form submit handlers
  const onSubmitDetails = (data: ProfileDetailsFormValues) => {
    console.log("Profile details:", data);
    // TODO: Call API to update profile view
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
                        required
                    />
                    <InputField
                        label="Email"
                        register={registerDetails("email")}
                        error={detailsErrors.email?.message}
                        type="email"
                        placeholder="doe@gmail.com"
                        disabled
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="Phone Number"
                        register={registerDetails("phone")}
                        error={detailsErrors.phone?.message}
                        placeholder="1-(306)-0000"
                        required
                    />
                    <div className="relative">
                        <InputField
                            label="Date of Birth"
                            register={registerDetails("dateOfBirth")}
                            error={detailsErrors.dateOfBirth?.message}
                            placeholder="DD-MM-YYYY"
                            required
                        />
                        <Calendar className="absolute right-3 top-[32px] h-5 w-5 text-muted-foreground pointer-events-none" />
                    </div>
                </div>

                <div className="relative">
                    <MapPin className="absolute left-3 top-[32px] h-5 w-5 text-muted-foreground pointer-events-none" />
                    <InputField
                        label="Address"
                        register={registerDetails("address")}
                        error={detailsErrors.address?.message}
                        placeholder="123 Lane Str."
                        required
                    />
                </div>

                <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-[174px] h-11 min-w-0 border-[rgba(221,30,30,0.60)] text-red-500 hover:bg-red-50 disabled:opacity-60"
                        disabled={!detailsIsDirty}
                        onClick={() => resetDetails()}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="w-full sm:w-[174px] h-11 min-w-0 bg-primary hover:bg-primary/90 disabled:opacity-60"
                        disabled={!detailsIsDirty}
                    >
                        Save Changes
                    </Button>
                </div>
            </form>
        </section>
    )
}

export default UserProfile