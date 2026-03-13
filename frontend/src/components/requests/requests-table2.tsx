import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable, { type Column } from "@/components/ui/data-table";
import { ChevronRight, ListFilter, Search } from "lucide-react";
import { RequestsData } from "@/components/requests/requests-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type RequestRow = (typeof RequestsData)[number];


export default function RequestsTable2() {
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("incoming");

    const incomingData = RequestsData.filter((r) => r.status === "incoming");
    const acceptedData = RequestsData.filter((r) => r.status === "accepted");
    const completedData = RequestsData.filter((r) => r.status === "completed");

    const createColumns = (
        showMaterials: boolean,
        showPayment: boolean,
        payoutLabel: string
    ): Column<RequestRow>[] => [
            {
                key: "Username",
                header: "Username",
                render: (row) => (
                    <span className="px-3 text-[14px] font-bold text-black">
                        {row.Username}
                    </span>
                ),
            },
            {
                key: "Location",
                header: "Location",
                render: (row) => (
                    <span className="text-[14px] font-bold text-gray-900">
                        {row.Location}
                    </span>
                ),
            },

            ...(showMaterials
                ? [
                    {
                        key: "materials",
                        header: "Material",
                        render: (row: RequestRow) => {
                            const materials = [row.material1];
                            if (row.material2) materials.push(row.material2);
                            if (row.material3) materials.push(row.material3);

                            return (
                                <div className="flex gap-2 flex-wrap">
                                    {materials.map((m, i) => (
                                        <Badge
                                            key={i}
                                            className="bg-[#5f7f6e] text-white text-xs px-3 py-1 rounded-full font-bold"
                                        >
                                            {m}
                                        </Badge>
                                    ))}
                                </div>
                            );
                        },
                    },
                ]
                : []),

            {
                key: "dateTime",
                header: "Date & Time",
                render: (row) => (
                    <div className="flex flex-col text-[14px] font-bold text-black">
                        <span>{row.Date}</span>
                        <span>
                            {row.startTime} - {row.endTime}
                        </span>
                    </div>
                ),
            },
            {
                key: "Compatibility",
                header: "Compatibility",
                render: (row) =>
                    row.Compatibility === 100 ? (
                        <Badge className="bg-green-100 text-green-800 border-0 text-xs">
                            COMPATIBLE
                        </Badge>
                    ) : (
                        <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                            INCOMPATIBLE
                        </Badge>
                    ),
            },

            ...(showPayment
                ? [
                    {
                        key: "payment",
                        header: payoutLabel,
                        render: () => (
                            <span className="font-bold text-sm">$12.50</span>
                        ),
                    },
                ]
                : []),

            {
                key: "action",
                header: "Action",
                render: () => (
                    <div className="flex items-center gap-1 text-[14px] font-bold text-black cursor-pointer hover:underline">
                        View Details <ChevronRight size={16} />
                    </div>
                ),
            },
        ];

    return (
        <Card className="bg-white w-full gap-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

                {/* Tabs Header */}
                <CardHeader className="border-b border-[#CFCFCF] px-6 py-0 h-[64px] flex items-center">
                    <TabsList className="bg-transparent p-0 gap-8 border-0">

                        <TabsTrigger value="incoming" className="font-medium text-[15px] text-[#111827BF]">
                            Incoming Requests
                            {activeTab === "incoming" && (
                                <span className="ml-2 bg-gray-200 text-black text-[12px] px-2 py-[2px] rounded-full font-bold">
                                    {incomingData.length}
                                </span>
                            )}
                        </TabsTrigger>

                        <TabsTrigger value="accepted" className="font-medium text-[15px] text-[#111827BF]">
                            Accepted
                            {activeTab === "accepted" && (
                                <span className="ml-2 bg-gray-200 text-black text-[12px] px-2 py-[2px] rounded-full font-bold">
                                    {acceptedData.length}
                                </span>
                            )}
                        </TabsTrigger>

                        <TabsTrigger value="completed" className="font-medium text-[15px] text-[#111827BF]">
                            Completed
                            {activeTab === "completed" && (
                                <span className="ml-2 bg-gray-200 text-black text-[12px] px-2 py-[2px] rounded-full font-bold">
                                    {completedData.length}
                                </span>
                            )}
                        </TabsTrigger>

                    </TabsList>
                </CardHeader>

                {/* Search Header */}
                <CardTitle className="flex items-center justify-between border-b border-[#CFCFCF] h-[64px] px-6">
                    <div className="flex items-center bg-gray-100 rounded-md px-2 h-[31px] w-[321px]">
                        <Search className="w-4 h-4 text-black mr-2" strokeWidth={2.5} />
                        <input
                            type="text"
                            placeholder="Search"
                            className="flex-1 bg-transparent outline-none text-sm"
                        />
                    </div>

                    <div className="p-2 rounded-full bg-[#f7f7f7] cursor-pointer hover:bg-gray-200">
                        <ListFilter size={18} strokeWidth={3} />
                    </div>
                </CardTitle>

                {/* Incoming */}
                <TabsContent value="incoming" className="m-0">
                    <DataTable
                        className="[&>div]:border-0 [&>div]:rounded-none"
                        data={incomingData}
                        columns={createColumns(true, false, "")}
                        keyExtractor={(row) => `incoming-${row.Username}-${row.Date}`}
                        pagination={{
                            currentPage,
                            totalPages: 5,
                            onPageChange: setCurrentPage,
                            showText:
                                "Showing pickup requests available for ReginaRecycle collectors.",
                        }}
                    />
                </TabsContent>

                {/* Accepted */}
                <TabsContent value="accepted" className="m-0">
                    <DataTable
                        className="[&>div]:border-0 [&>div]:rounded-none"
                        data={acceptedData}
                        columns={createColumns(false, true, "Estimated Payment ($)")}
                        keyExtractor={(row) => `accepted-${row.Username}-${row.Date}`}
                        pagination={{
                            currentPage,
                            totalPages: 5,
                            onPageChange: setCurrentPage,
                            showText:
                                "Showing pickup requests available for ReginaRecycle collectors.",
                        }}
                    />
                </TabsContent>

                {/* Completed */}
                <TabsContent value="completed" className="m-0">
                    <DataTable
                        className="[&>div]:border-0 [&>div]:rounded-none"
                        data={completedData}
                        columns={createColumns(false, true, "Payout ($)")}
                        keyExtractor={(row) => `completed-${row.Username}-${row.Date}`}
                        pagination={{
                            currentPage,
                            totalPages: 5,
                            onPageChange: setCurrentPage,
                            showText:
                                "Showing pickup requests available for ReginaRecycle collectors.",
                        }}
                    />
                </TabsContent>

            </Tabs>
        </Card>
    );
}