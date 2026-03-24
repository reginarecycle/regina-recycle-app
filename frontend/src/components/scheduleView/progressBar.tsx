import statusGif from "../../assets/status.gif";
import { formatAmount } from "@/lib/utils";

type ThresholdProgressProps = {
 current: number;
 target: number;
};

const ThresholdProgress = ({ current, target }: ThresholdProgressProps) => {
 const percent = Math.min((current / target) * 100, 100);
 const remaining = Math.max(target - current, 0);
 const isMet = current >= target;


 return (
   <div className="min-w-0 w-full">
 <div className="flex items-center justify-between gap-3">
   <p className="text-[11px] leading-[14px] font-semibold uppercase text-[#98A2B3] whitespace-nowrap">
     Pickup Threshold Progress
   </p>


   <div className="min-w-[90px] flex justify-end">
     {isMet ? (
       <svg
         xmlns="http://www.w3.org/2000/svg"
         width="18"
         height="18"
         viewBox="0 0 18 18"
         fill="none"
         className="shrink-0"
       >
         <path
           d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
           stroke="#3BA115"
           strokeWidth="2"
           strokeLinecap="round"
           strokeLinejoin="round"
         />
         <path
           d="M6.59961 9.00039L8.19961 10.6004L11.3996 7.40039"
           stroke="#3BA115"
           strokeWidth="2"
           strokeLinecap="round"
           strokeLinejoin="round"
         />
       </svg>
     ) : (
       <p className="text-[13px] leading-[14px] font-medium text-[#344054] whitespace-nowrap">
         ${formatAmount(current)} / ${formatAmount(target)}
       </p>
     )}
   </div>
 </div>


 <div className="mt-1.5 h-2 w-full rounded-full bg-[#E5E7EB]">
   <div
     className={`h-2 rounded-full ${isMet ? "bg-[#3BA115]" : "bg-[#F59E0B]"}`}
     style={{ width: `${percent}%` }}
   />
 </div>


 {isMet ? (
   <div className="mt-1.5 flex items-center gap-1.5 text-[#3BA115]">
     <img src={statusGif} alt="status" className="h-4 w-4 object-contain shrink-0" />
     <span className="text-[12px] leading-[14px] font-medium truncate">
       Minimum threshold met
     </span>
   </div>
 ) : (
   <div className="mt-1.5 flex items-center gap-1.5 text-[#B54708]">
     <svg
       width="14"
       height="14"
       viewBox="0 0 24 24"
       fill="none"
       className="shrink-0"
     >
       <path
         d="M12 8V12M12 16H12.01"
         stroke="#B54708"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
       />
       <path
         d="M10.29 3.86L1.82 18A2 2 0 003.53 21H20.47A2 2 0 0022.18 18L13.71 3.86A2 2 0 0010.29 3.86Z"
         stroke="#B54708"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
       />
     </svg>


     <span className="text-[12px] leading-[14px] font-medium truncate">
       Add ${formatAmount(remaining)} more to schedule
     </span>
   </div>
 )}
</div>
 );
};


export default ThresholdProgress;
