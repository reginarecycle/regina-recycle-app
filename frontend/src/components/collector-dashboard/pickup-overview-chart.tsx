import { LineChart, Line, XAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { PickupOverview } from "@/api-hooks/useCollectors";

const chartConfig = {
  current:  { label: "Current",  color: "#344E41" },
  previous: { label: "Previous", color: "#999CA0" },
};

type Props = {
  overview?:  PickupOverview;
  isLoading?: boolean;
};

export function PickupOverviewChart({ overview, isLoading }: Props) {
  const data = overview?.overview ?? [];

  return (
    <div className="w-full rounded-[16px] border border-[#E5E7EB] bg-white">
      {/* Header */}
      <div className="flex w-full flex-col gap-3 border-b border-[#E5E7EB] px-4 py-4 md:h-[82px] md:flex-row md:items-center md:justify-between md:px-6 md:py-3">
        <div>
          <p className="text-sm font-semibold text-gray-800">Pickup Overview</p>
          <p className="text-xs text-gray-400">Units volume trends over the current week</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-black" />
            Current
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gray-400" />
            Previous
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="mx-4 mt-4 pb-4 h-[260px] md:mx-6 md:mt-6 md:h-[320px]">
        {isLoading ? (
          <div className="h-full w-full animate-pulse rounded bg-gray-100" />
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <LineChart
              data={data}
              margin={{ top: 20, right: 0, left: 24, bottom: 10 }}
            >
              <CartesianGrid
                vertical={true}
                horizontal={false}
                stroke="#E2E2E2"
                strokeDasharray="4 4"
              />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={{ stroke: "#E2E2E2" }}
                tickMargin={16}
              />
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              <Line
                type="monotone"
                dataKey="previous"
                stroke="var(--color-previous)"
                strokeWidth={2}
                strokeDasharray="6 6"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="current"
                stroke="var(--color-current)"
                strokeWidth={5}
                dot={{ r: 5, fill: "#618171", stroke: "white", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </div>
    </div>
  );
}
