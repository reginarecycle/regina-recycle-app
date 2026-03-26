import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import successGif from "@/assets/Success Check.gif";

interface RequestFeedbackModalProps {
  isOpen:       boolean;
  onClose:      () => void;
  type?:        "success" | "error";
  title:        string;
  description:  string;
}

export function RequestFeedbackModal({
  isOpen,
  onClose,
  type = "success",
  title,
  description,
}: RequestFeedbackModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-sm w-[calc(100vw-2rem)] rounded-3xl p-0 gap-0 text-center"
        showCloseButton={false}
      >
        <DialogHeader className="px-8 pt-10 pb-2 flex flex-col items-center">
          {type === "success" ? (
            <img
              src={successGif}
              alt="Success"
              className="mx-auto mb-2 h-28 w-28 object-contain"
            />
          ) : (
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle size={36} className="text-destructive" />
            </div>
          )}
          <DialogTitle className="text-xl font-bold text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="px-8 pb-8 pt-6">
          <Button
            onClick={onClose}
            variant={type === "error" ? "destructive" : "default"}
            className="w-full rounded-xl"
          >
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

