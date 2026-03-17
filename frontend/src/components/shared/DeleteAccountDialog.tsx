import { useForm } from "react-hook-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import InputField from "@/components/forms/input-field";
import { deleteSchema, type DeleteAccountFormValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  /** Override the description for different contexts (customer vs collector) */
  description?: string;
}

const DEFAULT_DESCRIPTION = `This action is permanent and cannot be undone. All your data, rewards, and history will be lost. To confirm, please type "DELETE" in the box below.`;

export function DeleteAccountDialog({
  open,
  onOpenChange,
  onConfirm,
  description = DEFAULT_DESCRIPTION,
}: DeleteAccountDialogProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteSchema),
    defaultValues: { confirmText: "" },
  });

  const confirmText = watch("confirmText");

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = () => {
    onConfirm();
    handleClose();
  };

  // Splits description so "DELETE" is always bold regardless of the text passed in
  const parts = description.split('"DELETE"');

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[90vw] sm:max-w-[562px] p-6 sm:p-8 [&>button]:hidden mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-red-100 mb-4 sm:mb-6">
              <AlertTriangle className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              Delete Account
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              {parts.map((part, i) =>
                i < parts.length - 1 ? (
                  <span key={i}>
                    {part}
                    <span className="font-semibold text-foreground">"DELETE"</span>
                  </span>
                ) : part
              )}
            </p>

            <div className="w-full mb-4 sm:mb-6">
              <InputField
                register={register("confirmText")}
                placeholder='Type "DELETE" to confirm'
                error={errors.confirmText?.message}
                inputClassName="text-center"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full sm:w-[240px] h-[52px] min-w-0 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={confirmText !== "DELETE"}
                className="w-full sm:w-[240px] h-[52px] min-w-0 bg-red-600 hover:bg-red-700 text-white disabled:bg-[rgba(221,30,30,0.60)]"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}