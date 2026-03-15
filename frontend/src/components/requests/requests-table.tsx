import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable, { type Column } from "@/components/ui/data-table";
import { ChevronRight, ListFilter, Search } from "lucide-react";
import { RequestsData } from "@/components/requests/requests-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestDetailsModal } from "./request-details-modal";
import { RequestAcceptedModal } from "./request-accepted-modal";
import { CompleteRequestModal } from "./complete-request-modal";
import { RejectRequestModal } from "./reject-request-modal";

type RequestRow = (typeof RequestsData)[number];

export default function RequestsTable() {
    const [requests, setRequests] = useState<RequestRow[]>(RequestsData);

    const [activeTab, setActiveTab] = useState<"incoming" | "accepted" | "completed">("incoming");
    const [selectedRequest, setSelectedRequest] = useState<RequestRow | null>(null);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [completeOpen, setCompleteOpen] = useState(false);
    const [acceptedOpen, setAcceptedOpen] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [completeNote, setCompleteNote] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const incomingData = requests.filter((r) => r.status === "incoming");
    const acceptedData = requests.filter((r) => r.status === "accepted");
    const completedData = requests.filter((r) => r.status === "completed");

    const handleAcceptRequest = () => {
        if (!selectedRequest) return;

        setRequests((prev) =>
            prev.map((request) =>
                request === selectedRequest
                    ? { ...request, status: "accepted" }
                    : request
            )
        );

        setSelectedRequest((prev) =>
            prev ? { ...prev, status: "accepted" } : prev
        );

        setDetailsOpen(false);
        setAcceptedOpen(true);
        setActiveTab("accepted");
    };

    const handleCompleteRequest = () => {
        if (!selectedRequest) return;

        setRequests((prev) =>
            prev.map((request) =>
                request === selectedRequest
                    ? { ...request, status: "completed" }
                    : request
            )
        );

        setSelectedRequest((prev) =>
            prev ? { ...prev, status: "completed" } : prev
        );

        setCompleteOpen(false);
        setActiveTab("completed");
    };

    const handleRejectRequest = (reason: string, comments: string) => {
        if (!selectedRequest) return;

        console.log("Rejected request:", {
            request: selectedRequest,
            reason,
            comments,
        });

        setRequests((prev) => prev.filter((request) => request !== selectedRequest));
        setRejectOpen(false);
        setSelectedRequest(null);
    };

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
                        <Badge
                            variant={"inactive"}
                            className="bg-green-100 text-green-800 border-0 text-xs"
                        >
                            COMPATIBLE
                        </Badge>
                    ) : (
                        <Badge
                            variant={"inactive"}
                            className="bg-red-100 text-red-700 border-0 text-xs"
                        >
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
                render: (row) =>
                    activeTab === "accepted" ? (
                        <button
                            onClick={() => {
                                setSelectedRequest(row);
                                setCompleteNote("");
                                setCompleteOpen(true);
                            }}
                            className="border border-[#4D7C63] text-[#4D7C63] px-4 py-1 rounded-md font-medium hover:bg-[#4D7C63] hover:text-white transition"
                        >
                            Complete
                        </button>
                    ) : (
                        <div
                            onClick={() => {
                                setSelectedRequest(row);
                                setDetailsOpen(true);
                            }}
                            className="flex items-center gap-1 text-[14px] font-bold text-black cursor-pointer hover:underline"
                        >
                            View Details <ChevronRight size={16} />
                        </div>
                    ),
            },
        ];

    const renderMobileRequest = (
        row: RequestRow,
        showMaterials: boolean,
        showPayment: boolean,
        payoutLabel: string
    ) => {
        const materials = [row.material1, row.material2, row.material3].filter(Boolean);

        return (
            <>
                <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                        <div className="text-[15px] font-bold text-black">
                            {row.Username}
                        </div>
                        <div className="mt-1 text-[13px] text-gray-600">
                            {row.Location}
                        </div>
                    </div>

                    {row.Compatibility === 100 ? (
                        <Badge
                            variant={"inactive"}
                            className="bg-green-100 text-green-800 border-0 text-xs"
                        >
                            COMPATIBLE
                        </Badge>
                    ) : (
                        <Badge
                            variant={"inactive"}
                            className="bg-red-100 text-red-700 border-0 text-xs"
                        >
                            INCOMPATIBLE
                        </Badge>
                    )}
                </div>

                <div className="mb-3 text-[13px] text-gray-700">
                    <div className="font-semibold text-black">Date & Time</div>
                    <div>{row.Date}</div>
                    <div>
                        {row.startTime} - {row.endTime}
                    </div>
                </div>

                {showMaterials && (
                    <div className="mb-3">
                        <div className="mb-2 text-[13px] font-semibold text-black">
                            Material
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {materials.map((m, i) => (
                                <Badge
                                    key={i}
                                    className="bg-[#5f7f6e] text-white text-xs px-3 py-1 rounded-full font-bold"
                                >
                                    {m}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {showPayment && (
                    <div className="mb-3 text-[13px] text-gray-700">
                        <div className="font-semibold text-black">{payoutLabel}</div>
                        <div className="font-bold text-sm">$12.50</div>
                    </div>
                )}

                <div className="pt-2">
                    {activeTab === "accepted" ? (
                        <button
                            onClick={() => {
                                setSelectedRequest(row);
                                setCompleteNote("");
                                setCompleteOpen(true);
                            }}
                            className="w-full rounded-md border border-[#4D7C63] px-4 py-2 font-medium text-[#4D7C63] transition hover:bg-[#4D7C63] hover:text-white"
                        >
                            Complete
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                setSelectedRequest(row);
                                setDetailsOpen(true);
                            }}
                            className="flex w-full items-center justify-center gap-1 rounded-md bg-[#344E41] px-4 py-2 text-sm font-semibold text-white"
                        >
                            View Details <ChevronRight size={16} />
                        </button>
                    )}
                </div>
            </>
        );
    };

    return (
        <Card className="bg-white w-full gap-0 py-3">
            <Tabs
                value={activeTab}
                onValueChange={(value) => {
                    setActiveTab(value as typeof activeTab);
                    setCurrentPage(1);
                }}
                className="w-full"
            >
                <CardHeader className="border-b border-[#CFCFCF] !py-0 min-h-[64px] flex items-center px-4 md:px-6">
                    <TabsList className="bg-transparent p-0 gap-4 md:gap-8 border-0 h-full flex items-center overflow-x-auto w-full">
                        <TabsTrigger value="incoming" className="font-medium text-[15px] text-[#111827BF] whitespace-nowrap">
                            Incoming Requests
                            {activeTab === "incoming" && (
                                <span className="ml-2 bg-gray-200 text-black text-[12px] px-2 py-[2px] rounded-full font-bold">
                                    {incomingData.length}
                                </span>
                            )}
                        </TabsTrigger>

                        <TabsTrigger value="accepted" className="font-medium text-[15px] text-[#111827BF] whitespace-nowrap">
                            Accepted
                            {activeTab === "accepted" && (
                                <span className="ml-2 bg-gray-200 text-black text-[12px] px-2 py-[2px] rounded-full font-bold">
                                    {acceptedData.length}
                                </span>
                            )}
                        </TabsTrigger>

                        <TabsTrigger value="completed" className="font-medium text-[15px] text-[#111827BF] whitespace-nowrap">
                            Completed
                            {activeTab === "completed" && (
                                <span className="ml-2 bg-gray-200 text-black text-[12px] px-2 py-[2px] rounded-full font-bold">
                                    {completedData.length}
                                </span>
                            )}
                        </TabsTrigger>
                    </TabsList>
                </CardHeader>

                <CardTitle className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-[#CFCFCF] px-4 py-4 md:h-[64px] md:px-6">
                    <div className="flex items-center bg-gray-100 rounded-md px-2 h-[36px] w-full md:w-[321px]">
                        <Search className="w-4 h-4 text-black mr-2" strokeWidth={2.5} />
                        <input
                            type="text"
                            placeholder="Search"
                            className="flex-1 bg-transparent outline-none text-sm"
                        />
                    </div>

                    <div className="self-end md:self-auto p-2 rounded-full bg-[#f7f7f7] cursor-pointer hover:bg-gray-200">
                        <ListFilter size={18} strokeWidth={3} />
                    </div>
                </CardTitle>

                <TabsContent value="incoming" className="m-0">
                    <DataTable
                        className="[&>div]:border-0 [&>div]:rounded-none"
                        data={incomingData}
                        columns={createColumns(true, false, "")}
                        keyExtractor={(row) => `incoming-${row.Username}-${row.Date}`}
                        pagination={{
                            currentPage: currentPage,
                            totalPages: 5,
                            onPageChange: setCurrentPage,
                            showText: "Showing 4 to 12 materials available for ReginaRecycle Collectors.",
                        }}
                        mobileRender={(row) => renderMobileRequest(row, true, false, "")}
                    />
                </TabsContent>

                <TabsContent value="accepted" className="m-0">
                    <DataTable
                        className="[&>div]:border-0 [&>div]:rounded-none"
                        data={acceptedData}
                        columns={createColumns(false, true, "Estimated Payment ($)")}
                        keyExtractor={(row) => `accepted-${row.Username}-${row.Date}`}
                        pagination={{
                            currentPage: currentPage,
                            totalPages: 5,
                            onPageChange: setCurrentPage,
                            showText: "Showing 4 to 12 materials available for ReginaRecycle Collectors.",
                        }}
                        mobileRender={(row) =>
                            renderMobileRequest(row, false, true, "Estimated Payment ($)")
                        }
                    />
                </TabsContent>

                <TabsContent value="completed" className="m-0">
                    <DataTable
                        className="[&>div]:border-0 [&>div]:rounded-none"
                        data={completedData}
                        columns={createColumns(false, true, "Payout ($)")}
                        keyExtractor={(row) => `completed-${row.Username}-${row.Date}`}
                        pagination={{
                            currentPage: currentPage,
                            totalPages: 5,
                            onPageChange: setCurrentPage,
                            showText: "Showing 4 to 12 materials available for ReginaRecycle Collectors.",
                        }}
                        mobileRender={(row) =>
                            renderMobileRequest(row, false, true, "Payout ($)")
                        }
                    />
                </TabsContent>
            </Tabs>

            {selectedRequest && (
                <RequestDetailsModal
                    isOpen={detailsOpen}
                    request={selectedRequest}
                    onClose={() => setDetailsOpen(false)}
                    onAccept={handleAcceptRequest}
                    onReject={() => {
                        setDetailsOpen(false);
                        setRejectOpen(true);
                    }}
                    requestNum={"#REQ 000000"}
                    earnings={0}
                    estUnits={0}
                    compatibilityStr={
                        selectedRequest.Compatibility === 100
                            ? "100% MATCH"
                            : "INCOMPATIBLE"
                    }
                    username={selectedRequest.Username}
                    sourceTab={activeTab}
                />
            )}

            {selectedRequest && (
                <CompleteRequestModal
                    isOpen={completeOpen}
                    onClose={() => setCompleteOpen(false)}
                    onComplete={handleCompleteRequest}
                    requestId="REQ001"
                    customer={selectedRequest.Username}
                    location={selectedRequest.Location}
                    dateTime={`${selectedRequest.Date}, ${selectedRequest.startTime} - ${selectedRequest.endTime}`}
                    compatibility={
                        selectedRequest.Compatibility === 100 ? "100%" : "0%"
                    }
                    balance={850}
                    note={completeNote}
                    setNote={setCompleteNote}
                />
            )}

            <RequestAcceptedModal
                isOpen={acceptedOpen}
                onClose={() => setAcceptedOpen(false)}
                onViewActivePickups={() => {
                    setAcceptedOpen(false);
                    setActiveTab("incoming");
                }}
            />

            <RejectRequestModal
                isOpen={rejectOpen}
                onClose={() => setRejectOpen(false)}
                onConfirm={({ reason, comments }) => {
                    handleRejectRequest(reason, comments);
                }}
            />
        </Card>
    );
}