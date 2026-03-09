import {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";

import { Card, CardFooter, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { ListFilter } from "lucide-react";
import { TableEntry } from "./table-entry";

export function RequestsTable() {
    return (
        <Card className="bg-white w-full gap-0">

            {/* Header */}
            <CardHeader className="flex items-center justify-between border-b border-[#CFCFCF] h-[64px] px-6 py-0 ">
                <h2 className="text-lg font-semibold">Customers</h2>

                <div className="flex items-center gap-3">
                    <Input
                        placeholder="Search for customer name"
                        className="w-[321px] h-[31px] flex-shrink-0"
                    />

                    <div className="p-2 rounded-full bg-[#f7f7f7] cursor-pointer hover:bg-gray-200 flex-shrink-0">
                        <ListFilter size={18} strokeWidth={3} />
                    </div>
                </div>
            </CardHeader>

            <Table>
                <TableHeader>
                    <TableRow className="h-[44px] ">
                        <TableHead className="text-[#999CA0]" >Customer</TableHead>
                        <TableHead className="text-[#999CA0]" >Contact</TableHead>
                        <TableHead className="text-[#999CA0]" >Status</TableHead>
                        <TableHead className="text-[#999CA0]" >Collections</TableHead>
                        <TableHead className="text-[#999CA0]" >Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <TableEntry />
                    <TableEntry />
                    <TableEntry />
                </TableBody>

                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={5}>Pagination goes here</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>

            <CardFooter>
                sdkjhsjdkfh
            </CardFooter>

        </Card>
    );
}