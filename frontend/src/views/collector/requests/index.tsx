import { useEffect, useState } from "react";
import { StatsCards } from "@/components/requests/stats-cards";
import RequestsTable from "@/components/requests/requests-table";
import { getCollectorStats } from "@/api/collectorRequest";

export function CollectorRequests() {
  const [stats, setStats] = useState({
    perfectMatch: 0,
    needsCompletion: 0,
    potentialRevenue: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const result = await getCollectorStats();

        const data = result?.data ?? result ?? {};

        console.log(data)

        setStats({
          perfectMatch: data.pendingRequests ?? 0,
          needsCompletion: data.acceptedRequests ?? 0,
          potentialRevenue: data.pendingAmount ?? 0,
        });
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };

    loadStats();
  }, []);

  return (
    <div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pt-6 px-6">
        <StatsCards
          title="PERFECT MATCH"
          data={stats.perfectMatch}
          color="green"
          unit="Requests"
        />

        <StatsCards
          title="NEEDS COMPLETION"
          data={stats.needsCompletion}
          color="yellow"
          unit="Requests"
        />

        <StatsCards
          title="POTENTIAL REVENUE"
          data={stats.potentialRevenue}
          currency="$"
          color="blue"
        />
      </div>

      <div className="px-6 py-6">
        <RequestsTable />
      </div>
    </div>
  );
}

export default CollectorRequests;
