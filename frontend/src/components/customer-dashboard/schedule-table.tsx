import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
// npm install date-fns --save
import DataTable from "@/components/ui/data-table";
import { Card } from "../ui/card";

type Material = "Plastic" | "Glass" | "Cardboard" | "Carton" | "Paper";
type Status = "Approved" | "Pending" | "Not Started";

export type ScheduleItem = {
    id: string;
    materials: Material[];
    date: Date;
    status: Status;
    action: string;
};

const schedules: ScheduleItem[] = [
    {
        id: "1",
        materials: ["Glass"],
        date: new Date("2026-01-01"),
        status: "Pending",
        action: "View",
    },
    {
        id: "2",
        materials: ["Cardboard", "Glass"],
        date: new Date(),
        status: "Approved",
        action: "View",
    },
    {
        id: "3",
        materials: ["Cardboard", "Glass", "Plastic"],
        date: new Date("2026-01-02"),
        status: "Not Started",
        action: "View",
    },
    {
        id: "4",
        materials: ["Cardboard", "Glass", "Plastic"],
        date: new Date(),
        status: "Approved",
        action: "View",
    },
    {
        id: "5",
        materials: ["Cardboard", "Glass", "Plastic"],
        date: new Date(),
        status: "Pending",
        action: "View",
    },
    {
        id: "6",
        materials: ["Cardboard", "Glass", "Plastic"],
        date: new Date("2022-03-01"),
        status: "Pending",
        action: "View",
    },
    {
        id: "7",
        materials: ["Cardboard", "Glass", "Plastic"],
        date: new Date(),
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
    const [currentPage, setCurrentPage] = useState(1);

    const scheduleColumns = [
        {
            key: "materials",
            header: "Material",
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
            render: (schedule: ScheduleItem) => (
                <span className="text-[16px] font-medium text-[#111827]">
                    {format(schedule.date, "dd, MMM yyyy")}
                </span>
            ),
        },
        {
            key: "status",
            header: "Status",
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
            render: (schedule: ScheduleItem) => (
                <button className="text-[16px] font-medium text-[#344E41] hover:underline">
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
                {format(schedule.date, "dd, MMM yyyy")}
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
                <button className="flex items-center gap-1 text-[16px] font-medium text-[#344E41] hover:underline">
                    {schedule.action}
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );

    return (
        <Card className="bg-white pt-2 gap-0 pb-0">
            <h1 className="px-4 pb-3 text-[16px] font-bold border-b-1">
                Recent Schedule
            </h1>

            <DataTable
                data={schedules}
                columns={scheduleColumns}
                keyExtractor={(schedule) => schedule.id}
                mobileRender={renderMobileSchedule}
                className="[&_div]:border-none [&_.rounded-md]:border-none [&_thead]:bg-white"
            />
        </Card>
    );
}

export default Schedule;