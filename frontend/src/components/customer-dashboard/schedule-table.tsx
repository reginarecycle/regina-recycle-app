import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/ui/data-table";
import { Card } from "../ui/card";
import { useRouter } from "@/routes/hooks/use-router";
import ViewDetailsModal from "./view-details-modal";

type Material = "Plastic" | "Glass" | "Cardboard" | "Carton" | "Paper";
type Status = "Approved" | "Pending" | "Not Started";

export type ScheduleItem = {
    id: string;
    materials: Material[];
    date: string;
    status: Status;
    action: string;
};

const schedules: ScheduleItem[] = [
    {
        id: "1",
        materials: ["Glass"],
        date: "2026-01-01",
        status: "Pending",
        action: "View",
    },
    {
        id: "2",
        materials: ["Cardboard", "Glass"],
        date: "2026-01-01",
        status: "Approved",
        action: "View",
    },
    {
        id: "3",
        materials: ["Cardboard", "Glass", "Plastic"],
        date: "2026-01-02",
        status: "Not Started",
        action: "View",
    },
    {
        id: "4",
        materials: ["Cardboard", "Glass", "Plastic"],
        date: "2026-01-01",
        status: "Approved",
        action: "View",
    },
    {
        id: "5",
        materials: ["Cardboard", "Glass", "Plastic"],
        date: "2026-01-01",
        status: "Pending",
        action: "View",
    },
    {
        id: "6",
        materials: ["Cardboard", "Glass", "Plastic"],
        date: "2022-03-01",
        status: "Pending",
        action: "View",
    },
    {
        id: "7",
        materials: ["Cardboard", "Glass", "Plastic"],
        date: "2022-03-01",
        status: "Approved",
        action: "View",
    },
];

const getStatusClass = (status: Status) => {
    if (status === "Approved") {
        return "bg-[#4AD15F] hover:bg-[#4AD15F] text-white";
    }

    if (status === "Pending") {
        return "bg-[#FFB319] hover:bg-[#FFB319] text-white";
    }

    return "bg-red-600 hover:bg-red-600 text-white";
};

export function Schedule() {
    const router = useRouter();
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);

    const handleOpenDetails = (schedule: ScheduleItem) => {
        setSelectedSchedule(schedule);
        setIsDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setIsDetailsOpen(false);
        setSelectedSchedule(null);
    };

    const scheduleColumns = [
        {
            key: "materials",
            header: "Material",
            className: "w-[40%]",
            headerClassName: "w-[40%]",
            render: (schedule: ScheduleItem) => (
                <div className="flex flex-wrap gap-2">
                    {schedule.materials.map((material, idx) => (
                        <Badge
                            key={idx}
                            className="rounded-full bg-[#6F8F7B] px-4 py-1 text-[14px] font-medium text-white hover:bg-[#6F8F7B]"
                        >
                            {material}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            key: "date",
            header: "Schedule Date",
            className: "w-[28%]",
            headerClassName: "w-[28%]",
            render: (schedule: ScheduleItem) => (
                <span className="text-[14px] font-bold text-[#111827]">
                    {schedule.date}
                </span>
            ),
        },
        {
            key: "status",
            header: "Status",
            className: "w-[18%]",
            headerClassName: "w-[18%]",
            render: (schedule: ScheduleItem) => (
                <Badge
                    className={`rounded-full px-3 py-1 text-[12px] font-semibold ${getStatusClass(
                        schedule.status
                    )}`}
                >
                    {schedule.status}
                </Badge>
            ),
        },
        {
            key: "action",
            header: "Action",
            className: "w-[14%]",
            headerClassName: "w-[14%]",
            render: (schedule: ScheduleItem) => (
                <button
                    onClick={() => handleOpenDetails(schedule)}
                    className="text-[14px] font-bold text-[#344E41] hover:underline"
                >
                    {schedule.action}
                </button>
            ),
        },
    ];

    const renderMobileSchedule = (schedule: ScheduleItem) => (
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-none">
            <div className="flex flex-wrap gap-2">
                {schedule.materials.map((material, idx) => (
                    <Badge
                        key={idx}
                        className="rounded-full bg-[#6F8F7B] px-4 py-1 text-[14px] font-medium text-white hover:bg-[#6F8F7B]"
                    >
                        {material}
                    </Badge>
                ))}
            </div>

            <div className="mt-3 text-[14px] text-[#6B7280]">
                Schedule Date
            </div>
            <div className="text-[16px] font-medium text-[#111827]">
                {schedule.date}
            </div>

            <div className="mt-3 text-[14px] text-[#6B7280]">Status</div>
            <div className="mt-1">
                <Badge
                    className={`rounded-full px-3 py-1 text-[12px] font-semibold ${getStatusClass(
                        schedule.status
                    )}`}
                >
                    {schedule.status}
                </Badge>
            </div>

            <div className="mt-4">
                <button
                    onClick={() => handleOpenDetails(schedule)}
                    className="flex items-center gap-1 text-[16px] font-medium text-[#344E41] hover:underline"
                >
                    {schedule.action}
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );

    const modalStatus =
        selectedSchedule?.status === "Approved"
            ? "Approved"
            : selectedSchedule?.status === "Pending"
                ? "Pending"
                : "Cancelled";

    return (
        <>
            <Card className="bg-white pt-3 gap-0 pb-0">
                <div className="flex flex-row justify-between px-4 pb-3 text-[16px] font-bold border-b-1">
                    <h1>Recent Schedule</h1>
                    <h2
                        className="text-[14px] text-[#344E41] hover:underline cursor-pointer"
                        onClick={() => router.push("/app/history")}
                    >
                        View More
                    </h2>
                </div>

                <DataTable
                    data={schedules}
                    columns={scheduleColumns}
                    keyExtractor={(schedule) => schedule.id}
                    mobileRender={renderMobileSchedule}
                    className="[&_div]:border-none [&_.rounded-md]:border-none [&_thead]:bg-white"
                />
            </Card>

            <ViewDetailsModal
                isOpen={isDetailsOpen}
                onClose={handleCloseDetails}
                referenceNumber={`REF-2023-00${selectedSchedule?.id ?? "1234"}`}
                status={modalStatus}
                collectorName="Michael Johnson"
                collectorId="COL-789"
                requestDate={selectedSchedule?.date ?? ""}
                scheduledPickupDate={selectedSchedule?.date ?? ""}
                pickupLocation="123 Lane, Str. Downtown District"
                materials={selectedSchedule?.materials ?? []}
            />
        </>
    );
}

export default Schedule;