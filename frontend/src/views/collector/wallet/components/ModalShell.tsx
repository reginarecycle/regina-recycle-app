import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ModalShellProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function ModalShell({ open, onClose, title, subtitle, children }: ModalShellProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="p-0 gap-0 max-w-[480px] w-full rounded-2xl overflow-hidden border border-border [&>button]:hidden">
        <div className="flex items-start justify-between px-6 pt-6 pb-4 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors shrink-0 ml-4"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="h-px bg-border shrink-0" />
        <div className="flex flex-col min-h-[420px]">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
