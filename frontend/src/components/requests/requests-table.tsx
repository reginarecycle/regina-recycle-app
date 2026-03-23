import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable, { type Column } from "@/components/ui/data-table";
import { ChevronRight, ChevronsUpDown, ListFilter, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestDetailsModal } from "./request-details-modal";
import { RequestAcceptedModal } from "./request-accepted-modal";
import { CompleteRequestModal } from "./complete-request-modal";
import { RejectRequestModal } from "./reject-request-modal";
import {
  getCollectorPickups,
  getCollectorPricing,
} from "@/api/collectorRequest";
import { getWalletBalance } from "@/api/wallet";
import type { RequestRow } from "./types";
import { mapPickupToRequestRow } from "./request-mapper";
import { acceptPickup, cancelPickup } from "@/api/pickups";
import type { CollectionItem } from "./complete-request-modal";

type RequestTab = "incoming" | "accepted" | "completed";

// type CompleteModalItem = {
//   materialId: string;
//   material: string;
//   expectedUnits: number;
//   unitPrice: number;
//   actualUnits: number;
// };

export default function RequestsTable() {
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [tabCounts, setTabCounts] = useState({
    incoming: 0,
    accepted: 0,
    completed: 0,
  });

  const [activeTab, setActiveTab] = useState<RequestTab>("incoming");
  const [selectedRequest, setSelectedRequest] = useState<RequestRow | null>(
    null,
  );

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [acceptedOpen, setAcceptedOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [completeNote, setCompleteNote] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [walletBalance, setWalletBalance] = useState(0);
  const [pricingMap, setPricingMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const filteredRequests = requests.filter((row) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;

    return (
      row.Username.toLowerCase().includes(q) ||
      row.Location.toLowerCase().includes(q) ||
      row.material1.toLowerCase().includes(q) ||
      row.material2?.toLowerCase().includes(q) ||
      row.material3?.toLowerCase().includes(q)
    );
  });

  const incomingData = activeTab === "incoming" ? filteredRequests : [];
  const acceptedData = activeTab === "accepted" ? filteredRequests : [];
  const completedData = activeTab === "completed" ? filteredRequests : [];

  const loadTabCounts = useCallback(async () => {
    try {
      const [incomingRes, acceptedRes, completedRes] = await Promise.all([
        getCollectorPickups("PENDING", 1, 0),
        getCollectorPickups("ACCEPTED", 1, 0),
        getCollectorPickups("COMPLETED", 1, 0),
      ]);
      //console.log("incoming res",acceptedRes);
      setTabCounts({
        incoming: incomingRes.data?.meta?.total ?? 0,
        accepted: acceptedRes.data?.meta?.total ?? 0,
        completed: completedRes.data?.meta?.total ?? 0,
      });
    } catch (error) {
      console.error("Failed to fetch tab counts:", error);
    }
  }, []);

  const loadPricing = useCallback(async () => {
    try {
      const result = await getCollectorPricing(100, 0);
      const pricingRows = result.data?.data ?? [];

      const map: Record<string, number> = {};
      pricingRows.forEach((row: any) => {
        map[row.materialId] = Number(row.basePrice ?? 0);
      });

      setPricingMap(map);
    } catch (error) {
      console.error("Failed to fetch collector pricing:", error);
    }
  }, []);

  const loadWalletBalance = useCallback(async () => {
    try {
      const result = await getWalletBalance();
      const balance = result?.data?.balance ?? result?.balance ?? 0;
      setWalletBalance(Number(balance));
    } catch (error) {
      console.error("Failed to fetch wallet balance:", error);
    }
  }, []);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);

      const statusMap: Record<RequestTab, string> = {
        incoming: "PENDING",
        accepted: "ACCEPTED",
        completed: "COMPLETED",
      };

      const result = await getCollectorPickups(
        statusMap[activeTab],
        10,
        (currentPage - 1) * 10,
      );

      const responseData = result.data ?? {};
      const backendRows = responseData.data ?? [];
      const total = responseData.meta?.total ?? 0;
      const pageLimit = responseData.meta?.limit ?? 10;
      //
      console.log("result",pageLimit);

      setTotalPages(Math.max(1, Math.ceil(total / pageLimit)));

      const mappedRows: RequestRow[] = backendRows.map((pickup: any) =>
        mapPickupToRequestRow(pickup, activeTab, pricingMap),
      );

      setRequests(mappedRows);
    } catch (error) {
      console.error("Failed to fetch collector pickups:", error);
      setRequests([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage, pricingMap]);

  useEffect(() => {
    loadTabCounts();
    loadPricing();
    loadWalletBalance();
  }, [loadTabCounts, loadPricing, loadWalletBalance]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleAcceptRequest = async () => {
    if (!selectedRequest) return;

    try {
      console.log("ACCEPT PICKUP ID:", selectedRequest.pickupId);

      await acceptPickup(selectedRequest.pickupId);

      setDetailsOpen(false);
      setAcceptedOpen(true);
      setSelectedRequest(null);
      setCurrentPage(1);
      setActiveTab("accepted");

      await loadTabCounts();
    } catch (error) {
      console.error("Failed to accept request:", error);
    }
  };

  const handleCompleteRequest = (updatedItems: CollectionItem[]) => {
    if (!selectedRequest) return;

    console.log("COMPLETE UPDATED ITEMS:", updatedItems);

    setRequests((prev) =>
      prev.map((request) =>
        request === selectedRequest
          ? { ...request, status: "completed" }
          : request,
      ),
    );

    setSelectedRequest((prev) =>
      prev ? { ...prev, status: "completed" } : prev,
    );

    setCompleteOpen(false);
    setActiveTab("completed");
    setCurrentPage(1);
  };

  const handleRejectRequest = async (reason: string, comments: string) => {
    if (!selectedRequest) return;

    try {
      console.log("REJECT PICKUP ID:", selectedRequest.pickupId);
      console.log("Rejected request:", {
        request: selectedRequest,
        reason,
        comments,
      });

      await cancelPickup(selectedRequest.pickupId);

      setRejectOpen(false);
      setSelectedRequest(null);
      setCurrentPage(1);

      await fetchRequests();
      await loadTabCounts();
    } catch (error) {
      console.error("Failed to reject request:", error);
    }
  };

  const createColumns = (
    showMaterials: boolean,
    showPayment: boolean,
    payoutLabel: string,
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
            render: (row) => {
              const totalEstimated = row.items.reduce(
                (sum, item) => sum + item.price,
                0,
              );

              return (
                <span className="font-bold text-sm">
                  $
                  {payoutLabel === "Payout ($)"
                    ? row.actualEarning.toFixed(2)
                    : totalEstimated.toFixed(2)}
                </span>
              );
            },
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
    payoutLabel: string,
  ) => {
    const materials = [row.material1, row.material2, row.material3].filter(
      Boolean,
    );

    return (
      <>
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <div className="text-[15px] font-bold text-black">
              {row.Username}
            </div>
            <div className="mt-1 text-[13px] text-gray-600">{row.Location}</div>
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
            <div className="font-bold text-sm">
              $
              {payoutLabel === "Payout ($)"
                ? row.actualEarning.toFixed(2)
                : row.estimatedEarning.toFixed(2)}
            </div>
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
          setActiveTab(value as RequestTab);
          setCurrentPage(1);
        }}
        className="w-full"
      >
        <CardHeader className="border-b border-[#CFCFCF] !py-0 min-h-[64px] flex items-center px-4 md:px-6">
          <TabsList className="bg-transparent p-0 gap-4 md:gap-8 border-0 h-full flex items-center overflow-x-auto w-full">
            <TabsTrigger
              value="incoming"
              className="font-medium text-[15px] text-[#111827BF] whitespace-nowrap"
            >
              Incoming Requests
              {activeTab === "incoming" && (
                <span className="ml-2 bg-gray-200 text-black text-[12px] px-2 py-[2px] rounded-full font-bold">
                  {tabCounts.incoming}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="accepted"
              className="font-medium text-[15px] text-[#111827BF] whitespace-nowrap"
            >
              Accepted
              {activeTab === "accepted" && (
                <span className="ml-2 bg-gray-200 text-black text-[12px] px-2 py-[2px] rounded-full font-bold">
                  {tabCounts.accepted}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="completed"
              className="font-medium text-[15px] text-[#111827BF] whitespace-nowrap"
            >
              Completed
              {activeTab === "completed" && (
                <span className="ml-2 bg-gray-200 text-black text-[12px] px-2 py-[2px] rounded-full font-bold">
                  {tabCounts.completed}
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
            data={loading ? [] : incomingData}
            columns={createColumns(true, false, "")}
            keyExtractor={(row) => `incoming-${row.pickupId}`}
            pagination={{
              currentPage,
              totalPages,
              onPageChange: setCurrentPage,
              showText:
                "Showing requests available for ReginaRecycle Collectors.",
            }}
            mobileRender={(row) => renderMobileRequest(row, true, false, "")}
          />
        </TabsContent>

        <TabsContent value="accepted" className="m-0">
          <DataTable
            className="[&>div]:border-0 [&>div]:rounded-none"
            data={loading ? [] : acceptedData}
            columns={createColumns(false, true, "Estimated Payment ($)")}
            keyExtractor={(row) => `accepted-${row.pickupId}`}
            pagination={{
              currentPage,
              totalPages,
              onPageChange: setCurrentPage,
              showText:
                "Showing accepted requests for ReginaRecycle Collectors.",
            }}
            mobileRender={(row) =>
              renderMobileRequest(row, false, true, "Estimated Payment ($)")
            }
          />
        </TabsContent>

        <TabsContent value="completed" className="m-0">
          <DataTable
            className="[&>div]:border-0 [&>div]:rounded-none"
            data={loading ? [] : completedData}
            columns={createColumns(false, true, "Payout ($)")}
            keyExtractor={(row) => `completed-${row.pickupId}`}
            pagination={{
              currentPage,
              totalPages,
              onPageChange: setCurrentPage,
              showText:
                "Showing completed requests for ReginaRecycle Collectors.",
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
          requestNum={selectedRequest.pickupId}
          earnings={selectedRequest.items.reduce(
            (sum, item) => sum + item.price,
            0,
          )}
          estUnits={selectedRequest.estUnits}
          compatibilityStr={
            selectedRequest.Compatibility >= 80
              ? `${selectedRequest.Compatibility}% MATCH`
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
          requestId={selectedRequest.pickupId}
          customer={selectedRequest.Username}
          location={selectedRequest.Location}
          dateTime={`${selectedRequest.Date}, ${selectedRequest.startTime} - ${selectedRequest.endTime}`}
          compatibility={`${selectedRequest.Compatibility}%`}
          balance={walletBalance}
          note={completeNote}
          setNote={setCompleteNote}
          items={selectedRequest.items.map((item) => ({
            materialId: item.materialId,
            material: item.material,
            expectedUnits: item.estimatedUnits,
            unitPrice: item.unitPrice,
            actualUnits: item.actualUnits,
          }))}
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

