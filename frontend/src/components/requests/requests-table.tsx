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
import DataTable, { type Column } from "@/components/ui/data-table";


export function RequestsTable() {

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<"incoming" | "accepted" | "completed">("incoming");

    const rowsPerPage = 8;

    const filteredData = RequestsData.filter((row) => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            row.Username.toLowerCase().includes(search) ||
            row.Location.toLowerCase().includes(search) ||
            row.material1.toLowerCase().includes(search) ||
            (row.material2 && row.material2.toLowerCase().includes(search)) ||
            (row.material3 && row.material3.toLowerCase().includes(search)) ||
            row.Date.toLowerCase().includes(search) ||
            row.startTime.toLowerCase().includes(search) ||
            row.endTime.toLowerCase().includes(search) ||
            row.Comparability.toString().includes(search);

        const matchesTab = row.status === activeTab;

        return matchesSearch && matchesTab;
    });

    const totalRows = filteredData.length;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeTab]);

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentRows = filteredData.slice(startIndex, endIndex);

    // variables to keep track of which tab you're on
    const isAcceptedTab = activeTab === "accepted";
    const isIncomingTab = activeTab === "incoming";
    const isCompletedTab = activeTab === "completed";

    return (
        <Card className="bg-white w-full gap-0">

            <CardHeader className="border-b border-[#CFCFCF] px-6 py-0 h-[64px] flex items-center">
                <div className="flex gap-8 h-full">
                    {[
                        { label: "Incoming Requests", key: "incoming" },
                        { label: "Accepted", key: "accepted" },
                        { label: "Completed", key: "completed" }
                    ].map((tab) => {
                        const count = RequestsData.filter(r => r.status === tab.key).length;
                        const active = activeTab === tab.key;

                        return (
                            <div
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as any)}
                                className={`flex items-center gap-2 cursor-pointer border-b-2 transition-all
            ${active
                                        ? "border-[#4D7C63] text-[#4D7C63]"
                                        : "border-transparent text-gray-500 hover:text-black"
                                    }`}
                            >
                                <span className="font-medium text-[15px]">
                                    {tab.label}
                                </span>

                                {count > 0 && (
                                    <span className="bg-gray-200 text-black text-[12px] px-2 py-[2px] rounded-full font-bold">
                                        {count}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardHeader>

            <CardTitle className="flex items-center justify-between border-b border-[#CFCFCF] !h-[64px] px-6">

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

                        {/* Material only on Incoming tab */}
                        {isIncomingTab && (
                            <TableHead className="text-[#999CA0]">Material</TableHead>
                        )}

                        <TableHead className="text-[#999CA0]">Date & Time</TableHead>

                        {/* Comparability shown in ALL tabs */}
                        <TableHead className="text-[#999CA0]">Comparability</TableHead>

                        {/* Payment column – different name depending on tab */}
                        {(isAcceptedTab || isCompletedTab) && (
                            <TableHead className="text-[#999CA0]">
                                {isCompletedTab ? "Payout ($)" : "Estimated Payment ($)"}
                            </TableHead>
                        )}

                        <TableHead className="text-[#999CA0]">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {currentRows.length > 0 ? (
                        currentRows.map((row, index) => (
                            <TableEntry key={index} {...row} />
                        ))
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