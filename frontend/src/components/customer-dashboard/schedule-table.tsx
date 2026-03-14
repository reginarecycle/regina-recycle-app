import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import DataTable from "@/components/ui/data-table";
import { Card } from "../ui/card";
import { useRouter } from "@/routes/hooks/use-router";

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
                    {format(schedule.date, "dd, MMM yyyy")}
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
                <button className="text-[14px] font-bold text-[#344E41] hover:underline">
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

    const router = useRouter();

    return (
        <Card className="bg-white pt-3 gap-0 pb-0">
            <div className="flex flex-row justify-between px-4 pb-3 text-[16px] font-bold border-b-1">
                <h1>Recent Schedule</h1>
                <h2 className="text-[14px] text-[#344E41] hover:underline"
                    onClick={() => router.push("/app/history")}>
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
    );
}

export default Schedule;