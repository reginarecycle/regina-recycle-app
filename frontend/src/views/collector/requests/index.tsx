import { useCallback, useEffect, useState } from "react";
import { StatsCards, type StatItem } from "@/components/requests/stats-cards";
import RequestsTable from "@/components/requests/requests-table";
import { getCollectorStats } from "@/api/collectorRequest";

export function CollectorRequests() {
  const [stats, setStats] = useState<StatItem[]>([
    { title: "PERFECT MATCH", data: 0, color: "green", unit: "Requests" },
    { title: "NEEDS COMPLETION", data: 0, color: "yellow", unit: "Requests" },
    { title: "POTENTIAL REVENUE", data: 0, color: "blue", currency: "$" },
  ]);

  const loadStats = useCallback(async () => {
    try {
      const result = await getCollectorStats();
      console.log("COLLECTOR STATS:", result);

      const payload = result?.data?? {};

      setStats([
        {
          title: "PERFECT MATCH",
          data: Number(payload.pendingRequests ?? 0),
          color: "green",
          unit: "Requests",
        },
        {
          title: "NEEDS COMPLETION",
          data: Number(payload.acceptedRequests ?? 0),
          color: "yellow",
          unit: "Requests",
        },
        {
          title: "POTENTIAL REVENUE",
          data: Number(payload.pendingAmount ?? 0),
          color: "blue",
          currency: "$",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch collector stats:", error);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <div className="h-full flex flex-col overflow-auto">
      <div className="pt-6 px-6 shrink-0">
        <StatsCards items={stats} />
      </div>

      <div className="flex-1 px-6 py-6 min-h-0">
        <RequestsTable onRefreshStats={loadStats} />
      </div>
    </div>
  );
}

export default CollectorRequests;


