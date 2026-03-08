import { StatsCards } from "@/components/requests/stats-cards";

export function CollectorRequests() {
    return (
        <div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pt-6 px-6">

                <StatsCards
                    title="TOTAL USERS"
                    data={5}
                    color="green"
                    unit="USERS"
                />

                <StatsCards
                    title="AVG REVENUE/USER"
                    data={25000}
                    currency="$"
                    color="yellow"
                    unit="PER CUSTOMER"
                />

                <StatsCards
                    title="TOTAL COLLECTION"
                    data={91}
                    color="purple"
                    unit="COMPLETED"
                />

            </div>
        </div>
    )
}

export default CollectorRequests;