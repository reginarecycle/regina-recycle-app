import { Button } from "@/components/ui/button";

interface DeleteAccountBannerProps {
  title?: string;
  description?: string;
  onDelete: () => void;
  /** Path to decorative image (optional) */
  imageSrc?: string;
}

export function DeleteAccountBanner({
  title = "Delete Account",
  description = "Once you delete your account, there is no going back. Please be certain.",
  onDelete,
  imageSrc,
}: DeleteAccountBannerProps) {
  return (
    <div className="relative flex flex-col sm:flex-row justify-center items-center w-full p-6 sm:p-9 rounded-[14px] border border-red-600 bg-[rgba(221,30,30,0.06)] backdrop-blur-[20px] shrink-0">
      {imageSrc && (
        <img
          src={imageSrc}
          alt=""
          aria-hidden="true"
          className="absolute -top-18 -right-30 w-74 sm:w-50 opacity-40 pointer-events-none select-none hidden sm:block"
        />
      )}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-semibold text-red-600 mb-2">{title}</h3>
          <p className="text-sm text-red-600/80">{description}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-[171px] h-[52px] min-w-0 bg-white text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700 shrink-0"
          onClick={onDelete}
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
}
