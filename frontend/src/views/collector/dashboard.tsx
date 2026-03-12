import { Button } from "@/components/ui/button";
import warningIcon from "@/assets/material-symbols_warning-rounded.svg";
import trendingIcon from "@/assets/lucide_trending-up.svg";
import locationPersonIcon from "@/assets/carbon_location-person-filled.svg";
import checkIcon from "@/assets/lucide_check.svg";
import inventoryIcon from "@/assets/material-symbols_inventory-2-rounded.svg";
import graphIcon from "@/assets/mdi_graph-line-shimmer.svg";
import cashIcon from "@/assets/mdi_cash-multiple.svg";
import historyIcon from "@/assets/lucide_history.svg";
import {useNavigate} from "react-router-dom";
import { LineChart, Line, XAxis, CartesianGrid } from "recharts"
import {
 ChartContainer,
 ChartTooltip,
 ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
 { day: "Mon", current: 20, previous: 38 },
 { day: "Tue", current: 52, previous: 70 },
 { day: "Wed", current: 28, previous: 48 },
 { day: "Thur", current: 60, previous: 82 },
 { day: "Fri", current: 45, previous: 68 },
 { day: "Sat", current: 66, previous: 92 },
 { day: "Sun", current:92, previous: 120 },
]


const chartConfig = {
 current: {
   label: "Current",
   color: "#344E41",
 },
 previous: {
   label: "Previous",
   color: "#999CA0",
 },
}

const PriorityBadge = ({ type }: { type: string }) => {
const styles = {
 HIGH: "bg-[#F9EDB2] text-[#B45309]",
 LOW: "bg-[#F3F4F6] text-[#6B7280]",
 NORMAL: "bg-[#EEF2FF] text-[#1D4ED8]",
 CRITICAL: "bg-[#FEE2E2] text-[#B91C1C]",
};

return (
 <span
   className={`inline-flex w-[85px] items-center justify-center rounded-full px-3 py-1 text-[12px] font-semibold ${
     styles[type as keyof typeof styles]
   }`}
 >
   {type}
 </span>
);
};

type PriorityType = "HIGH" | "LOW" | "NORMAL" | "CRITICAL";

type UrgentRequestItem = {
date: string;
title: string;
subtitle: string;
priority: PriorityType;
details: string[];
};

const urgentRequests: UrgentRequestItem[] = [
{
 date: "14, Jan 2023",
 title: "Residential Plastic Pickup",
 subtitle: "Harbour Landing • 12 Units",
 priority: "HIGH",
 details: ["Plastic"],
},
{
 date: "14, Jan 2023",
 title: "Residential Mixed Pickup",
 subtitle: "Harbour Landing • 12 Units",
 priority: "LOW",
 details: ["Glass", "Plastic", "Carton"],
},
{
 date: "14, Jan 2023",
 title: "Residential Mixed Pickup",
 subtitle: "Harbour Landing • 12 Units",
 priority: "NORMAL",
 details: ["Carton", "Glass"],
},
{
 date: "14, Jan 2023",
 title: "Residential Glass Pickup",
 subtitle: "Harbour Landing • 12 Units",
 priority: "CRITICAL",
 details: ["Glass"],
},
];

const RequestRow = ({
  item,
  onAssignNow,
}: {
  item: UrgentRequestItem;
  onAssignNow: () => void;
}) => {
return (
 <div className="grid grid-cols-[140px_260px_120px_260px_260px] gap-2 items-center border-t px-6 py-4 font-semibold">
   <p>{item.date}</p>
   <div>
     <p className="font-medium text-[#111827]">{item.title}</p>
     <p className="text-[12px] text-[#9CA3AF]">{item.subtitle}</p>
   </div>
   <div className="justify-self-start">
     <PriorityBadge type={item.priority} />
   </div>
   <div className="flex gap-2 whitespace-nowrap">
     {item.details.map((detail, index) => (
       <span
         key={index}
         className="flex rounded-full h-[30px] w-[85px] bg-[#618171] px-3 py-1 text-[14px] text-white justify-center items-center gap-[10px] text-[#FBFBFB]"
       >
         {detail}
       </span>
     ))}
   </div>

   <div className="flex justify-end shrink-0">
<Button
  size="sm"
  onClick={onAssignNow}
  className="h-[24px] px-[16px] rounded-[8px] border border-[#344E41] bg-white text-[#344E41] text-[14px]">
  Assign now
</Button>
</div>
 </div>
);
};

const CollectorDashboard = () => {
  const navigate = useNavigate();
  
  const goToIncomingRequests = () => {
  navigate("/app/collector/requests?tab=incoming");
};

const goToAcceptedRequests = () => {
  navigate("/app/collector/requests?tab=accepted");
};

const goToCompletedRequests = () => {
  navigate("/app/collector/requests?tab=completed");
};
  
const donutSegments = [
 { label: "Plastic", color: "#001E62", value: 95 },
 { label: "Cartoon", color: "#0F6C74", value: 20 },
 { label: "Plastic", color: "#7AC70C", value: 25 },
 { label: "Plastic", color: "#5B136D", value: 30 },
 { label: "Plastic", color: "#DCD6F7", value: 16 },
 { label: "Plastic", color: "#BFF3CE ", value: 30 },
];

const polarToCartesian = (
 cx: number,
 cy: number,
 r: number,
 angleInDegrees: number,
) => {
 const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
 return {
   x: cx + r * Math.cos(angleInRadians),
   y: cy + r * Math.sin(angleInRadians),
 };
};

const describeArc = (
 cx: number,
 cy: number,
 r: number,
 startAngle: number,
 endAngle: number,
) => {
 const start = polarToCartesian(cx, cy, r, endAngle);
 const end = polarToCartesian(cx, cy, r, startAngle);
 const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
 return [
   "M",
   start.x,
   start.y,
   "A",
   r,
   r,
   0,
   largeArcFlag,
   0,
   end.x,
   end.y,
 ].join(" ");
};

return (
 <div className="min-h-screen bg-gray-100 p-6">
   {/* Row 1 — Stat Cards */}
   {/* Row 1 — Stat Cards */}
  <div className="mb-6 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
     <div className="flex h-[141px] w-[272px] shrink-0 flex-col items-start gap-[12px] rounded-[8px] border border-[#E5E7EB] bg-white px-[12px] py-[16px]">
{/* Top row */}
<div className="flex w-full items-start justify-between">
  <p className="text-[14px] font-medium text-[#4B5563]">Pending Requests</p>
  <img
   src={warningIcon}
  className="h-[24px] w-[24px]"
  />
</div>

{/* Middle row */}
<div className="flex items-center gap-[10px]">
  <h2 className="text-[48px] font-bold leading-none text-[#111827]">14</h2>
  <span className="rounded-full border border-[#F59E0B] bg-[#FEF3C7]/50 px-[10px] py-[2px] text-[10px] font-medium text-[#F59E0B]">
    NEEDS ACTION
  </span>
</div>

{/* Bottom row */}
<div className="flex items-center gap-[4px]">
  <img
    src={trendingIcon}
    className="h-[16px] w-[16px]"
  />
  <p className="text-[14px] text-[#6B7280]">+3 since 1h ago</p>
</div>
</div>

     <div className="flex h-[141px] w-[272px] shrink-0 flex-col items-start gap-[12px] rounded-[8px] border border-[#E5E7EB] bg-white px-[12px] py-[16px]">
{/* Top row */}
<div className="flex w-full items-start justify-between">
  <p className="text-[14px] font-medium text-[#4B5563]">Accepted Requests</p>
  <img
    src={locationPersonIcon}
    alt="location person"
    className="h-[24px] w-[24px]"
  />
</div>
{/* Middle row */}
<div className="flex items-center gap-[12px]">
  <h2 className="text-[48px] font-bold leading-none text-[#111827]">14</h2>
  <span className="rounded-full border border-[#4ADE80] bg-[#DCFCE7] px-[10px] py-[2px] text-[10px] font-medium text-[#22C55E]">
    NEEDS ACTION
  </span>
</div>
{/* Bottom row */}
<div className="flex items-center gap-[4px]">
  <img
    src={checkIcon}
    alt="check"
    className="h-[16px] w-[16px]"
  />
  <p className="text-[14px] text-[#6B7280]">3 standby available</p>
</div>
</div>

<div className="flex h-[141px] w-[272px] shrink-0 flex-col items-start gap-[12px] rounded-[8px] border border-[#E5E7EB] bg-white px-[12px] py-[16px]">
{/* Top row */}
<div className="flex w-full items-start justify-between">
  <p className="text-[14px] font-medium text-[#4B5563]">
    Total Items
  </p>
  <img
    src={inventoryIcon}
    alt="inventory"
    className="h-[24px] w-[24px]"
  />
</div>
{/* Middle row */}
<div className="flex items-end gap-[6px]">
  <h2 className="text-[48px] font-bold leading-none text-[#111827]">
    12,450
  </h2>
  <span className="text-[12px] font-medium text-[#6B7280] mb-[6px]">
    UNITS
  </span>
</div>

{/* Bottom row */}
<div className="flex items-center gap-[4px]">
  <img
    src={graphIcon}
    alt="graph"
    className="h-[16px] w-[16px]"
  />
  <p className="text-[14px] font-medium">
  <span className="text-[#22C55E]">13%</span>
  <span className="text-[#4B5563]"> vs yesterday</span>
</p>
</div>
</div>
     <div className="flex h-[141px] w-[272px] shrink-0 flex-col items-start gap-[12px] rounded-[8px] border border-[#E5E7EB] bg-white px-[12px] py-[16px]">
{/* Top row */}
<div className="flex w-full items-start justify-between">
  <p className="text-[14px] font-medium text-[#4B5563]">Pending Amount</p>
  <img
    src={cashIcon}
    alt="cash"
    className="h-[24px] w-[24px]"
  />
</div>


{/* Middle row */}
<div className="flex items-center gap-[12px]">
  <h2 className="text-[48px] font-bold leading-none text-[#111827]">$140</h2>
</div>

{/* Bottom row */}
<div className="flex items-center gap-[4px]">
  <img
    src={historyIcon}
    alt="history"
    className="h-[16px] w-[16px]"
  />
  <p className="text-[14px] text-[#9CA3AF]">$12 pending approval</p>
</div>
  </div>
   </div>

   {/* Row 2 — Charts */}
   <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_476px]">
     <div className="min-w-0 flex flex-col">
       <div className="h-[439px] w-full rounded-[16px] bg-white">
         {/* Header */}
         <div className="flex w-full h-[82px] items-center justify-between px-[24px] py-[12px] border-b border-[#E5E7EB] rounded-t-[8px]">
           <div>
             <p className="text-sm font-semibold text-gray-800">
               Pickup Overview
             </p>
             <p className="text-xs text-gray-400">
               Units volume trends over the current week
             </p>
           </div>

           <div className="flex items-center gap-4 text-xs text-gray-500">
             <span className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-black"></span>
               Current
             </span>
             <span className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-gray-400"></span>
               Previous
             </span>
           </div>
         </div>

         {/* Chart Area */}
         <div className="mx-[24px] mt-[24px] h-[320px]">
 <ChartContainer config={chartConfig} className="h-full w-full">
   <LineChart
     data={chartData}
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

     <ChartTooltip
       content={<ChartTooltipContent indicator="dot" />}
     />

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
</div>



     
       {/* active pickup */}
       {/* active pickup */}
<div className="mt-10 h-[167px] w-full rounded-[16px] border border-[#E5E7EB] bg-white">
{/* header */}
<div className="flex h-[58px] items-center justify-between border-b border-[#E5E7EB] px-[24px] py-[12px]">
 <div>
   <h3 className="text-[16px] font-semibold text-[#000000]">Active Pickups</h3>
   <p className="text-[12px] text-[#999CA0]">Pickups you need to complete</p>
 </div>

 <button
   onClick = {goToAcceptedRequests}
   className="flex items-center gap-1 bg-[#FFFFFF] text-[14px] font-semibold text-[#344E41] hover:bg-white hover:text-[#618171]"
 >
   View All
   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
     <path
       d="M6 12L10 8L6 4"
       stroke="#344E41"
       strokeWidth="2"
       strokeLinecap="round"
       strokeLinejoin="round"
     />
   </svg>
 </button>
</div>

{/* body */}
<div className="flex h-[94px] items-center justify-between px-[24px] py-[16px]">
<div className="flex min-w-0 items-center gap-[16px]">
 <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[#F3F4F6]">
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
<path d="M14 18V6C14 5.46957 13.7893 4.96086 13.4142 4.58579C13.0391 4.21071 12.5304 4 12 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V17C2 17.2652 2.10536 17.5196 2.29289 17.7071C2.48043 17.8946 2.73478 18 3 18H5M15 18H9M19 18H21C21.2652 18 21.5196 17.8946 21.7071 17.7071C21.8946 17.5196 22 17.2652 22 17V13.35C21.9996 13.1231 21.922 12.903 21.78 12.726L18.3 8.376C18.2065 8.25888 18.0878 8.16428 17.9528 8.0992C17.8178 8.03412 17.6699 8.00021 17.52 8H14" stroke="#344E41" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17 20C18.1046 20 19 19.1046 19 18C19 16.8954 18.1046 16 17 16C15.8954 16 15 16.8954 15 18C15 19.1046 15.8954 20 17 20Z" stroke="#344E41" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7 20C8.10457 20 9 19.1046 9 18C9 16.8954 8.10457 16 7 16C5.89543 16 5 16.8954 5 18C5 19.1046 5.89543 20 7 20Z" stroke="#344E41" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
 </div>
 <div className="min-w-0">
   <p className="text-[16px] font-semibold text-[#111827]">
     Doorstep Pickup
   </p>
   <p className="text-[12px] text-[#10131D]">
     Jan. 25, 2026 at 9:00AM
   </p>

   <div className="mt-[6px] flex flex-wrap items-center gap-x-[16px] gap-y-[4px] text-[14px] text-[#111827]/75">
     <div className="flex items-center gap-1">
       <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
<path d="M19 21V19C19 17.9391 18.5786 16.9217 17.8284 16.1716C17.0783 15.4214 16.0609 15 15 15H9C7.93913 15 6.92172 15.4214 6.17157 16.1716C5.42143 16.9217 5 17.9391 5 19V21" fill="#344E41"/>
<path d="M19 21V19C19 17.9391 18.5786 16.9217 17.8284 16.1716C17.0783 15.4214 16.0609 15 15 15H9C7.93913 15 6.92172 15.4214 6.17157 16.1716C5.42143 16.9217 5 17.9391 5 19V21" stroke="#344E41" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#344E41" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></span>
       <span>Nelson Oyi</span>
     </div>
     <div className="flex min-w-0 items-center gap-1">
       <span className="shrink-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
<path d="M12 11.5C11.337 11.5 10.7011 11.2366 10.2322 10.7678C9.76339 10.2989 9.5 9.66304 9.5 9C9.5 8.33696 9.76339 7.70107 10.2322 7.23223C10.7011 6.76339 11.337 6.5 12 6.5C12.663 6.5 13.2989 6.76339 13.7678 7.23223C14.2366 7.70107 14.5 8.33696 14.5 9C14.5 9.3283 14.4353 9.65339 14.3097 9.95671C14.1841 10.26 13.9999 10.5356 13.7678 10.7678C13.5356 10.9999 13.26 11.1841 12.9567 11.3097C12.6534 11.4353 12.3283 11.5 12 11.5ZM12 2C10.1435 2 8.36301 2.7375 7.05025 4.05025C5.7375 5.36301 5 7.14348 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 7.14348 18.2625 5.36301 16.9497 4.05025C15.637 2.7375 13.8565 2 12 2Z" fill="#344E41"/>
</svg></span>
       <span className="truncate ">123 Lane, Str.</span>
     </div>


     <div className="flex items-center gap-1">
       <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
<path d="M10 11.5C9.59047 11.5 9.22338 11.6448 8.93359 11.9355C8.64505 12.2253 8.50096 12.5909 8.5 12.999C8.49908 13.4091 8.64404 13.7759 8.93457 14.0664C9.22466 14.3565 9.59075 14.5004 10 14.499V14.5H14C14.4095 14.5 14.7762 14.3556 15.0664 14.0654C15.3566 13.7752 15.5009 13.4085 15.5 12.999C15.499 12.5909 15.355 12.2253 15.0664 11.9355C14.7766 11.6448 14.4095 11.5 14 11.5H10ZM3.5 7.5H20.5V3.5H3.5V7.5ZM3.5 8.44434L3.26074 8.29883C3.02518 8.15487 2.83959 7.97158 2.69824 7.74707C2.57076 7.54449 2.5 7.301 2.5 7V4C2.5 3.58381 2.64261 3.2397 2.94141 2.94141C3.20313 2.68025 3.49936 2.53859 3.84766 2.50684L4.00098 2.5H20C20.4162 2.5 20.7605 2.64234 21.0596 2.94141C21.3585 3.24037 21.5004 3.58404 21.5 3.99902V7C21.5 7.30006 21.4295 7.54348 21.3018 7.74707C21.1606 7.97196 20.9749 8.1545 20.7402 8.29688L20.5 8.44238V20C20.5 20.4163 20.3579 20.7606 20.0596 21.0596C19.7616 21.358 19.4176 21.5004 19.001 21.5H5C4.58354 21.5 4.23963 21.3578 3.94141 21.0596C3.68039 20.7986 3.53854 20.5021 3.50684 20.1523L3.5 19.999V8.44434Z" fill="#618171" stroke="#344E41"/>
</svg></span>
       <span>300 units</span>
     </div>
   </div>
 </div>
</div>


<Button
  size="lg"
  onClick={goToCompletedRequests}
  className="w-[176px] flex items-center justify-center gap-[8px] bg-[#163A24] text-white hover:bg-[#163A24]"
>
  <span className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-white shrink-0">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M20 6L9 17L4 12"
        stroke="#163A24"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>

  Complete Pickup
</Button>
</div>
</div>


     </div>
     </div>
     {/* right side */}
     {/* RIGHT CARD — Material Distribution */}
     <div className="h-[634px] w-full max-w-[476px] rounded-[16px] border border-[#E5E7EB] bg-white">
       {/* Header */}
       <div className="flex h-[82px] items-center justify-between border-b border-[#E5E7EB] px-[24px] py-[12px]">
         <p className="text-[14px] font-semibold text-[#111827]">
           Material Distribution
         </p>
         <span className="text-[12px] text-[#6B7280]">Today</span>
       </div>

       {/* Donut chart */}
       <div className="flex flex-col items-center px-6 pt-8">
         <div className="relative flex h-[220px] w-[220px] items-center justify-center">
           <svg width="220" height="220" viewBox="0 0 220 220" fill="none">
             <circle
               cx="110"
               cy="110"
               r="70"
               stroke="#F1F3F5"
               strokeWidth="24"
               fill="none"
             />

             {(() => {
               const total = donutSegments.reduce(
                 (sum, s) => sum + s.value,
                 0,
               );
               let currentAngle = 0;
               return donutSegments.map((segment, index) => {
                 const angle = (segment.value / total) * 360;
                 const gap = 0; // small white gap between slices
                 const startAngle = currentAngle + gap / 2;
                 const endAngle = currentAngle + angle - gap / 2;
                 const path = describeArc(
                   110,
                   110,
                   70,
                   startAngle,
                   endAngle,
                 );
                 currentAngle += angle;
                 return (
                   <path
                     key={index}
                     d={path}
                     stroke={segment.color}
                     strokeWidth="24"
                     strokeLinecap="butt"
                     fill="none"
                   />
                 );
               });
             })()}
           </svg>
           <div className="absolute text-center">
             <p className="text-[32px] font-semibold text-[#111827]">
               12.5k
             </p>
             <p className="text-[14px] text-[#3A3E44] font-medium">Items</p>
           </div>
         </div>
         <div className="mt-8 grid grid-cols-3 gap-x-8 gap-y-5 text-[14px] text-[#111827]">
           {donutSegments.map((item, index) => (
             <div key={index} className="flex items-center gap-2">
               <span
                 className="h-6 w-6 aspect-square"
                 style={{ backgroundColor: item.color }}
               />
               <span>{item.label}</span>
             </div>
           ))}
         </div>
       </div>
       {/* Bottom section */}
       <div className="mt-8 border-t border-[#E5E7EB] px-6 pt-6">
         <p className="text-[14px] font-medium text-[#999CA0]">
           Current month&apos;s top performing zones
         </p>
         <div className="mt-5 space-y-4 text-[14px] text-[#111827]">
           <div className="flex items-center justify-between">
             <span>1. Harbor Landing</span>
             <span className="text-[#111827]">12000 units</span>
           </div>
           <div className="flex items-center justify-between">
             <span>2. North-Central</span>
             <span className="text-[#111827]">1200 units</span>
           </div>
           <div className="flex items-center justify-between gap-3">
             <span className="min-w-0 truncate">3. Green&apos;s</span>
             <span className="shrink-0 text-[#111827]">600 units</span>
           </div>
         </div>
       </div>
     </div>
   </div>
{/* URGENT REQUEST */}
<div className="mt-6 rounded-[16px] border border-[#E5E7EB] bg-white">
{/* Header */}
<div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
 <div className="flex items-center gap-2">
   <span className="text-yellow-500">⚡</span>
   <p className="text-[14px] font-semibold text-[#111827]">
     URGENT REQUEST
   </p>
 </div>
 <button 
 onClick={goToIncomingRequests}
 className="flex items-center gap-1 font-semibold text-[14px] text-[#344E41] hover:text-[#618171]">
   View All
   <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
     <path
       d="M6 12L10 8L6 4"
       stroke="#344E41"
       strokeWidth="2"
       strokeLinecap="round"
       strokeLinejoin="round"
     />
   </svg>
 </button>
</div>

{/* Table Header */}
<div className="grid grid-cols-[140px_260px_120px_260px_236px] gap-2 px-6 py-3 text-[14px] text-[#999CA0]">
 <p>Date</p>
 <p>Material</p>
 <p>Priority</p>
 <p>Request Details</p>
 <p className="text-right">Action</p>
</div>

{/* Row */}
{urgentRequests.map((items, index) => (
<RequestRow key={index} item={items}
onAssignNow={goToIncomingRequests} />
))}

</div>
</div>
 
 
);
};
export default CollectorDashboard;