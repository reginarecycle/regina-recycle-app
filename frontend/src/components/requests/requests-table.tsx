import { useState } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
} from "@/components/ui/table";

import { Card, CardHeader, CardTitle } from "../ui/card";
import { ListFilter, Search } from "lucide-react";
import { TableEntry } from "./table-entry";
import { RequestsFooter } from "./requests-footer";
import { RequestsData } from "./requests-data";

export function RequestsTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8; // show 10 rows per page

    const totalRows = RequestsData.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    // Slice the data array according to current page
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentRows = RequestsData.slice(startIndex, endIndex);

    return (
        <Card className="bg-white w-full gap-0">

            {/* Header */}
            <CardHeader className="flex items-center justify-between border-b border-[#CFCFCF] !h-[48px]">
                <CardTitle className="text-lg font-bold">Customers</CardTitle>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-gray-100 rounded-md px-2 h-[31px] w-[321px]">
                        <Search className="w-4 h-4 text-black mr-2" strokeWidth={2.5} />
                        <input
                            type="text"
                            placeholder="Search for customer name"
                            className="flex-1 bg-transparent outline-none text-sm"
                        />
                    </div>
                    <div className="p-2 rounded-full bg-[#f7f7f7] cursor-pointer hover:bg-gray-200 flex-shrink-0">
                        <ListFilter size={18} strokeWidth={3} />
                    </div>
                </div>
            </CardHeader>

            <Table>
                <TableHeader>
                    <TableRow className="h-[44px]">
                        <TableHead className="text-[#999CA0] px-6">Customer</TableHead>
                        <TableHead className="text-[#999CA0]">Contact</TableHead>
                        <TableHead className="text-[#999CA0]">Status</TableHead>
                        <TableHead className="text-[#999CA0]">Collections</TableHead>
                        <TableHead className="text-[#999CA0]">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {currentRows.map((row, index) => (
                        <TableEntry key={index} {...row} />
                    ))}
                </TableBody>
            </Table>

            <RequestsFooter
                totalRows={totalRows}
                rowsPerPage={rowsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </Card>
    );
}