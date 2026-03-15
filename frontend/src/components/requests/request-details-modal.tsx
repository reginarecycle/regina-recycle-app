import { X, MapPin, CheckCircle2, XCircle } from "lucide-react";
import { RequestsData } from "@/components/requests/requests-data";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import ProfilePhoto from "../shared/profile-photo";

type RequestRow = (typeof RequestsData)[number];
type RequestTab = "incoming" | "accepted" | "completed" | "rejected";

interface RequestDetailsModalProps {
    isOpen: boolean;
    request: RequestRow | null;
    onClose: () => void;
    onAccept?: () => void;
    onReject?: () => void;
    requestNum: string;
    earnings: number;
    estUnits: number;
    compatibilityStr: string;
    username: string;
    sourceTab: RequestTab;
}

export function RequestDetailsModal({
    isOpen,
    request,
    onClose,
    onAccept,
    onReject,
    requestNum,
    earnings,
    estUnits,
    compatibilityStr,
    username,
    sourceTab,
}: RequestDetailsModalProps) {
    if (!isOpen || !request) return null;

    const isIncompatible = compatibilityStr.toLowerCase().includes("incompatible");
    const showActionButtons = sourceTab === "incoming";

    const orderSummary = [
        { material: "Glass bottles", estimatedUnits: 44, price: 100.0 },
        { material: "Tins/Cans", estimatedUnits: 24, price: 10.0 },
        { material: "Drink boxes", estimatedUnits: 16, price: 12.5 },
    ];

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
            <div className="absolute inset-y-0 right-0 flex w-full justify-end">
                <div className="h-full w-full max-w-[490px] overflow-y-auto bg-[#F8F8F8] shadow-2xl">
                    <div className="relative border-b border-gray-200 bg-white px-6 pt-6 pb-5">
                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
                            aria-label="Close drawer"
                        >
                            <X size={18} />
                        </button>

                        <h2 className="text-[18px] font-bold text-black">Request Details</h2>
                        <p className="mt-1 text-[14px] font-medium text-[#111827BF]">
                            {requestNum ?? "#REQ-1233456"}
                        </p>
                    </div>

                    <div
                        className={`px-4 py-6 md:px-5 ${isIncompatible ? "bg-[#DC2626]" : "bg-[#344E41] top-[92px]"
                            }`}
                    >
                        <div className="mb-4 flex items-start justify-between gap-3">
                            <div className="text-[14px] font-medium uppercase tracking-wide text-white/95">
                                Potential Earnings
                            </div>

                            <Badge
                                className={`rounded-full px-4 py-1 text-[13px] font-semibold ${isIncompatible
                                    ? "bg-[#FEE2E2] text-[#991B1B] hover:bg-[#FEE2E2]"
                                    : "bg-[#DDF5E4] text-[#2F6B4F] hover:bg-[#DDF5E4]"
                                    }`}
                            >
                                {compatibilityStr}
                            </Badge>
                        </div>

                        <div className="mb-6 text-[30px] leading-none font-bold text-white">
                            ${earnings.toFixed(2)}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div
                                className={`rounded-xl px-4 py-3 text-white ${isIncompatible ? "bg-[#F19A9A]" : "bg-white/35"
                                    }`}
                            >
                                <div className="text-[13px] uppercase text-white/85">
                                    Pickup Window
                                </div>
                                <div className="mt-2 text-[14px] font-medium">
                                    {request.Date} • {request.startTime} - {request.endTime}
                                </div>
                            </div>

                            <div
                                className={`rounded-xl px-4 py-3 text-white ${isIncompatible ? "bg-[#F19A9A]" : "bg-white/35"
                                    }`}
                            >
                                <div className="text-[13px] uppercase text-white/85">
                                    Total Estimated Units
                                </div>
                                <div className="mt-2 text-[14px] font-medium">
                                    {estUnits} units
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 px-4 py-5 md:px-5">
                        <div>
                            <h3 className="mb-3 text-[14px] font-medium uppercase tracking-wide text-[#999CA0]">
                                Order Summary
                            </h3>

                            <Card className="overflow-hidden rounded-2xl border border-[#D1D5DB] bg-white shadow-sm py-3">
                                <div className="grid grid-cols-3 border-b border-[#E5E7EB] px-6 pb-2 text-[14px] font-semibold text-[#9CA3AF]">
                                    <div>Material</div>
                                    <div className="text-center">Estimated Units</div>
                                    <div className="text-right">Price</div>
                                </div>

                                {orderSummary.map((item, index) => (
                                    <div
                                        key={item.material}
                                        className={`grid grid-cols-3 px-6 pb-2 text-[14px] ${index !== orderSummary.length - 1
                                            ? "border-b border-[#E5E7EB]"
                                            : ""
                                            }`}
                                    >
                                        <div className="font-medium text-[#344E41]">{item.material}</div>
                                        <div className="text-center font-semibold text-[#111827]">
                                            {item.estimatedUnits}
                                        </div>
                                        <div className="text-right font-semibold text-[#111827]">
                                            ${item.price.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </Card>
                        </div>

                        <Card className="rounded-2xl border border-[#D1D5DB] bg-white px-5 shadow-sm">
                            <h3 className="mb-3 text-[14px] font-medium uppercase tracking-wide text-[#4B5563] -mt-2">
                                User & Location
                            </h3>

                            <div className="-mt-7 border-t border-[#E5E7EB] pt-3">
                                <div className="mb-4 flex items-center gap-3">
                                    <ProfilePhoto name={username} />

                                    <div>
                                        <div className="text-[18px] font-medium text-[#111827]">
                                            {username}
                                        </div>
                                        <div className="text-[14px] text-[#9CA3AF]">(124 pickups)</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2 text-[#374151]">
                                    <MapPin size={18} className="mt-1 text-[#344E41]" />
                                    <span className="text-[16px]">{request.Location}</span>
                                </div>
                            </div>
                        </Card>

                        <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white px-5 py-4">
                            <h3 className="mb-3 text-[14px] font-medium uppercase tracking-wide text-[#4B5563]">
                                Note from User
                            </h3>

                            <div className="border-t border-[#E5E7EB] pt-3 text-[14px] leading-7 text-[#4B5563]">
                                Please ring the back doorbell when you arrive. Bags are labeled
                                "Recycling" and placed near the garage door.
                            </div>
                        </div>
                    </div>

                    {showActionButtons && (
                        <div className="border-t border-[#E5E7EB] bg-[#F8F8F8] p-5">
                            <div className="flex w-full gap-4">
                                <Button
                                    onClick={onReject ?? onClose}
                                    variant="destructive"
                                    className="min-w-[180px] flex-1 flex items-center justify-center gap-2 rounded-xl border border-red-400 bg-white text-[16px] font-semibold text-red-500 hover:bg-red-50 h-[48px]"
                                >
                                    <XCircle size={18} />
                                    Reject
                                </Button>

                                <Button
                                    onClick={onAccept}
                                    className="min-w-[180px] flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#344E41] text-white hover:bg-[#2B4035] h-[48px]"
                                >
                                    <CheckCircle2 size={18} />
                                    Accept
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}