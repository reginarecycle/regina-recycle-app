import { X, User, FileText, CalendarDays, MapPin, Box } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Material = "Glass" | "Plastic" | "Carton" | "Cardboard" | "Paper";

interface ViewDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    referenceNumber?: string;
    status?: "Approved" | "Pending" | "Cancelled";
    collectorName?: string;
    collectorId?: string;
    requestDate?: string;
    scheduledPickupDate?: string;
    pickupLocation?: string;
    materials?: Material[];
    onDownloadReport?: () => void;
}

export function ViewDetailsModal({
    isOpen,
    onClose,
    referenceNumber = "REF-2023-001234",
    status = "Approved",
    collectorName = "Michael Johnson",
    collectorId = "COL-789",
    requestDate = "12, Jan 2023",
    scheduledPickupDate = "14, Jan 2023",
    pickupLocation = "123 Lane, Str. Downtown District",
    materials = ["Glass", "Plastic", "Carton"],
    onDownloadReport,
}: ViewDetailsProps) {
    if (!isOpen) return null;

    const statusStyles = {
        Approved: "bg-[#4AD15F] text-white hover:bg-[#4AD15F]",
        Pending: "bg-[#FFB319] text-white hover:bg-[#FFB319]",
        Cancelled: "bg-[#DC2626] text-white hover:bg-[#DC2626]",
    };

    const detailItems = [
        {
            icon: <User className="h-5 w-5 text-[#6F8F7B]" />,
            label: "Collector Name",
            value: collectorName,
            subValue: `ID: ${collectorId}`,
        },
        {
            icon: <FileText className="h-5 w-5 text-[#6F8F7B]" />,
            label: "Request Date",
            value: requestDate,
        },
        {
            icon: <CalendarDays className="h-5 w-5 text-[#6F8F7B]" />,
            label: "Scheduled Pickup Date",
            value: scheduledPickupDate,
        },
        {
            icon: <MapPin className="h-5 w-5 text-[#6F8F7B]" />,
            label: "Pickup Location",
            value: pickupLocation,
        },
    ];

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] p-4">
            <div className="flex min-h-full items-center justify-center">
                <div className="flex w-full max-w-[560px] max-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-[16px] bg-white shadow-2xl">
                    {/* header */}
                    <div className="flex shrink-0 items-center justify-between border-b border-[#E5E7EB] px-7 py-5">
                        <h2 className="text-[24px] leading-8 font-bold text-black">
                            Schedule Details
                        </h2>

                        <button
                            onClick={onClose}
                            aria-label="Close modal"
                            className="rounded-md p-1 text-[#111827] transition hover:bg-gray-100"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* scrollable body */}
                    <div className="min-h-0 flex-1 overflow-y-auto">
                        <div className="px-7 py-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="text-[14px] leading-5 font-medium text-[#6B7280]">
                                        Reference Number
                                    </p>
                                    <p className="mt-1 text-[18px] leading-7 font-bold text-[#111827]">
                                        {referenceNumber}
                                    </p>
                                </div>

                                <Badge
                                    className={`rounded-full px-5 py-1 text-[12px] font-bold uppercase tracking-[0.14em] ${statusStyles[status]}`}
                                >
                                    {status}
                                </Badge>
                            </div>

                            <div className="mt-4 border-t border-[#E5E7EB]" />

                            <div className="mt-7 space-y-7">
                                {detailItems.map((item) => (
                                    <div key={item.label} className="flex items-start gap-4">
                                        <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[12px] bg-[#F5F5F5]">
                                            {item.icon}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-[14px] leading-5 font-medium text-[#6B7280]">
                                                {item.label}
                                            </p>
                                            <p className="mt-1 text-[16px] leading-6 font-bold text-[#111827] break-words">
                                                {item.value}
                                            </p>
                                            {item.subValue && (
                                                <p className="mt-1 text-[14px] leading-5 text-[#4B5563]">
                                                    {item.subValue}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Card className="mt-7 rounded-3xl border-0 bg-[#F7F7F7] px-4 pt-5 pb-4 shadow-none !gap-0">
                                <div className="flex items-center gap-2">
                                    <Box className="h-5 w-5 text-[#6F8F7B]" />
                                    <h3 className="text-[16px] leading-6 font-bold text-black">
                                        Materials Collected
                                    </h3>
                                </div>

                                <div className="mt-4 rounded-[14px] bg-white px-4 py-3">
                                    <div className="flex flex-wrap gap-3">
                                        {materials.map((material) => (
                                            <Badge
                                                key={material}
                                                className="rounded-full bg-[#6F8F7B] px-6 py-2 text-[14px] font-semibold text-white hover:bg-[#6F8F7B]"
                                            >
                                                {material}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* footer */}
                    <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-[#E5E7EB] bg-white px-7 py-5 sm:flex-row sm:justify-end">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="h-[44px] min-w-[98px] rounded-[12px] border-[#D1D5DB] bg-white text-[16px] font-semibold text-[#111827] hover:bg-gray-50"
                        >
                            Close
                        </Button>

                        <Button
                            onClick={onDownloadReport}
                            className="h-[44px] min-w-[182px] rounded-[12px] bg-[#6F8F7B] text-[16px] font-semibold text-white hover:bg-[#5F7F6B]"
                        >
                            Download Report
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewDetailsModal;