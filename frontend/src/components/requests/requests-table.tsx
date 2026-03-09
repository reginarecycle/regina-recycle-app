import { useState, useEffect } from "react";
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
    const [searchTerm, setSearchTerm] = useState("");
    const rowsPerPage = 8;

    // Filter data based on search term (case insensitive)
    const filteredData = RequestsData.filter((row) =>
        row.Customer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRows = filteredData.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    // Reset current page to 1 whenever search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Slice the filtered data for pagination
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentRows = filteredData.slice(startIndex, endIndex);

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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                    {currentRows.length > 0 ? (
                        currentRows.map((row, index) => <TableEntry key={index} {...row} />)
                    ) : (
                        <TableRow>
                            <TableHead colSpan={5} className="text-center py-4 text-muted-foreground">
                                No results found.
                            </TableHead>
                        </TableRow>
                    )}
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