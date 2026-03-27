import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function NoCollectorsModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md sm:max-w-xl w-full rounded-3xl p-0 overflow-hidden [&>button]:hidden">
        <div className="flex flex-col items-center px-8 pt-10 pb-8">
          <div className="h-24 w-24 rounded-full bg-green-50 flex items-center justify-center mb-4">
            <div className="h-16 w-16 rounded-full border-2 border-primary flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 11c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z" fill="#344E41"/>
              </svg>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Coming Soon!</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
              No collectors are currently available for all or some of your selected materials. Please check back later or try selecting different materials.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 px-8 pb-6 bg-white">
          <Button
            variant="outlineprimary"
            className="min-w-48"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}