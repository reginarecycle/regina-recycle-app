import { useEffect, useState } from "react";
import { X, Wallet, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";

interface CollectionItem {
    material: string;
    expectedUnits: number;
    unitPrice: number;
    actualUnits: number;
}

interface CompleteRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete?: (updatedItems: CollectionItem[]) => void;
    requestId?: string;
    customer?: string;
    location?: string;
    dateTime?: string;
    compatibility?: string;
    balance?: number;
    note?: string;
    setNote?: (value: string) => void;
    items?: CollectionItem[];
}

const defaultItems: CollectionItem[] = [
    {
        material: "Plastic Bottles",
        expectedUnits: 50,
        unitPrice: 1.5,
        actualUnits: 50,
    },
    {
        material: "Cardboard Boxes",
        expectedUnits: 20,
        unitPrice: 2,
        actualUnits: 20,
    },
    {
        material: "Glass Jars",
        expectedUnits: 10,
        unitPrice: 2,
        actualUnits: 10,
    },
];

export function CompleteRequestModal({
    isOpen,
    onClose,
    onComplete,
    requestId = "REQ001",
    customer = "Nolan Roberts",
    location = "524, Rae street",
    dateTime = "14, Jan 2023, 10am - 12pm",
    compatibility = "100%",
    balance = 850,
    note = "",
    setNote,
    items = defaultItems,
}: CompleteRequestModalProps) {
    const [editableItems, setEditableItems] = useState<CollectionItem[]>(items);

    useEffect(() => {
        if (isOpen) {
            setEditableItems(items);
        }
    }, [isOpen, items]);

    if (!isOpen) return null;

    const handleActualUnitsChange = (index: number, value: string) => {
        const parsedValue = value === "" ? 0 : Math.max(0, Number(value));

        if (Number.isNaN(parsedValue)) return;

        setEditableItems((prev) =>
            prev.map((item, i) =>
                i === index
                    ? {
                        ...item,
                        actualUnits: parsedValue,
                    }
                    : item
            )
        );
    };

    const estimatedPayout = editableItems.reduce(
        (sum, item) => sum + item.expectedUnits * item.unitPrice,
        0
    );

    const updatedTotalPayout = editableItems.reduce(
        (sum, item) => sum + item.actualUnits * item.unitPrice,
        0
    );

    const hasEnoughBalance = balance >= updatedTotalPayout;

    const handleCompleteRequest = () => {
        if (!hasEnoughBalance) return;
        onComplete?.(editableItems);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="relative max-h-[90vh] w-full max-w-[820px] overflow-y-auto rounded-[24px] bg-white shadow-2xl">
                <div className="relative border-b border-[#E5E7EB] px-6 py-6">
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F4F6] text-[#6B7280] transition hover:bg-[#E5E7EB]"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>

                    <h2 className="text-[20px] font-semibold text-[#111827]">
                        Complete Request
                    </h2>
                    <p className="mt-2 text-[14px] text-[#9CA3AF]">
                        Request ID: {requestId}
                    </p>
                </div>

                <div className="space-y-6 px-6 py-6">
                    <div className="grid grid-cols-1 gap-y-6 rounded-[18px] bg-[#F7F7F7] px-5 py-5 md:grid-cols-2">
                        <div className="space-y-6">
                            <div>
                                <p className="mb-2 text-[13px] uppercase text-[#9CA3AF]">
                                    Customer
                                </p>
                                <p className="text-[16px] font-medium text-[#111827]">
                                    {customer}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-[13px] uppercase text-[#9CA3AF]">
                                    Date & Time
                                </p>
                                <p className="text-[16px] font-medium text-[#111827]">
                                    {dateTime}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <p className="mb-2 text-[13px] uppercase text-[#9CA3AF]">
                                    Location
                                </p>
                                <p className="text-[16px] font-medium text-[#111827]">
                                    {location}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-[13px] uppercase text-[#9CA3AF]">
                                    Compatibility
                                </p>

                                <span
                                    className={`inline-flex rounded-full px-4 py-1 text-[14px] font-medium ${compatibility === "100%"
                                        ? "bg-[#DCFCE7] text-[#22C55E]"
                                        : "bg-[#FEE2E2] text-[#EF4444]"
                                        }`}
                                >
                                    {compatibility}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-4 text-[18px] font-medium text-[#111827]">
                            Update Collection Details
                        </h3>

                        <div className="space-y-4">
                            {editableItems.map((item, index) => {
                                const total = item.actualUnits * item.unitPrice;

                                return (
                                    <div
                                        key={`${item.material}-${index}`}
                                        className="flex flex-col gap-4 rounded-[18px] bg-[#F7F7F7] px-5 py-5 md:flex-row md:items-center md:justify-between"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[16px] font-medium text-[#111827]">
                                                {item.material}
                                            </p>
                                            <p className="mt-1 text-[14px] text-[#9CA3AF]">
                                                Expected: {item.expectedUnits} units @ $
                                                {item.unitPrice.toFixed(2)}/unit
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 md:justify-end">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[16px] text-[#9CA3AF]">
                                                    Actual:
                                                </span>

                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={item.actualUnits}
                                                    onChange={(e) =>
                                                        handleActualUnitsChange(
                                                            index,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="h-[44px] w-[92px] rounded-[12px] border border-[#D1D5DB] bg-white px-4 text-[16px] text-[#111827] outline-none focus:border-[#9CA3AF]"
                                                />
                                            </div>

                                            <div className="min-w-[90px] text-right text-[16px] font-medium text-[#111827]">
                                                ${total.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="mb-3 block text-[16px] font-medium text-[#111827]">
                            Note (Optional)
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote?.(e.target.value)}
                            placeholder="Add any additional notes about this collection....."
                            className="min-h-[110px] w-full rounded-[14px] border border-[#D1D5DB] px-4 py-4 text-[16px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#9CA3AF]"
                        />
                    </div>

                    <div className="border-t border-[#E5E7EB] pt-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Wallet className="text-[#3B82F6]" size={22} />
                                <span className="text-[16px] font-medium text-[#111827]">
                                    Your Balance:
                                </span>
                            </div>
                            <span className="text-[20px] font-medium text-[#3B82F6]">
                                ${balance.toFixed(2)}
                            </span>
                        </div>

                        <div className="mb-5 flex items-center justify-between">
                            <span className="text-[16px] font-medium text-[#111827]">
                                Estimated Payout:
                            </span>
                            <span className="text-[16px] text-[#9CA3AF]">
                                ${estimatedPayout.toFixed(2)}
                            </span>
                        </div>

                        <div className="mb-5 flex items-center justify-between rounded-[18px] bg-[#F7F7F7] px-5 py-5">
                            <span className="text-[18px] font-medium text-[#111827]">
                                Updated Total Payout:
                            </span>
                            <span className="text-[20px] font-medium text-[#22C55E]">
                                ${updatedTotalPayout.toFixed(2)}
                            </span>
                        </div>

                        <div
                            className={`rounded-[16px] border px-5 py-5 ${hasEnoughBalance
                                ? "border-[#22C55E] bg-[#DCFCE7]"
                                : "border-[#EF4444] bg-[#FEE2E2]"
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <CheckCircle
                                    size={20}
                                    className={
                                        hasEnoughBalance
                                            ? "text-[#22C55E]"
                                            : "text-[#EF4444]"
                                    }
                                />
                                <div>
                                    <p
                                        className={`text-[16px] font-medium ${hasEnoughBalance
                                            ? "text-[#22C55E]"
                                            : "text-[#EF4444]"
                                            }`}
                                    >
                                        {hasEnoughBalance
                                            ? "Ready to Complete"
                                            : "Insufficient Balance"}
                                    </p>
                                    <p className="mt-2 text-[14px] text-[#6B7280]">
                                        {hasEnoughBalance
                                            ? "You have sufficient balance to complete this request. The payout amount will be deducted from your account."
                                            : "Your balance is too low to complete this request. Please top up your balance first."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#E5E7EB] bg-white px-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            onClick={onClose}
                            variant="destructive"
                            className="min-w-[210px] h-[56px] rounded-[14px] border border-red-400 bg-white text-[16px] font-semibold text-red-500 hover:bg-red-50"
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleCompleteRequest}
                            disabled={!hasEnoughBalance}
                            className="min-w-[210px] h-[56px] rounded-[14px] bg-[#344E41] text-[16px] font-semibold text-white hover:bg-[#2B4035] disabled:cursor-not-allowed disabled:bg-[#A7B3AC]"
                        >
                            Complete Request
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}