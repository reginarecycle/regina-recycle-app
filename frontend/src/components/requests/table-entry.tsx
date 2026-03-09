import {
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { RequestAcceptedModal } from "@/components/requests/request-accepted";
import { RequestDetailsModal } from "@/components/requests/request-details";

type Material = 'Plastic' | 'Glass' | 'Cardboard' | 'Carton' | 'Paper';

type RequestProps = {
    Username: string;
    Location: string;
    material1: Material;
    material2?: Material;
    material3?: Material;
    Date: string;
    startTime: string;
    endTime: string;
    Comparability: number;
    Action?: string;
    estimatedPayment?: number;
    payout?: number;
    status: "incoming" | "accepted" | "completed";
    onComplete?: (username: string) => void;
    // You can add more fields later that RequestDetailsModal needs
};

export function TableEntry({
    Username = "John Doe",
    Location = "somewhere",
    material1 = 'Plastic',
    material2,
    material3,
    Date = "1, Jan 2026",
    startTime = "12pm",
    endTime = "2pm",
    Comparability = 0,
    Action = "View Details",
    estimatedPayment = 0,
    payout,
    status = "incoming",
    onComplete,
}: RequestProps) {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const materials = [material1];
    if (material2) materials.push(material2);
    if (material3) materials.push(material3);

    const compatible = Comparability === 100;

    const displayAmount =
        status === "accepted"
            ? estimatedPayment
            : status === "completed"
                ? (payout ?? estimatedPayment ?? 0)
                : 0;

    const actionLabel =
        status === "incoming" ? "View Details" :
            status === "accepted" ? "Complete" :
                "View Details";

    const handleComplete = () => {
        onComplete?.(Username);
        setShowSuccessModal(true);
    };

    const handleViewDetails = () => {
        setShowDetailsModal(true);
    };

    return (
        <>
            <TableRow className="border-b hover:bg-muted/30 transition-colors">
                {/* Username */}
                <TableCell className="w-[15%] px-6 py-5 text-[14px] font-bold text-black">
                    {Username}
                </TableCell>

                {/* Location */}
                <TableCell className="w-[16%] text-[14px] font-bold text-gray-900">
                    {Location}
                </TableCell>

                {/* Materials – only Incoming */}
                {status === "incoming" && (
                    <TableCell className="w-[27%]">
                        <div className="flex gap-2 flex-wrap">
                            {materials.map((material, idx) => (
                                <Badge
                                    key={idx}
                                    className="bg-[#5f7f6e] hover:bg-[#5f7f6e] text-white text-[12px] px-3 py-1 rounded-full font-bold"
                                >
                                    {material}
                                </Badge>
                            ))}
                        </div>
                    </TableCell>
                )}

                {/* Date & Time */}
                <TableCell className="w-[15%]">
                    <div className="flex flex-col text-[14px] font-bold text-black gap-1">
                        <span>{Date},</span>
                        <span>{startTime} - {endTime}</span>
                    </div>
                </TableCell>

                {/* Comparability */}
                <TableCell className="w-[15%]">
                    {compatible ? (
                        <div className="bg-green-100 text-green-700 text-[12px] font-bold px-3 py-1 rounded-full w-fit">
                            {Comparability}%
                        </div>
                    ) : (
                        <div className="bg-red-100 text-red-600 text-[12px] font-bold px-3 py-1 rounded-full w-fit">
                            INCOMPATIBLE
                        </div>
                    )}
                </TableCell>

                {/* Payout ($) – Accepted & Completed */}
                {(status === "accepted" || status === "completed") && (
                    <TableCell className="w-[12%] text-[14px] font-bold text-black">
                        ${displayAmount}
                    </TableCell>
                )}

                {/* Action */}
                <TableCell className="w-[12%]">
                    {status === "accepted" ? (
                        <button
                            onClick={handleComplete}
                            className="border border-[#4D7C63] text-[#4D7C63] px-4 py-1 rounded-md font-medium hover:bg-[#4D7C63] hover:text-white transition"
                        >
                            Complete
                        </button>
                    ) : (
                        <div
                            onClick={handleViewDetails}
                            className="flex items-center gap-1 text-[14px] font-bold text-black cursor-pointer hover:underline"
                        >
                            {actionLabel}
                            <ChevronRight size={16} />
                        </div>
                    )}
                </TableCell>
            </TableRow>

            {/* Success Modal – appears after clicking Complete (Accepted tab) */}
            <RequestAcceptedModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                onViewActivePickups={() => {
                    setShowSuccessModal(false);
                    // navigate or setActiveTab logic here in parent
                }}
            />

            {/* Request Details Modal – appears after clicking View Details */}
            <RequestDetailsModal
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                onAccept={() => {
                    // handle accept logic (e.g. call API, show success modal, etc.)
                    setShowDetailsModal(false);
                    // You might want to trigger the success modal here too
                    // setShowSuccessModal(true);
                }}
                onReject={() => {
                    // handle reject logic
                    setShowDetailsModal(false);
                }}
            />
        </>
    );
}