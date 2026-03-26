import { StatsCards, type StatItem } from "@/components/requests/stats-cards";
import RequestsTable from "@/components/requests/requests-table";
import { useGetCollectorPickupStats } from "@/api-hooks/useCollectors";

export function CollectorRequests() {
    const { data: statsResult } = useGetCollectorPickupStats();
    const stats = statsResult?.data;

    const STATS: StatItem[] = [
        { title: "PERFECT MATCH",     data: stats?.pendingRequests  ?? 0, color: "green",  unit: "Requests" },
        { title: "NEEDS COMPLETION",  data: stats?.acceptedRequests ?? 0, color: "yellow", unit: "Requests" },
        { title: "POTENTIAL REVENUE", data: stats?.potentialRevenue ?? 0, color: "blue",   currency: "$"    },
    ];

    return (
        <div className="h-full flex flex-col overflow-auto">
            <div className="pt-6 px-6 shrink-0">
                <StatsCards items={STATS} />
            </div>
            <div className="flex-1 px-6 py-6 min-h-0">
                <RequestsTable />
            </div>
        </div>
    );
}

export default CollectorRequests;

