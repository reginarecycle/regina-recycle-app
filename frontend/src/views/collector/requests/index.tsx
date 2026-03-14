import { StatsCards } from "@/components/requests/stats-cards";
import RequestsTable from "@/components/requests/requests-table";

export function CollectorRequests() {
    return (
        <div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pt-6 px-6">

                <StatsCards
                    title="PERFECT MATCH"
                    data={5}
                    color="green"
                    unit="Requests"
                />

                <StatsCards
                    title="NEEDS COMPLETION"
                    data={25000}
                    color="yellow"
                    unit="Requests"
                />

                <StatsCards
                    title="POTENTIAL REVENUE"
                    data={9100}
                    currency="$"
                    color="blue"
                />
            </div>
            <div className="px-6 py-6">
                <RequestsTable />
            </div>
        </div>
    )
}

export default CollectorRequests;