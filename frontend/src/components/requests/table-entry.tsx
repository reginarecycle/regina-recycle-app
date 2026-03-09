import {
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";
import { MapPin } from "lucide-react"
import ProfilePhoto from "../shared/profile-photo";

type RequestProps = {
    Customer: string;
    Location: string;
    PhoneNumber: string;
    Email: string;
    Status: "Active" | "Inactive" | "New";
    Currency: string;
    Collections: number;
    Earnings: "Loss" | "Gains";
    Action: string;
};

export function TableEntry({
    Customer = "John Doe",
    Location = "somewhere",
    PhoneNumber = "+ (306) 345 - 098",
    Email = "John.Doe@uregina.ca",
    Status = "New",
    Currency = "CAD",
    Collections = 0,
    Earnings = "Gains",
    Action = "View More",
}: RequestProps) {

    const statusVariant = {
        Active: "success",
        Inactive: "inactive",
        New: "new",
    } as const;

    const earningsColor =
        Earnings === "Loss" ? "text-red-500" : "text-green-600";

    return (
        <TableRow className="">
            <TableCell className="w-1/5 flex flex-row gap-3 px-6">
                <ProfilePhoto className="flex-shrink-0"
                    name={Customer}
                />
                <div className="flex flex-col">
                    <div className="text-[14px] font-normal">{Customer}</div>
                    <div className="flex items-center text-muted-foreground text-[12px] font-medium gap-1">
                        <MapPin className="w-[12px] h-[12px]" />
                        <span>{Location}</span>
                    </div>
                </div>
            </TableCell>

            <TableCell className="w-1/5">
                <div className="flex flex-col">
                    <div>{PhoneNumber}</div>
                    <div className="text-muted-foreground text-[12px] font-normal">{Email}</div>
                </div>
            </TableCell>

            <TableCell className="w-1/5">
                <Badge
                    className="w-[76px] flex justify-center items-center font-bold"
                    variant={statusVariant[Status]}
                >
                    {Status}
                </Badge>
            </TableCell>

            <TableCell className={`w-1/5 font-bold ${earningsColor}`}>
                {Currency} {Collections.toLocaleString()}
            </TableCell>

            <TableCell className="w-1/5 font-bold">
                {Action}
            </TableCell>
        </TableRow>
    );
}