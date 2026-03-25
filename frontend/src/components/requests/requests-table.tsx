import { useState, useMemo } from "react";
import { DataTable, type ColumnDef, type DataTableTabItem } from "@/components/ui/data-table";
import {
  DataTableHeaderControls,
  type TableFilterState,
  DEFAULT_TABLE_FILTERS,
} from "@/components/ui/data-table-header-controls";
import { MaterialTag } from "@/components/ui/material-tag";
import { StatusBadge } from "@/components/ui/status-badge";
import { ChevronRight } from "lucide-react";
import { RequestsData, type RequestRow } from "@/components/requests/requests-data";
import { RequestDetailsModal } from "./request-details-modal";
import { RequestAcceptedModal } from "./request-accepted-modal";
import { CompleteRequestModal } from "./complete-request-modal";
import { RejectRequestModal } from "./reject-request-modal";
import { RequestCompletedModal } from "./request-completed-modal";
import { Button } from "../ui/button";

const PAGE_SIZE = 10;

type ActiveTab = "incoming" | "accepted" | "completed";
type CompatibilityFilter = "COMPATIBLE" | "INCOMPATIBLE";

const COMPATIBILITY_OPTIONS = [
  { key: "COMPATIBLE"   as CompatibilityFilter, label: "Compatible"   },
  { key: "INCOMPATIBLE" as CompatibilityFilter, label: "Incompatible" },
];

export default function RequestsTable() {
  const [requests, setRequests] = useState<RequestRow[]>(RequestsData);
  const [activeTab, setActiveTab] = useState<ActiveTab>("incoming");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<TableFilterState<CompatibilityFilter>>(
    DEFAULT_TABLE_FILTERS as TableFilterState<CompatibilityFilter>
  );


  const [selectedRequest, setSelectedRequest] = useState<RequestRow | null>(null);
  const [detailsOpen,   setDetailsOpen]   = useState(false);
  const [acceptedOpen,  setAcceptedOpen]  = useState(false);
  const [completeOpen,  setCompleteOpen]  = useState(false);
  const [completedOpen, setCompletedOpen] = useState(false);
  const [rejectOpen,    setRejectOpen]    = useState(false);
  const [completeNote,  setCompleteNote]  = useState("");

  const incomingData  = useMemo(() => requests.filter((r) => r.status === "incoming"),  [requests]);
  const acceptedData  = useMemo(() => requests.filter((r) => r.status === "accepted"),  [requests]);
  const completedData = useMemo(() => requests.filter((r) => r.status === "completed"), [requests]);

  const tabs: DataTableTabItem[] = [
    { href: "incoming",  label: "Incoming Requests", badge: activeTab === "incoming"  ? incomingData.length  : undefined },
    { href: "accepted",  label: "Accepted",          badge: activeTab === "accepted"  ? acceptedData.length  : undefined },
    { href: "completed", label: "Completed",         badge: activeTab === "completed" ? completedData.length : undefined },
  ];

  const tableData = useMemo(() => {
    const base = activeTab === "incoming" ? incomingData : activeTab === "accepted" ? acceptedData : completedData;
    const compatFilter = filters.statuses[0];

    return base.filter((r) => {
      if (search) {
        const q = search.toLowerCase();
        if (!r.Username.toLowerCase().includes(q) && !r.Location.toLowerCase().includes(q)) return false;
      }
      if (compatFilter === "COMPATIBLE"   && r.Compatibility !== 100) return false;
      if (compatFilter === "INCOMPATIBLE" && r.Compatibility === 100) return false;
      return true;
    });
  }, [activeTab, incomingData, acceptedData, completedData, search, filters]);

  const totalPages = Math.max(1, Math.ceil(tableData.length / PAGE_SIZE));
  const pagedData  = tableData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns = useMemo((): ColumnDef<RequestRow>[] => {
    const showMaterials = activeTab === "incoming";
    const payoutLabel   = activeTab === "completed" ? "Payout ($)" : "Est. Payment ($)";

    return [
      {
        key: "username",
        header: "Username",
        cell: (row) => <span className="text-sm font-medium text-foreground">{row.Username}</span>,
      },
      {
        key: "location",
        header: "Location",
        cell: (row) => (
          <span className="block max-w-48 truncate text-sm text-foreground">{row.Location}</span>
        ),
      },
      ...(showMaterials ? [{
        key: "material",
        header: "Material",
        cell: (row: RequestRow) => {
          const materials = [row.material1, row.material2, row.material3].filter(Boolean) as string[];
          return (
            <div className="flex flex-wrap gap-1.5">
              {materials.map((m) => <MaterialTag key={m} material={m} size="sm" />)}
            </div>
          );
        },
      }] : []),
      {
        key: "dateTime",
        header: "Date & Time",
        cell: (row) => (
          <div className="flex flex-col text-sm text-foreground">
            <span>{row.Date}</span>
            <span className="text-muted-foreground">{row.startTime} – {row.endTime}</span>
          </div>
        ),
      },
      {
        key: "compatibility",
        header: "Compatibility",
        cell: (row) =>
          row.Compatibility === 100
            ? <StatusBadge status="COMPATIBLE" />
            : <StatusBadge status="INCOMPATIBLE" />,
      },
      ...(activeTab !== "incoming" ? [{
        key: "payment",
        header: payoutLabel,
        cell: () => <span className="text-sm font-semibold text-foreground">$12.50</span>,
      }] : []),
      {
        key: "action",
        header: "Action",
        cell: (row: RequestRow) =>
          activeTab === "accepted" ? (
            <Button
              variant='outlineprimary'
              size='sm'
              onClick={() => { setSelectedRequest(row); setCompleteNote(""); setCompleteOpen(true); }}
            >
              Complete
            </Button>
          ) : (
            <button
              onClick={() => { setSelectedRequest(row); setDetailsOpen(true); }}
              className="whitespace-nowrap text-sm font-semibold text-foreground transition-colors hover:text-primary"
              >
              View Details
            </button>
          ),
      },
    ];
  }, [activeTab]);

  const handleAcceptRequest = () => {
    if (!selectedRequest) return;
    setRequests((prev) => prev.map((r) => r === selectedRequest ? { ...r, status: "accepted" as const } : r));
    setDetailsOpen(false);
    setAcceptedOpen(true);
    setActiveTab("accepted");
  };

  const handleCompleteRequest = () => {
    if (!selectedRequest) return;
    setRequests((prev) => prev.map((r) => r === selectedRequest ? { ...r, status: "completed" as const } : r));
    setCompleteOpen(false);
    setCompletedOpen(true);
    setActiveTab("completed");
  };

  const handleRejectRequest = (reason: string, comments: string) => {
    if (!selectedRequest) return;
    console.log("Rejected:", { request: selectedRequest, reason, comments });
    setRequests((prev) => prev.filter((r) => r !== selectedRequest));
    setRejectOpen(false);
    setSelectedRequest(null);
  };

  return (
    <>
      <DataTable
        data={pagedData}
        columns={columns}
        rowKey={(r) => r.id}
        tabs={tabs}
        tabBarProps={{ mode: "none", value: activeTab, onChange: (v) => { setActiveTab(v as ActiveTab); setPage(1); } }}
        subHeader={
          <DataTableHeaderControls<CompatibilityFilter>
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            searchPlaceholder="Search"
            filters={filters}
            onFiltersChange={(f) => { setFilters(f); setPage(1); }}
            statusOptions={COMPATIBILITY_OPTIONS}
          />
        }
        page={page}
        totalPages={totalPages}
        totalItems={tableData.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        emptyText="No requests found"
        minHeight="500px"
      />

      {selectedRequest && (
        <RequestDetailsModal
          isOpen={detailsOpen}
          request={selectedRequest}
          onClose={() => setDetailsOpen(false)}
          onAccept={handleAcceptRequest}
          onReject={() => { setDetailsOpen(false); setRejectOpen(true); }}
          requestNum="#REQ 000000"
          earnings={0}
          estUnits={0}
          compatibilityStr={selectedRequest.Compatibility === 100 ? "100% MATCH" : "INCOMPATIBLE"}
          username={selectedRequest.Username}
          sourceTab={activeTab}
        />
      )}

      {selectedRequest && (
        <>
          <CompleteRequestModal
            isOpen={completeOpen}
            onClose={() => setCompleteOpen(false)}
            onComplete={handleCompleteRequest}
            requestId="REQ001"
            customer={selectedRequest.Username}
            location={selectedRequest.Location}
            dateTime={`${selectedRequest.Date}, ${selectedRequest.startTime} - ${selectedRequest.endTime}`}
            compatibility={selectedRequest.Compatibility === 100 ? "100%" : "0%"}
            balance={850}
            note={completeNote}
            setNote={setCompleteNote}
          />
          <RequestCompletedModal
            isOpen={completedOpen}
            onClose={() => setCompletedOpen(false)}
            onViewCompletePickups={() => { setCompletedOpen(false); setActiveTab("completed"); }}
          />
        </>
      )}

      <RequestAcceptedModal
        isOpen={acceptedOpen}
        onClose={() => setAcceptedOpen(false)}
        onViewActivePickups={() => { setAcceptedOpen(false); setActiveTab("incoming"); }}
      />

      <RejectRequestModal
        isOpen={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onConfirm={({ reason, comments }) => handleRejectRequest(reason, comments)}
      />
    </>
  );
}
