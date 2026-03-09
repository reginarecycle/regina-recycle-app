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
    // Filter data based on search term (case insensitive)
    const filteredData = RequestsData.filter((row) => {
        const search = searchTerm.toLowerCase();

        return (
            row.Username.toLowerCase().includes(search) ||
            row.Location.toLowerCase().includes(search) ||
            row.material1.toLowerCase().includes(search) ||
            (row.material2 && row.material2.toLowerCase().includes(search)) ||
            (row.material3 && row.material3.toLowerCase().includes(search)) ||
            row.Date.toLowerCase().includes(search) ||
            row.endTime.toLowerCase().includes(search) ||
            row.startTime.toLowerCase().includes(search) ||
            row.Comparability.toString().includes(search)
        );
    });

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
            <CardHeader className="border-b border-[#CFCFCF] !h-[64px]">
                Another header
            </CardHeader>
            <CardTitle className="flex items-center justify-between border-b border-[#CFCFCF] !h-[64px] px-6">

                {/* Search input container with icon on left */}
                <div className="flex items-center bg-gray-100 rounded-md px-2 h-[31px] w-[321px]">
                    <Search className="w-4 h-4 text-black mr-2" strokeWidth={2.5} />
                    <input
                        type="text"
                        placeholder="Search for transaction id"
                        className="flex-1 bg-transparent outline-none text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>


                <div className="p-2 rounded-full bg-[#f7f7f7] cursor-pointer hover:bg-gray-200 flex-shrink-0">
                    <ListFilter size={18} strokeWidth={3} />
                </div>

            </CardTitle>

            <Table>
                <TableHeader>
                    <TableRow className="h-[44px]">
                        <TableHead className="text-[#999CA0] px-6">Username</TableHead>
                        <TableHead className="text-[#999CA0]">Location</TableHead>
                        <TableHead className="text-[#999CA0]">Material</TableHead>
                        <TableHead className="text-[#999CA0]">Date & Time</TableHead>
                        <TableHead className="text-[#999CA0]">Comparability</TableHead>
                        <TableHead className="text-[#999CA0]">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {currentRows.length > 0 ? (
                        currentRows.map((row, index) => <TableEntry key={index} {...row} />)
                    ) : (
                        <TableRow>
                            <TableHead colSpan={6} className="text-center py-4 text-muted-foreground">
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