import { AlertTriangle, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const REJECTION_REASONS = [
  "Schedule conflict",
  "Location too far",
  "Material not supported",
  "At full capacity",
  "Other",
];

const rejectSchema = z.object({
  reason:  z.string().min(1, "Please select a reason for rejection"),
  comment: z.string().optional(),
});

type RejectFormValues = z.infer<typeof rejectSchema>;

interface RejectRequestModalProps {
  isOpen:     boolean;
  onClose:    () => void;
  onConfirm:  (reason: string, comment?: string) => void;
  isPending?: boolean;
}

export function RejectRequestModal({
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
}: RejectRequestModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RejectFormValues>({
    resolver: zodResolver(rejectSchema),
    defaultValues: { reason: "", comment: "" },
  });

  function handleClose() {
    reset();
    onClose();
  }

  function onSubmit(data: RejectFormValues) {
    onConfirm(data.reason, data.comment || undefined);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="max-w-sm w-[calc(100vw-2rem)] rounded-3xl p-0 gap-0"
        showCloseButton={false}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center px-8 pt-10 pb-8 gap-5">

            {/* Icon */}
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle size={36} className="text-destructive" />
            </div>

            {/* Title + description */}
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground">Reject this request?</h2>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-sm">
                This action cannot be undone. Please specify why you're declining this pickup.
              </p>
            </div>

            {/* Reason */}
            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.reason} className="w-full">
                  <FieldLabel>
                    Reason for Rejection <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className="w-full h-10 rounded-md border border-ring bg-input px-3 text-sm font-medium shadow-xs focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:ring-[3px] data-placeholder:text-muted-foreground data-placeholder:font-normal"
                    >
                      <SelectValue placeholder="Select a reason..." />
                    </SelectTrigger>
                    <SelectContent>
                      {REJECTION_REASONS.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.reason && (
                    <FieldError errors={[{ message: errors.reason.message }]} />
                  )}
                </Field>
              )}
            />

            {/* Comment */}
            <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <Field className="w-full">
                  <FieldLabel>Additional Comments (Optional)</FieldLabel>
                  <Textarea
                    {...field}
                    placeholder="Narration.."
                    className="min-h-28 resize-none"
                  />
                </Field>
              )}
            />

            {/* Buttons */}
            <div className="grid w-full grid-cols-2 gap-3">
              <Button type="button" onClick={handleClose} variant="destructiveoutline">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                variant="destructive"
                className="flex items-center justify-center gap-2"
              >
                {isPending && <Loader2 size={15} className="animate-spin" />}
                {isPending ? "Rejecting..." : "Confirm"}
              </Button>
            </div>

          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
