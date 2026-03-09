import {
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";


type RequestProps = {
    Customer: string;
    Location: string;
    PhoneNumber: string;
    Email: string;
    Status: "Active" | "Inactive" | "New";
    Currency: string;
    Collections: number;
    Action: string;
};

export function TableEntry({
    Customer = "John Doe",
    Location = "somewhere",
    PhoneNumber = "(306) 345 - 098",
    Email = "John.Doe@uregina.ca",
    Status = "New",
    Currency = "CAD",
    Collections = 0,
    Action = "View More",
}: RequestProps) {
    return (
        <TableRow>
            <TableCell className="w-1/5">
                <div className="flex flex-col">
                    <div>{Customer}</div>
                    <div className="text-muted-foreground text-sm">{Location}</div>
                </div>
            </TableCell>

            <TableCell className="w-1/5">
                <div className="flex flex-col">
                    <div>{PhoneNumber}</div>
                    <div className="text-muted-foreground text-sm">{Email}</div>
                </div>
            </TableCell>

            <TableCell className="w-1/5">
                <Badge variant={"new"}>
                    {Status}
                </Badge>
            </TableCell>

            <TableCell className="w-1/5">
                {Currency} {Collections}
            </TableCell>

            <TableCell className="w-1/5">
                {Action}
            </TableCell>
        </TableRow>
    );
}