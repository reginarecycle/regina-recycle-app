import {
  useGetPickupOverview,
  useGetMaterialDistribution,
  useGetTopLocations,
  useGetCollectorDashboardStats,
  useGetCollectorPickupRequests,
} from "@/api-hooks/useCollectors";
import { CollectorStatCards } from "@/components/collector-dashboard/stat-cards";
import { PickupOverviewChart } from "@/components/collector-dashboard/pickup-overview-chart";
import { ActivePickupCard } from "@/components/collector-dashboard/active-pickup-card";
import { MaterialDistributionCard } from "@/components/collector-dashboard/material-distribution-card";
import { UrgentRequestsTable } from "@/components/collector-dashboard/urgent-requests-table";

const CollectorDashboard = () => {
  const { data: statsResult,       isLoading: statsLoading }        = useGetCollectorDashboardStats();
  const { data: overviewResult,    isLoading: overviewLoading }     = useGetPickupOverview();
  const { data: distributionResult, isLoading: distributionLoading } = useGetMaterialDistribution();
  const { data: topLocationsResult }                                 = useGetTopLocations(3);
  const { data: acceptedResult }                                     = useGetCollectorPickupRequests({ status: "ACCEPTED", page: 1, limit: 1 });
  const { data: pendingResult,     isLoading: pendingLoading }      = useGetCollectorPickupRequests({ status: "PENDING", limit: 4 });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <CollectorStatCards
        stats={statsResult?.data}
        isLoading={statsLoading}
      />

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_476px] xl:items-stretch">
        <div className="flex min-w-0 flex-col gap-6 h-full">
          <PickupOverviewChart
            overview={overviewResult?.data}
            isLoading={overviewLoading}
          />
          <ActivePickupCard
            pickup={acceptedResult?.data?.data?.[0]}
          />
        </div>

        <MaterialDistributionCard
          distribution={distributionResult?.data}
          topLocations={topLocationsResult?.data}
          isLoading={distributionLoading}
        />
      </div>

      <UrgentRequestsTable
        pickups={pendingResult?.data?.data}
        isLoading={pendingLoading}
      />
    </div>
  );
};

export default CollectorDashboard;