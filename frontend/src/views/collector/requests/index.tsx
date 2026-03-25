import { StatsCards, type StatItem } from "@/components/requests/stats-cards";
import RequestsTable from "@/components/requests/requests-table";

const STATS: StatItem[] = [
    { title: "PERFECT MATCH",     data: 5,    color: "green",  unit: "Requests" },
    { title: "NEEDS COMPLETION",  data: 25000, color: "yellow", unit: "Requests" },
    { title: "POTENTIAL REVENUE", data: 9100, color: "blue",   currency: "$"    },
];

export function CollectorRequests() {
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
