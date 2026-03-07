import statusGif from "../../assets/status.gif";


const ThresholdProgress = ({ current, target }) => {
 const percent = Math.min((current / target) * 100, 100);
 const remaining = Math.max(target - current, 0);
 const isMet = current >= target;


 return (
   <div className="min-w-fit">
     {/* Top row */}
     <div className="flex items-center justify-between gap-3">
       <p className="text-[11px] leading-[14px] font-semibold uppercase text-[#98A2B3] whitespace-nowrap">
         Pickup Threshold Progress
       </p>


       <p className="text-[13px] leading-[14px] font-medium text-[#344054] whitespace-nowrap">
         ${current.toFixed(2)} / ${target.toFixed(2)}
       </p>
     </div>


     {/* Progress bar */}
     <div className="mt-1.5 h-2 w-full rounded-full bg-[#E5E7EB]">
       <div
         className={`h-2 rounded-full ${isMet ? "bg-[#3BA115]" : "bg-[#F59E0B]"}`}
         style={{ width: `${percent}%` }}
       />
     </div>


     {/* Bottom message */}
     {isMet ? (
       <div className="mt-1.5 flex items-center gap-1.5 text-[#3BA115]">
         <img
           src={statusGif}
           alt="status"
           className="h-4 w-4 object-contain"
         />
         <span className="text-[12px] leading-[14px] font-medium whitespace-nowrap">
           Minimum threshold met
         </span>
       </div>
     ) : (
       <div className="mt-1.5 flex items-center gap-1.5 text-[#B54708]">
         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
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


         <span className="text-[12px] leading-[14px] font-medium whitespace-nowrap">
           Add ${remaining.toFixed(2)} more to schedule
         </span>
       </div>
     )}
   </div>
 );
};


export default ThresholdProgress;
