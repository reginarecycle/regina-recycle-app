import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SuccessCheck from "@/assets/Success Check.gif";

type Props = {
  open: boolean;
  onClose: () => void;
  onViewHistory: () => void;
};

export function SuccessModal({ open, onClose, onViewHistory }: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md sm:max-w-xl w-full rounded-3xl p-0 overflow-hidden [&>button]:hidden">
        <div className="flex flex-col items-center  px-8 pt-10 pb-8">
          <img src={SuccessCheck} alt="Success" className="h-36 w-36 object-contain" />
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Pickup Scheduled Successfully!</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
              Please have your items ready at the pickup location by your scheduled time.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 px-8 pb-6 bg-white">
          <Button
            variant="outlineprimary"
            className="min-w-48"
            onClick={onViewHistory}
          >
            View History
          </Button>
          <Button
            className="min-w-48"
            onClick={onClose}
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
