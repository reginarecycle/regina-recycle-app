import { CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onViewActivePickups: () => void;
}

export function RequestAcceptedModal({
    isOpen,
    onClose,
    onViewActivePickups,
}: SuccessModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

            <div className="w-full max-w-[500px] rounded-2xl bg-white shadow-2xl overflow-hidden">

                <div className="px-8 pt-10 pb-8 text-center">

                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-12 w-12 text-green-600" strokeWidth={2.5} />
                    </div>

                    {/* Main heading */}
                    <h2 className="mb-3 text-2xl font-bold text-gray-900">
                        Request Successfully
                        <br />
                        Accepted!
                    </h2>

                    {/* Subtitle / description */}
                    <p className="mb-8 text-base text-gray-600 leading-relaxed">
                        This pickup has been added to your Active Pickups. You can start the route from your dashboard.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center !h-[52px]">
                        <Button
                            onClick={onClose}
                            className="min-w-[210px] h-[56px] rounded-[14px] border border-red-400 bg-white text-[16px] font-semibold text-red-500 hover:bg-red-50"

                        >
                            Close
                        </Button>

                        <Button
                            onClick={() => {
                                onViewActivePickups();
                                onClose();
                            }}
                            className="min-w-[210px] h-[56px] rounded-[14px] bg-[#344E41] text-[16px] font-semibold text-white hover:bg-[#2B4035] disabled:cursor-not-allowed disabled:bg-[#A7B3AC]"

                        >
                            View Active Pickups
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}