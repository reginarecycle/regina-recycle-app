import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import InputField from "@/components/forms/input-field";
import { DeleteAccountBanner } from "@/components/shared/DeleteAccountBanner";
import { DeleteAccountDialog } from "@/components/shared/DeleteAccountDialog";
import { collectorSecuritySchema, type CollectorSecurityFormValues } from "@/lib/validation";

export function CollectorSecurityTab() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<CollectorSecurityFormValues>({
    resolver: zodResolver(collectorSecuritySchema),
    mode: "onChange",
  });

  const onSubmit = (data: CollectorSecurityFormValues) => {
    console.log("Security data:", data);
    // TODO: call your API here
    reset();
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-1">Security Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your collectors account and manage primary security actions.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <InputField label="Current Password" register={register("currentPassword")} error={errors.currentPassword?.message} type="password" placeholder="Enter current password" showPasswordToggle required />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="New Password"     register={register("newPassword")}     error={errors.newPassword?.message}     type="password" placeholder="Enter new password"    showPasswordToggle required />
          <InputField label="Confirm Password" register={register("confirmPassword")} error={errors.confirmPassword?.message} type="password" placeholder="Confirm new password"  showPasswordToggle required />
        </div>

        <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 pt-6">
          <Button type="button" variant="outline" disabled={!isDirty} onClick={() => reset()}
            className="w-full sm:w-[174px] h-11 min-w-0 border-[rgba(221,30,30,0.60)] text-red-500 hover:bg-red-50 disabled:opacity-60">
            Cancel
          </Button>
          <Button type="submit" disabled={!isDirty}
            className="w-full sm:w-[174px] h-11 min-w-0 bg-primary hover:bg-primary/90 disabled:opacity-60">
            Update Password
          </Button>
        </div>
      </form>

      <Separator className="my-8" />

      <DeleteAccountBanner
        title="Delete Collector Account"
        description="Permanently delete your collector profile and all associated data. This action cannot be undone. All active recycling requests and wallet balances must be settled before deletion."
        imageSrc="/delete-account.png"
        onDelete={() => setDeleteDialogOpen(true)}
      />

      <DeleteAccountDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        description='This action is permanent and cannot be undone. All your data, company profile, and history will be lost. To confirm, please type "DELETE" in the box below.'
        onConfirm={() => {
          console.log("Collector account deleted");
          // TODO: call your delete API here
        }}
      />
    </div>
  );
}
