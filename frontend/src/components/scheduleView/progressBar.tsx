import { CheckCircle2Icon, TriangleAlertIcon } from "lucide-react";
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
      <CheckCircle2Icon className="text-green-500"/>
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
     <img src={statusGif} alt="status" className="h-6 w-6 object-contain shrink-0" />
     <span className="text-[12px] leading-3.5 font-medium truncate">
       Minimum threshold met
     </span>
   </div>
 ) : (
   <div className="mt-1.5 flex items-center gap-1.5 text-[#B54708]">
     <TriangleAlertIcon />
     <span className="text-[12px] leading-3.5 font-medium truncate">
       Add ${formatAmount(remaining)} more to schedule
     </span>
   </div>
 )}
</div>
 );
};


export default ThresholdProgress;