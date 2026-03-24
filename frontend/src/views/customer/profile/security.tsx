import InputField from '@/components/forms/input-field';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { changePasswordSchema, type ChangePasswordFormValues } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DeleteAccountBanner } from "@/components/shared/DeleteAccountBanner";
import { DeleteAccountDialog } from "@/components/shared/DeleteAccountDialog";

const ProfileSecurity = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isDirty: passwordIsDirty },
    reset: resetPassword,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onBlur",
  });

  const onSubmitPassword = (data: ChangePasswordFormValues) => {
    console.log("Password change:", data);
    resetPassword();
  };

  return (
    <section className="mt-0 p-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-1">Password Management</h2>
        <p className="text-sm text-muted-foreground">
          Secure your account by updating your password regularly.
        </p>
      </div>

      <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
        <InputField
          label="Current Password"
          register={registerPassword("currentPassword")}
          error={passwordErrors.currentPassword?.message}
          type="password"
          placeholder="Enter current password"
          showPasswordToggle
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="New Password"
            register={registerPassword("newPassword")}
            error={passwordErrors.newPassword?.message}
            type="password"
            placeholder="Enter new password"
            showPasswordToggle
            required
          />
          <InputField
            label="Confirm Password"
            register={registerPassword("confirmPassword")}
            error={passwordErrors.confirmPassword?.message}
            type="password"
            placeholder="Confirm new password"
            showPasswordToggle
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-43.5 h-11 min-w-0 border-[rgba(221,30,30,0.60)] text-red-500 hover:bg-red-50 disabled:opacity-60"
            disabled={!passwordIsDirty}
            onClick={() => resetPassword()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-[174px] h-11 min-w-0 bg-primary hover:bg-primary/90 disabled:opacity-60"
            disabled={!passwordIsDirty}
          >
            Update Password
          </Button>
        </div>
      </form>

      <Separator className="my-8" />

      <DeleteAccountBanner
        onDelete={() => setDeleteDialogOpen(true)}
        imageSrc="/delete-account.png"
      />

      <DeleteAccountDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => {
          console.log("Account deleted");
          // TODO: call your delete account API here
        }}
      />
    </section>
  );
};

export default ProfileSecurity;