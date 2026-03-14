import { AlertTriangle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface RejectRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: (payload: { reason: string; comments: string }) => void;
}

const rejectionReasons = [
    "Not available at requested time",
    "Location too far",
    "Materials not accepted",
    "Insufficient payout",
    "Other",
];

export function RejectRequestModal({
    isOpen,
    onClose,
    onConfirm,
}: RejectRequestModalProps) {
    const [reason, setReason] = useState("");
    const [comments, setComments] = useState("");
    const [showReasons, setShowReasons] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (!reason) return;
        onConfirm?.({
            reason,
            comments,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-[660px] rounded-[28px] bg-white px-12 py-10 shadow-2xl">
                {/* Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="flex h-[96px] w-[96px] items-center justify-center rounded-full bg-[#FDE2E2]">
                        <AlertTriangle className="h-10 w-10 fill-[#E52421] text-[#E52421]" strokeWidth={2.5} />
                    </div>
                </div>

                {/* Heading */}
                <div className="mb-10 text-center">
                    <h2 className="mb-3 text-[24px] font-bold text-black">
                        Reject this request?
                    </h2>
                    <p className="mx-auto max-w-[380px] text-[16px] leading-8 text-[#9CA3AF]">
                        This action cannot be undone. Please specify why you're
                        declining this pickup.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Reason */}
                    <div>
                        <label className="mb-3 block text-[16px] font-medium text-[#111827]">
                            Reason for Rejection <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowReasons((prev) => !prev)}
                                className="flex h-[56px] w-full items-center justify-between rounded-[14px] border border-[#D1D5DB] bg-white px-4 text-left text-[16px] text-[#9CA3AF]"
                            >
                                <span className={reason ? "text-[#111827]" : "text-[#9CA3AF]"}>
                                    {reason || "Select a reason..."}
                                </span>
                                <ChevronDown className="h-5 w-5 text-[#111827]" />
                            </button>

                            {showReasons && (
                                <div className="absolute z-10 mt-2 w-full rounded-[14px] border border-[#E5E7EB] bg-white shadow-lg">
                                    {rejectionReasons.map((item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => {
                                                setReason(item);
                                                setShowReasons(false);
                                            }}
                                            className="w-full px-4 py-3 text-left text-[15px] text-[#111827] hover:bg-[#F9FAFB]"
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Comments */}
                    <div>
                        <label className="mb-3 block text-[16px] font-medium text-[#111827]">
                            Additional Comments (Optional)
                        </label>

                        <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Narration.."
                            className="min-h-[110px] w-full rounded-[14px] border border-[#D1D5DB] px-4 py-4 text-[16px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#C7C7C7]"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-14 grid grid-cols-2 gap-7">
                    <Button
                        type="button"
                        onClick={onClose}
                        variant="destructive"
                        className="h-[58px] rounded-[14px] border border-[#FF3B30] bg-white text-[18px] font-semibold text-[#FF3B30] hover:bg-red-50"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!reason}
                        className="h-[58px] rounded-[14px] bg-[#E57373] text-[18px] font-semibold text-white hover:bg-[#dc6666] disabled:cursor-not-allowed disabled:bg-[#F2A5A5]"
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    );
}