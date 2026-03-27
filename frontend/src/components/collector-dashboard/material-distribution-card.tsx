import { PieChart, Pie, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { MaterialDistribution, TopLocations } from "@/api-hooks/useCollectors";

const CHART_COLORS = [
  "#001E62", "#0F6C74", "#7AC70C", "#5B136D",
  "#DCD6F7", "#BFF3CE", "#F59E0B", "#EF4444",
];

type Props = {
  distribution?: MaterialDistribution;
  topLocations?: TopLocations;
  isLoading?:    boolean;
};

export function MaterialDistributionCard({ distribution, topLocations, isLoading }: Props) {
  const materials  = distribution?.materials ?? [];
  const locations  = topLocations?.data       ?? [];
  const totalUnits = materials.reduce((sum, m) => sum + m.totalQuantity, 0);

  const chartData = materials.map((m, i) => ({
    name:  m.name,
    value: m.totalQuantity,
    fill:  CHART_COLORS[i % CHART_COLORS.length],
  }));

  const chartConfig = Object.fromEntries(
    materials.map((m, i) => [
      m.name,
      { label: m.name, color: CHART_COLORS[i % CHART_COLORS.length] },
    ]),
  );

  return (
    <div className="h-full w-full rounded-[16px] border border-[#E5E7EB] bg-white xl:max-w-[476px]">
      {/* Header */}
      <div className="flex h-[82px] items-center justify-between border-b border-[#E5E7EB] px-4 py-4 md:px-6 md:py-3">
        <p className="text-[14px] font-semibold text-[#111827]">Material Distribution</p>
        <span className="text-[12px] text-[#6B7280]">This week</span>
      </div>

      {/* Donut chart */}
      <div className="flex flex-col items-center px-4 pt-6 md:px-6 md:pt-8">
        {isLoading ? (
          <div className="h-[220px] w-[220px] rounded-full animate-pulse bg-gray-100" />
        ) : chartData.length === 0 ? (
          <p className="py-10 text-sm text-[#9CA3AF]">No material data yet</p>
        ) : (
          <>
            <div className="relative flex h-[220px] w-[220px] items-center justify-center">
              <ChartContainer config={chartConfig} className="h-[220px] w-[220px]">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={94}
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>

              <div className="absolute text-center">
                <p className="text-[32px] font-semibold text-[#111827]">
                  {totalUnits >= 1000
                    ? `${(totalUnits / 1000).toFixed(1)}k`
                    : totalUnits}
                </p>
                <p className="text-[14px] font-medium text-[#3A3E44]">Items</p>
              </div>
            </div>

            <div className="mt-8 grid w-full grid-cols-2 gap-x-4 gap-y-4 text-[14px] text-[#111827] md:grid-cols-3 md:gap-x-8 md:gap-y-5">
              {chartData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span
                    className="h-6 w-6 shrink-0 aspect-square"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Top locations */}
      <div className="mt-8 border-t border-[#E5E7EB] px-4 pt-6 md:px-6">
        <p className="text-[14px] font-medium text-[#999CA0]">
          Top pickup locations
        </p>
        {locations.length === 0 ? (
          <p className="mt-4 text-sm text-[#9CA3AF]">No location data yet</p>
        ) : (
          <div className="mt-5 space-y-4 pb-6 text-[14px] text-[#111827]">
            {locations.map((loc, i) => (
              <div key={loc.addressId} className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate">
                  {i + 1}. {loc.line1}, {loc.city}
                </span>
                <span className="shrink-0">{loc.units} units</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
