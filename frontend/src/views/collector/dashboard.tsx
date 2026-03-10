import { Button } from "@/components/ui/button";
import warningIcon from "@/assets/material-symbols_warning-rounded.svg";
import trendingIcon from "@/assets/lucide_trending-up.svg";
import locationPersonIcon from "../../assets/carbon_location-person-filled.svg";
import checkIcon from "../../assets/lucide_check.svg";
import inventoryIcon from "@/assets/material-symbols_inventory-2-rounded.svg";
import graphIcon from "@/assets/mdi_graph-line-shimmer.svg";
import cashIcon from "@/assets/mdi_cash-multiple.svg";
import historyIcon from "@/assets/lucide_history.svg";


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

const RequestRow = ({ item }: { item: UrgentRequestItem }) => {
 return (
   <div className="grid grid-cols-5 items-center border-t px-6 py-4 font-semibold">
     <p>{item.date}</p>
     <div>
       <p className="font-medium text-[#111827]">{item.title}</p>
       <p className="text-[12px] text-[#9CA3AF]">{item.subtitle}</p>
     </div>

     <div className="justify-self-start">
       <PriorityBadge type={item.priority} />
     </div>

     <div className="flex gap-2">
       {item.details.map((detail, index) => (
         <span
           key={index}
           className="flex rounded-full h-[30px] w-[85px] bg-[#618171] px-3 py-1 text-[14px] text-white justify-center items-center gap-[10px] text-[#FBFBFB]"
         >
           {detail}
         </span>
       ))}
     </div>

     <div className="flex justify-end">
       <Button className="border px-3 py-1 text-[12px] h-[30px] gap-[8px] bg-[#FFFFFF] text-[#344E41] w-[100px] border-[#344E41]">
         Assign now
       </Button>
     </div>
   </div>
 );
};

const CollectorDashboard = () => {
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
     <div className="mb-6 flex w-[1208px] justify-between items-center">
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
     <div className="mb-6 flex gap-4 items-start">
       <div className="w-[756px] flex flex-col">
         <div className="h-[439px] w-[708px] rounded-[16px] bg-white">
           {/* Header */}
           <div className="flex w-[708px] h-[82px] items-center justify-between px-[24px] py-[12px] border-b border-[#E5E7EB] rounded-t-[8px]">
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
           <div className="mx-[24px] mt-[24px] h-[352px] w-[708px]">
             <div className="relative mx-auto h-[286px] w-[644px]">
               {[1, 2, 3, 4, 5, 6].map((line) => (
                 <div
                   key={line}
                   className="absolute top-0 h-full border-l border-dashed border-[#E2E2E2]"
                   style={{ left: `${(644 / 7) * line}px` }}
                 />
               ))}
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 width="644"
                 height="231"
                 viewBox="0 0 644 231"
                 fill="none"
                 className="absolute bottom-0 left-0"
               >
                 <path
                   d="M110.845 145.991C77.3604 145.991 25.1644 230.631 -2.41089 230.631H645.608V0C645.608 0 436.824 145.991 391.522 145.991C346.219 145.991 339.326 106.227 303.872 106.227C268.418 106.227 223.115 194.276 180.768 194.276C138.42 194.276 144.329 145.991 110.845 145.991Z"
                   fill="url(#paint0_linear_1176_13306)"
                 />
                 <defs>
                   <linearGradient
                     id="paint0_linear_1176_13306"
                     x1="321.599"
                     y1="0"
                     x2="321.599"
                     y2="230.631"
                     gradientUnits="userSpaceOnUse"
                   >
                     <stop stopColor="#344E41" stopOpacity="0.18" />
                     <stop offset="1" stopColor="#F3F3F4" stopOpacity="0" />
                   </linearGradient>
                 </defs>
               </svg>

               {/* Dashed previous line */}
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 width="563"
                 height="209"
                 viewBox="0 0 563 209"
                 fill="none"
                 className="absolute left-0 top-0"
               >
                 <path
                   d="M0 208.404C4.38672 208.404 8.53726 206.706 12.2185 204.559C16.034 202.334 20.0128 199.227 24.0707 195.621C31.3986 189.107 39.3218 180.653 47.3305 172.107C48.1967 171.183 49.0638 170.258 49.9313 169.334C58.8755 159.807 67.8658 150.405 76.3891 143.387C80.6529 139.877 84.6972 137.05 88.4525 135.119C92.2756 133.153 95.3627 132.341 97.7638 132.341C103.245 132.341 107.444 134.326 111.35 138.147C114.839 141.561 117.651 146.009 120.688 150.815C121.087 151.446 121.489 152.083 121.898 152.724C125.333 158.12 129.175 163.809 134.62 168.141C140.175 172.56 147.621 175.733 158.122 175.733C163.735 175.733 169.067 174.217 174.018 171.902C178.98 169.582 183.833 166.333 188.563 162.554C198.016 155.002 207.399 144.982 216.464 135.114C217.267 134.241 218.067 133.368 218.864 132.499C227.137 123.476 235.132 114.758 242.81 108.09C247.017 104.435 251.017 101.498 254.788 99.4938C258.609 97.4621 261.783 96.6069 264.387 96.6069C270.782 96.6069 276.072 98.4428 281.194 101.578C285.768 104.378 289.893 108.012 294.351 111.939C294.969 112.483 295.593 113.033 296.225 113.587C306.289 122.4 318.485 132.341 340.048 132.341C343.207 132.341 346.726 131.693 350.38 130.68C354.086 129.653 358.202 128.175 362.629 126.343C371.486 122.679 381.865 117.483 393.111 111.307C415.619 98.9455 441.893 82.4934 466.888 66.0792C491.894 49.6572 515.671 33.2393 533.193 20.9294C541.955 14.7737 549.155 9.64363 554.165 6.05183C556.671 4.25591 558.629 2.84447 559.961 1.88159C560.627 1.40015 561.137 1.03085 561.48 0.781689L561.994 0.408952L562 0.404297"
                   stroke="#999CA0"
                   strokeDasharray="6 6"
                 />
               </svg>

               {/* Green line */}
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 width="644"
                 height="233"
                 viewBox="0 0 644 233"
                 fill="none"
                 className="absolute bottom-0 left-0"
               >
                 <path
                   fillRule="evenodd"
                   clipRule="evenodd"
                   d="M402.371 146.622C398.148 147.747 394.083 148.468 390.434 148.468C365.523 148.468 351.433 137.42 339.807 127.626C339.077 127.011 338.356 126.4 337.642 125.795C332.491 121.43 327.726 117.393 322.442 114.281C316.525 110.797 310.413 108.756 303.026 108.756C300.018 108.756 296.351 109.707 291.936 111.965C287.58 114.192 282.959 117.456 278.099 121.517C269.228 128.928 259.993 138.616 250.435 148.642C249.514 149.609 248.589 150.578 247.662 151.549C237.19 162.515 226.35 173.65 215.429 182.043C209.965 186.242 204.358 189.853 198.625 192.431C192.907 195.003 186.746 196.688 180.262 196.688C168.13 196.688 159.528 193.162 153.111 188.252C146.82 183.438 142.382 177.115 138.413 171.119C137.941 170.406 137.476 169.698 137.016 168.997C133.507 163.657 130.259 158.714 126.228 154.92C121.716 150.673 116.864 148.468 110.532 148.468C107.758 148.468 104.192 149.369 99.7751 151.554C95.4368 153.7 90.7645 156.842 85.8387 160.743C75.9921 168.542 65.606 178.99 55.2731 189.577C54.2709 190.604 53.2691 191.632 52.2684 192.659C43.0163 202.156 33.8629 211.551 25.3972 218.789C20.7093 222.798 16.1128 226.25 11.7048 228.722C7.45201 231.108 2.65705 232.996 -2.41077 232.996V228.457C-0.603791 228.457 2.24331 227.704 6.23107 225.467C10.0636 223.317 14.3062 220.165 18.8869 216.249C27.1605 209.175 36.1479 199.951 45.4441 190.41C46.4357 189.392 47.4307 188.371 48.4289 187.348C58.7203 176.803 69.3269 166.119 79.4907 158.069C84.5703 154.046 89.6577 150.584 94.6648 148.107C99.5935 145.669 104.958 143.929 110.532 143.929C120.896 143.929 127.83 147.751 132.924 152.546C137.374 156.734 140.908 162.121 144.364 167.388C144.827 168.095 145.289 168.799 145.752 169.498C149.763 175.558 153.857 181.29 159.382 185.517C164.781 189.649 171.279 192.15 180.262 192.15C184.336 192.15 188.825 191.087 193.798 188.85C198.758 186.62 203.885 183.361 209.148 179.316C219.68 171.222 230.262 160.374 240.782 149.357C241.719 148.377 242.654 147.395 243.589 146.414C253.089 136.447 262.524 126.549 271.636 118.936C276.642 114.753 281.681 111.147 286.728 108.567C291.716 106.015 297.196 104.218 303.026 104.218C313.317 104.218 321.324 107.142 328.051 111.103C333.865 114.526 339.062 118.935 344.152 123.252C344.865 123.858 345.577 124.461 346.287 125.06C358.232 135.122 370.168 143.929 390.434 143.929C392.432 143.929 395.288 143.511 399.079 142.501C402.811 141.506 407.162 140.016 412.064 138.065C421.866 134.164 433.554 128.548 446.434 121.743C472.177 108.143 502.345 89.977 531.169 71.7687C559.979 53.5691 587.386 35.3649 607.595 21.7079C617.698 14.8802 625.999 9.19081 631.773 5.20907C634.66 3.21824 636.916 1.6544 638.448 0.588733C639.215 0.0559034 639.801 -0.352376 640.195 -0.627207L640.78 -1.03616L640.787 -1.04096C640.788 -1.04198 640.789 -1.04245 643.819 0.40154C646.85 1.84553 646.849 1.84617 646.847 1.84738L646.84 1.85255L646.247 2.26677C645.85 2.54366 645.261 2.95406 644.492 3.48908C642.953 4.55911 640.69 6.12763 637.796 8.12343C632.008 12.115 623.69 17.816 613.567 24.6567C593.325 38.3366 565.857 56.5817 536.967 74.8313C508.092 93.0722 477.738 111.355 451.736 125.092C438.743 131.956 426.753 137.73 416.522 141.802C411.407 143.838 406.652 145.48 402.371 146.622Z"
                   fill="#344E41"
                 />
               </svg>


            {/* dot */}
          <svg
         viewBox="0 0 11 11"
      className="absolute w-[11px] h-[11px] left-[276px] bottom-[127px]"
       >
       <circle cx="5.5" cy="5.5" r="4.5" fill="#618171" stroke="white" strokeWidth="2" />
       </svg>
       {/*dot */ }
       <svg
       viewBox="0 0 11 11"
       className="absolute w-[9px] h-[9px] left-[89px] bottom-[87px]"
       >
      <circle
      cx="5.5"
      cy="5.5"
      r="4.5"
      fill="#618171"
      stroke="white"
      strokeWidth="2"
       />
     </svg>
        </div>
           <div className="mx-auto mt-[2px] h-[1px] w-[644px] bg-[#E2E2E2]" />

           <div className="mx-auto mt-[19px] flex w-[674px] items-center justify-between text-[14px] leading-none text-[#111827]">
             <span>Mon</span>
             <span>Tue</span>
             <span>Wed</span>
             <span>Thur</span>
             <span>Fri</span>
             <span>Sat</span>
             <span>Sun</span>
           </div>
           </div>
         
         {/* active pickup */}
         {/* active pickup */}
<div className="mt-6 h-[152px] w-[708px] rounded-[16px] border border-[#E5E7EB] bg-white">
 {/* header */}
 <div className="flex h-[58px] items-center justify-between border-b border-[#E5E7EB] px-[24px] py-[12px]">
   <div>
     <h3 className="text-[16px] font-semibold text-[#000000]">Active Pickups</h3>
     <p className="text-[12px] text-[#999CA0]">Pickups you need to complete</p>
   </div>

   <Button
     type="button"
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
   </Button>
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

     <p className="text-[12px] text-[#10131D)]">
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

 <Button className="flex h-[40px] w-[176px] items-center justify-center gap-[8px] rounded-[8px] bg-[#163A24] px-[16px] py-[8px] text-[14px] font-semibold text-white hover:bg-[#163A24]">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-[16px] w-[16px] shrink-0"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M12 2.5C13.3168 2.5 14.5493 2.74984 15.7021 3.24707C16.8645 3.74844 17.8697 4.42571 18.7217 5.27832C19.5739 6.13117 20.2512 7.13681 20.7539 8.29883C21.2521 9.45047 21.5019 10.6821 21.5 11.999C21.4981 13.3169 21.2483 14.5498 20.7529 15.7021C20.2537 16.8634 19.5761 17.8681 18.7217 18.7207C17.8666 19.5739 16.8612 20.2518 15.7012 20.7539C14.5516 21.2514 13.3193 21.5013 12 21.5C10.6818 21.5 9.44919 21.2501 8.29785 20.7529C7.13685 20.2516 6.13174 19.5744 5.27832 18.7217C4.42499 17.869 3.74774 16.8638 3.24707 15.7021C2.7505 14.55 2.50067 13.3176 2.5 12C2.49936 10.6827 2.74931 9.44982 3.24707 8.29785C3.74911 7.1361 4.42629 6.13101 5.27832 5.27832C6.1303 4.42571 7.13546 3.74844 8.29785 3.24707C9.4507 2.74984 10.6832 2.5 12 2.5ZM16.25 8.0752C15.8476 8.0752 15.4825 8.2099 15.1963 8.49609L10.5996 13.0928L8.80371 11.2969C8.51745 11.0106 8.1524 10.875 7.75 10.875C7.3476 10.875 6.98255 11.0106 6.69629 11.2969C6.41032 11.583 6.27548 11.9475 6.27539 12.3496C6.27539 12.7519 6.41016 13.1171 6.69629 13.4033L9.54688 16.2539C9.83417 16.541 10.192 16.7001 10.5996 16.7002C11.0074 16.7002 11.3659 16.5412 11.6533 16.2539L17.3037 10.6035C17.5899 10.3173 17.7246 9.95215 17.7246 9.5498C17.7246 9.14749 17.5899 8.78231 17.3037 8.49609C17.0175 8.2099 16.6524 8.0752 16.25 8.0752Z"
      fill="white"
    />
  </svg>


  Complete Pickup
</Button>
</div>
</div>


       </div>
       </div>
       {/* right side */}
       {/* RIGHT CARD — Material Distribution */}
       <div className="w-[476px] h-[715px] rounded-[16px] border border-[#E5E7EB] bg-white">
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

   <button className="flex items-center gap-1 text-[14px] text-[#344E41]">
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
 <div className="grid grid-cols-5 px-6 py-3 text-[14px] text-[#999CA0]">
   <p>Date</p>
   <p>Material</p>
   <p>Priority</p>
   <p>Request Details</p>
   <p className="text-right">Action</p>
 </div>

 {/* Row */}
{urgentRequests.map((items, index) => (
 <RequestRow key={index} item={items} />
))}

</div>
   </div>
   
 );
};

export default CollectorDashboard;






