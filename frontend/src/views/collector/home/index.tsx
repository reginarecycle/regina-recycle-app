import { Button } from "@/components/ui/button";
import warningIcon from "@/assets/material-symbols_warning-rounded.svg";
import trendingIcon from "@/assets/lucide_trending-up.svg";
import locationPersonIcon from "@/assets/carbon_location-person-filled.svg";
import checkIcon from "@/assets/lucide_check.svg";
import inventoryIcon from "@/assets/material-symbols_inventory-2-rounded.svg";
import graphIcon from "@/assets/mdi_graph-line-shimmer.svg";
import cashIcon from "@/assets/mdi_cash-multiple.svg";
import historyIcon from "@/assets/lucide_history.svg";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  useGetCollectorStats,
  useGetPickupOverview,
  useGetMaterialDistribution,
  useGetTopLocations,
  useGetCollectorPickups,
} from "@/api-hooks/useCollectors";

// ─── Constants ────────────────────────────────────────────────────────────────

const MATERIAL_COLORS = [
  "#001E62", "#0F6C74", "#7AC70C",
  "#5B136D", "#DCD6F7", "#BFF3CE",
];

const chartConfig = {
  current:  { label: "Current",  color: "#344E41" },
  previous: { label: "Previous", color: "#999CA0" },
};

// ─── Priority Badge ───────────────────────────────────────────────────────────

const PriorityBadge = ({ type }: { type: string }) => {
  const styles: Record<string, string> = {
    HIGH:     "bg-[#F9EDB2] text-[#B45309]",
    LOW:      "bg-[#F3F4F6] text-[#6B7280]",
    NORMAL:   "bg-[#EEF2FF] text-[#1D4ED8]",
    CRITICAL: "bg-[#FEE2E2] text-[#B91C1C]",
  };
  return (
    <span className={`inline-flex w-[85px] items-center justify-center rounded-full px-3 py-1 text-[12px] font-semibold ${styles[type] ?? styles.NORMAL}`}>
      {type}
    </span>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const StatSkeleton = () => (
  <div className="flex min-h-[141px] w-full flex-col gap-3 rounded-[8px] border border-[#E5E7EB] bg-white px-[12px] py-[16px] animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/2" />
    <div className="h-12 bg-gray-200 rounded w-1/3" />
    <div className="h-4 bg-gray-200 rounded w-2/3" />
  </div>
);

// ─── Request Row ──────────────────────────────────────────────────────────────

const RequestRow = ({
  item,
  onAssignNow,
}: {
  item: {
    date: string;
    title: string;
    subtitle: string;
    priority: string;
    details: string[];
  };
  onAssignNow: () => void;
}) => (
  <div className="border-t px-4 py-4 md:grid md:grid-cols-[140px_300px_150px_270px_1fr] md:items-center md:gap-2 md:px-6">
    <div className="mb-2 md:mb-0">
      <p className="text-[12px] text-[#9CA3AF] md:text-[14px] md:text-black">{item.date}</p>
    </div>
    <div className="mb-3 md:mb-0">
      <p className="text-[14px] font-medium text-[#111827]">{item.title}</p>
      <p className="text-[12px] text-[#9CA3AF]">{item.subtitle}</p>
    </div>
    <div className="mb-3 md:mb-0 md:justify-self-start">
      <PriorityBadge type={item.priority} />
    </div>
    <div className="mb-4 flex flex-wrap gap-2 md:mb-0 md:flex-nowrap">
      {item.details.map((detail, index) => (
        <span
          key={index}
          className="flex h-[30px] min-w-[85px] items-center justify-center rounded-full bg-[#618171] px-3 py-1 text-[13px] text-white"
        >
          {detail}
        </span>
      ))}
    </div>
    <div className="md:flex md:justify-end">
      <Button
        size="sm"
        onClick={onAssignNow}
        className="h-[36px] w-full rounded-[8px] border border-[#344E41] bg-white px-[16px] text-[14px] text-[#344E41] md:h-[24px] md:w-auto"
      >
        Assign now
      </Button>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const CollectorDashboard = () => {
  const navigate = useNavigate();

  const goToIncomingRequests  = () => navigate("/app/collector/requests?tab=incoming");
  const goToAcceptedRequests  = () => navigate("/app/collector/requests?tab=accepted");
  const goToCompletedRequests = () => navigate("/app/collector/requests?tab=completed");

  // ── API hooks ──────────────────────────────────────────────────────────────
  const { data: statsResult,        isLoading: statsLoading        } = useGetCollectorStats();
  const { data: overviewResult,     isLoading: overviewLoading     } = useGetPickupOverview();
  const { data: distributionResult, isLoading: distributionLoading } = useGetMaterialDistribution();
  const { data: topLocationsResult                                  } = useGetTopLocations(3);
  const { data: acceptedResult                                      } = useGetCollectorPickups("ACCEPTED", 1, 1);
  const { data: pendingResult                                       } = useGetCollectorPickups("PENDING",  1, 4);

  // ── Derived data ───────────────────────────────────────────────────────────
  const stats        = statsResult?.data;
  const overviewDays = overviewResult?.data?.overview ?? [];
  const materials    = distributionResult?.data?.materials ?? [];
  const topLocations = topLocationsResult?.data?.data ?? [];
  const activePickup = acceptedResult?.data?.data?.[0] ?? null;
  const urgentPickups = pendingResult?.data?.data ?? [];

  // Map overview to chart shape — merge current week with empty previous
  const chartData = overviewDays.map((d) => ({
    day:      d.day,
    current:  d.units,
    previous: 0,
  }));

  // Map materials to pie chart shape
  const materialChartData = materials.map((m, i) => ({
    name:  m.name,
    value: m.totalQuantity,
    fill:  MATERIAL_COLORS[i % MATERIAL_COLORS.length],
  }));

  const materialChartConfig = Object.fromEntries(
    materials.map((m, i) => [
      m.name,
      { label: m.name, color: MATERIAL_COLORS[i % MATERIAL_COLORS.length] },
    ])
  );

  const totalItems = materials.reduce((sum, m) => sum + m.totalQuantity, 0);

  // Map pending pickups to urgent request row shape
  const urgentRequests = urgentPickups.map((p) => ({
    date:     new Date(p.scheduledAt).toLocaleDateString("en-CA", { day: "numeric", month: "short", year: "numeric" }),
    title:    `${p.requester?.name ?? "Customer"} Pickup`,
    subtitle: `${p.address?.line1 ?? "Unknown address"} • ${p.items.reduce((s, i) => s + i.quantity, 0)} Units`,
    priority: "NORMAL",
    details:  p.items.map((i) => i.material.name),
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-6">

      {/* Row 1 — Stat Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
        ) : (
          <>
            {/* Pending Requests */}
            <div className="flex min-h-[141px] w-full flex-col items-start gap-[12px] rounded-[8px] border border-[#E5E7EB] bg-white px-[12px] py-[16px]">
              <div className="flex w-full items-start justify-between">
                <p className="text-[14px] font-medium text-[#4B5563]">Pending Requests</p>
                <img src={warningIcon} className="h-[24px] w-[24px]" />
              </div>
              <div className="flex items-center gap-[10px]">
                <h2 className="text-[48px] font-bold leading-none text-[#111827]">
                  {stats?.pendingRequests ?? 0}
                </h2>
                <span className="rounded-full border border-[#F59E0B] bg-[#FEF3C7]/50 px-[10px] py-[2px] text-[10px] font-medium text-[#F59E0B]">
                  NEEDS ACTION
                </span>
              </div>
              <div className="flex items-center gap-[4px]">
                <img src={trendingIcon} className="h-[16px] w-[16px]" />
                <p className="text-[14px] text-[#6B7280]">Pending pickups</p>
              </div>
            </div>

            {/* Accepted Requests */}
            <div className="flex min-h-[141px] w-full flex-col items-start gap-[12px] rounded-[8px] border border-[#E5E7EB] bg-white px-[12px] py-[16px]">
              <div className="flex w-full items-start justify-between">
                <p className="text-[14px] font-medium text-[#4B5563]">Accepted Requests</p>
                <img src={locationPersonIcon} className="h-[24px] w-[24px]" />
              </div>
              <div className="flex items-center gap-[12px]">
                <h2 className="text-[48px] font-bold leading-none text-[#111827]">
                  {stats?.acceptedRequests ?? 0}
                </h2>
                <span className="rounded-full border border-[#4ADE80] bg-[#DCFCE7] px-[10px] py-[2px] text-[10px] font-medium text-[#22C55E]">
                  IN PROGRESS
                </span>
              </div>
              <div className="flex items-center gap-[4px]">
                <img src={checkIcon} className="h-[16px] w-[16px]" />
                <p className="text-[14px] text-[#6B7280]">Active pickups</p>
              </div>
            </div>

            {/* Total Items */}
            <div className="flex min-h-[141px] w-full flex-col items-start gap-[12px] rounded-[8px] border border-[#E5E7EB] bg-white px-[12px] py-[16px]">
              <div className="flex w-full items-start justify-between">
                <p className="text-[14px] font-medium text-[#4B5563]">Total Items</p>
                <img src={inventoryIcon} className="h-[24px] w-[24px]" />
              </div>
              <div className="flex items-end gap-[6px]">
                <h2 className="text-[48px] font-bold leading-none text-[#111827]">
                  {(stats?.totalItems ?? 0).toLocaleString()}
                </h2>
                <span className="text-[12px] font-medium text-[#6B7280] mb-[6px]">UNITS</span>
              </div>
              <div className="flex items-center gap-[4px]">
                <img src={graphIcon} className="h-[16px] w-[16px]" />
                <p className="text-[14px] font-medium text-[#4B5563]">Total collected units</p>
              </div>
            </div>

            {/* Pending Amount */}
            <div className="flex min-h-[141px] w-full flex-col items-start gap-[12px] rounded-[8px] border border-[#E5E7EB] bg-white px-[12px] py-[16px]">
              <div className="flex w-full items-start justify-between">
                <p className="text-[14px] font-medium text-[#4B5563]">Pending Amount</p>
                <img src={cashIcon} className="h-[24px] w-[24px]" />
              </div>
              <div className="flex items-center gap-[12px]">
                <h2 className="text-[48px] font-bold leading-none text-[#111827]">
                  ${stats?.pendingAmount?.toFixed(0) ?? 0}
                </h2>
              </div>
              <div className="flex items-center gap-[4px]">
                <img src={historyIcon} className="h-[16px] w-[16px]" />
                <p className="text-[14px] text-[#9CA3AF]">Estimated earnings</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Row 2 — Charts */}
      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_476px] xl:items-stretch">
        <div className="min-w-0 flex flex-col gap-6 h-full">

          {/* Pickup Overview Chart */}
          <div className="w-full rounded-[16px] border border-[#E5E7EB] bg-white">
            <div className="flex w-full flex-col gap-3 border-b border-[#E5E7EB] px-4 py-4 md:h-[82px] md:flex-row md:items-center md:justify-between md:px-[24px] md:py-[12px]">
              <div>
                <p className="text-sm font-semibold text-gray-800">Pickup Overview</p>
                <p className="text-xs text-gray-400">Units volume trends over the current week</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-black" /> Current
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-400" /> Previous
                </span>
              </div>
            </div>
            <div className="mx-4 mt-4 pb-4 h-[260px] md:mx-[24px] md:mt-[24px] md:h-[320px]">
              {overviewLoading ? (
                <div className="h-full w-full bg-gray-100 rounded-xl animate-pulse" />
              ) : (
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <LineChart data={chartData} margin={{ top: 20, right: 0, left: 24, bottom: 10 }}>
                    <CartesianGrid vertical={true} horizontal={false} stroke="#E2E2E2" strokeDasharray="4 4" />
                    <XAxis dataKey="day" tickLine={false} axisLine={{ stroke: "#E2E2E2" }} tickMargin={16} />
                    <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                    <Line type="monotone" dataKey="previous" stroke="var(--color-previous)" strokeWidth={2} strokeDasharray="6 6" dot={false} />
                    <Line type="monotone" dataKey="current" stroke="var(--color-current)" strokeWidth={5}
                      dot={{ r: 5, fill: "#618171", stroke: "white", strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ChartContainer>
              )}
            </div>
          </div>

          {/* Active Pickup */}
          <div className="flex flex-1 flex-col w-full rounded-[16px] border border-[#E5E7EB] bg-white">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-4 md:h-[58px] md:px-[24px] md:py-[12px]">
              <div>
                <h3 className="text-[16px] font-semibold text-[#000000]">Active Pickups</h3>
                <p className="text-[12px] text-[#999CA0]">Pickups you need to complete</p>
              </div>
              <button onClick={goToAcceptedRequests} className="flex items-center gap-1 bg-white text-[14px] font-semibold text-[#344E41] hover:text-[#618171]">
                View All
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="#344E41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {activePickup ? (
              <div className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-[24px] md:py-[16px]">
                <div className="flex min-w-0 items-center gap-[16px]">
                  <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[#F3F4F6]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M14 18V6C14 5.46957 13.7893 4.96086 13.4142 4.58579C13.0391 4.21071 12.5304 4 12 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V17C2 17.2652 2.10536 17.5196 2.29289 17.7071C2.48043 17.8946 2.73478 18 3 18H5M15 18H9M19 18H21C21.2652 18 21.5196 17.8946 21.7071 17.7071C21.8946 17.5196 22 17.2652 22 17V13.35C21.9996 13.1231 21.922 12.903 21.78 12.726L18.3 8.376C18.2065 8.25888 18.0878 8.16428 17.9528 8.0992C17.8178 8.03412 17.6699 8.00021 17.52 8H14" stroke="#344E41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M17 20C18.1046 20 19 19.1046 19 18C19 16.8954 18.1046 16 17 16C15.8954 16 15 16.8954 15 18C15 19.1046 15.8954 20 17 20Z" stroke="#344E41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7 20C8.10457 20 9 19.1046 9 18C9 16.8954 8.10457 16 7 16C5.89543 16 5 16.8954 5 18C5 19.1046 5.89543 20 7 20Z" stroke="#344E41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[16px] font-semibold text-[#111827]">Doorstep Pickup</p>
                    <p className="text-[12px] text-[#10131D]">
                      {new Date(activePickup.scheduledAt).toLocaleDateString("en-CA", {
                        month: "short", day: "numeric", year: "numeric",
                      })} at {new Date(activePickup.scheduledAt).toLocaleTimeString("en-CA", {
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                    <div className="mt-[6px] flex flex-wrap items-center gap-x-[16px] gap-y-[4px] text-[14px] text-[#111827]/75">
                      <div className="flex items-center gap-1">
                        <span>👤</span>
                        <span>{activePickup.requester?.name ?? "Customer"}</span>
                      </div>
                      <div className="flex min-w-0 items-center gap-1">
                        <span>📍</span>
                        <span className="truncate">{activePickup.address?.line1 ?? "Address unavailable"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>📦</span>
                        <span>{activePickup.items.reduce((s, i) => s + i.quantity, 0)} units</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={goToCompletedRequests}
                  className="flex w-full items-center justify-center gap-[8px] bg-[#163A24] text-white hover:bg-[#163A24] md:w-[176px]"
                >
                  <span className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-white shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke="#163A24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  Complete Pickup
                </Button>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center p-8 text-sm text-muted-foreground">
                No active pickups
              </div>
            )}
          </div>
        </div>

        {/* Material Distribution */}
        <div className="h-full w-full rounded-[16px] border border-[#E5E7EB] bg-white xl:max-w-[476px]">
          <div className="flex h-[82px] items-center justify-between border-b border-[#E5E7EB] px-4 py-4 md:px-[24px] md:py-[12px]">
            <p className="text-[14px] font-semibold text-[#111827]">Material Distribution</p>
            <span className="text-[12px] text-[#6B7280]">All time</span>
          </div>

          <div className="flex flex-col items-center px-4 pt-6 md:px-6 md:pt-8">
            {distributionLoading ? (
              <div className="h-[220px] w-[220px] rounded-full bg-gray-200 animate-pulse" />
            ) : materialChartData.length > 0 ? (
              <div className="relative flex h-[220px] w-[220px] items-center justify-center">
                <ChartContainer config={materialChartConfig} className="h-[220px] w-[220px]">
                  <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Pie data={materialChartData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={94} stroke="none">
                      {materialChartData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                <div className="absolute text-center">
                  <p className="text-[32px] font-semibold text-[#111827]">
                    {totalItems >= 1000 ? `${(totalItems / 1000).toFixed(1)}k` : totalItems}
                  </p>
                  <p className="text-[14px] font-medium text-[#3A3E44]">Items</p>
                </div>
              </div>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
                No material data yet
              </div>
            )}

            <div className="mt-8 grid w-full grid-cols-2 gap-x-4 gap-y-4 text-[14px] text-[#111827] md:grid-cols-3 md:gap-x-8 md:gap-y-5">
              {materialChartData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="h-6 w-6 aspect-square shrink-0" style={{ backgroundColor: item.fill }} />
                  <span className="truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Locations */}
          <div className="mt-8 border-t border-[#E5E7EB] px-4 pt-6 md:px-6">
            <p className="text-[14px] font-medium text-[#999CA0]">
              Current month's top performing zones
            </p>
            <div className="mt-5 space-y-4 text-[14px] text-[#111827]">
              {topLocations.length === 0 ? (
                <p className="text-sm text-muted-foreground">No location data yet</p>
              ) : (
                topLocations.map((loc, index) => (
                  <div key={loc.addressId} className="flex items-center justify-between">
                    <span className="truncate">{index + 1}. {loc.line1}</span>
                    <span className="shrink-0 text-[#111827] ml-3">{loc.units.toLocaleString()} units</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Requests */}
      <div className="mt-6 rounded-[16px] border border-[#E5E7EB] bg-white">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-4 md:px-6">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500">⚡</span>
            <p className="text-[14px] font-semibold text-[#111827]">URGENT REQUEST</p>
          </div>
          <button onClick={goToIncomingRequests} className="flex items-center gap-1 font-semibold text-[14px] text-[#344E41] hover:text-[#618171]">
            View All
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="#344E41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="hidden md:grid grid-cols-[140px_300px_150px_270px_1fr] gap-2 px-6 py-3 text-[14px] text-[#999CA0]">
          <p>Date</p>
          <p>Material</p>
          <p>Priority</p>
          <p>Request Details</p>
          <p className="flex justify-end pr-8">Action</p>
        </div>

        {urgentRequests.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
            No pending requests
          </div>
        ) : (
          urgentRequests.map((item, index) => (
            <RequestRow key={index} item={item} onAssignNow={goToIncomingRequests} />
          ))
        )}
      </div>
    </div>
  );
};

export default CollectorDashboard;