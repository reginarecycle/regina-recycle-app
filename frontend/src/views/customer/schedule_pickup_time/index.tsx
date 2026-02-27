import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const SchedulePickupTime = () => {
const navigate = useNavigate();

const DAYS: string[] = ["M", "T", "W", "T", "F", "S", "S"];
 function startDayMondayIndex(date: Date): number {
 return (date.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
}


function daysInMonth(year: number, monthIndex: number): number {
 return new Date(year, monthIndex + 1, 0).getDate();
}


 const year = 2026;
 const monthIndex = 0; // January


 const [selectedDay, setSelectedDay] = useState<number>(1);


const { leadingBlanks, totalDays } = useMemo(() => {
   const first = new Date(year, monthIndex, 1);
   return {
     leadingBlanks: startDayMondayIndex(first),
     totalDays: daysInMonth(year, monthIndex),
   };
 }, [year, monthIndex]);


 const cells = useMemo(() => {
   const arr: Array<{ type: "blank" } | { type: "day"; day: number }> = [];


   for (let i = 0; i < leadingBlanks; i++) {
     arr.push({ type: "blank" });
   }


   for (let d = 1; d <= totalDays; d++) {
     arr.push({ type: "day", day: d });
   }


   return arr;
 }, [leadingBlanks, totalDays]);


    return(
<div className="space-y-6 px-6 py-4"> 

    {/*Step 1*/}
    
    <div className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-5 shadow-sm">
      <div className="flex items-center justify-between">
         <div className="flex items-start gap-4">
             <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F3F4F6] text-sm font-semibold text-[#111827]">
             1
            </div>
         <div>
        <p className="text-[15px] font-semibold text-[#111827]">
          What are we collecting?
        </p>
        <p className="text-[13px] text-[#6B7280]">
          Select the category of material for pickup
        </p>
       </div>
       </div>
       <button className=""
            type="button"
            onClick={()=>{
              navigate("/app/schedule/pickup");
            }}>
        <span className="text-[#111827 · 75%] text-[14px] font-semibold">EDIT SELECTION</span>
      </button>
   </div>
 </div>
 {/*step 1 end*/}
 
 {/* STEP 2 start*/}

  <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm w-full">
    <div className="flex justify-between items-center self-stretch">
      <div className="flex items-center gap-3">
      <div className="flex h-7 w-7 p-[10px] flex-col justify-center items-center gap-[10px] aspect-square rounded-full bg-primary text-white font-medium text-sm">
      2
      </div>
      <h2 className="text-[#000000] font-semibold text-[18px]">
        Select Pickup Time
      </h2>
    </div>
    <div className="flex p-[10px] justify-center items-center h-8 w-[173px] border border-[#CFCFCF] rounded-xl text-[#999CA0]"> 
      STEP 2 of 3
    </div>
    </div>

    <div className="flex mt-6 gap-10 w-full grid-cols-[432px_1fr] items-start">
   {/* Calendar */}
   <div className="w-[432px] flex-shrink-0">
     <div className="flex px-4 py-3 items-center w-full">
       {/* <div className="flex direction-column items-start flex-1"> */}
       <div className="flex p-1 items-center rounded-lg">
         <button className="h-6 w-6">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
         <path d="M15.375 18.75L8.625 12L15.375 5.25" stroke="#999CA0" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
         </svg>
         </button>
       </div>
       <div className="flex justify-center items-start flex-1 ">


       <div className="flex h-8 p-[4px 4px 4px 8px] items-center gap-1 rounded-lg">
         <span className="text-[14px] text-[#0C111D] font-semibold">January</span>
         <button className="h-6 w-6">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
         <path d="M16.5 9.75L12 14.25L7.5 9.75" stroke="#0C111D" stroke-linecap="round" stroke-linejoin="round"/>
         </svg>
         </button>
       </div>


        <div className="flex h-8 p-[4px 4px 4px 8px] items-center gap-1 rounded-lg">
         <span className="text-[14px] text-[#0C111D] font-semibold">{year}</span>
         <button className="h-6 w-6">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
         <path d="M16.5 9.75L12 14.25L7.5 9.75" stroke="#0C111D" stroke-linecap="round" stroke-linejoin="round"/>
         </svg>
         </button>
       </div>
       </div>


       <div className="flex p-1 items-center rounded-lg">
         <button className="h-6 w-6">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
         <path d="M8.625 5.25L15.375 12L8.625 18.75" stroke="#999CA0" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
         </svg>
         </button>
       </div>
       {/* </div> */}


     </div>
     {/* DAYS */}
     <div className="pl-3 pr-4">
     <div className=" mt-1 grid grid-cols-7 gap-x-6 px-4 text-center text-[12px] text-[#6B7280]">
     {DAYS.map((d, i) => (
             <div key={`${d}-${i}`} className="flex p-[12px] flex-column items-start gap-[10px] flex-1 font-[14px] text-[#999CA0)]">
               {d}
             </div>
           ))}
     </div>
         {/* Dates */}


       <div className="mt-2 grid grid-cols-7 gap-y-4 px-4 pb-4 text-center">
          {cells.map((cell, idx) => {
             if (cell.type === "blank") {
               return <div key={`blank-${idx}`} className="h-9 w-12" />;
             }


             const isSelected = cell.day === selectedDay;


             return (
               <button
                 key={`day-${cell.day}`}
                 type="button"
                 onClick={() => {setSelectedDay(cell.day);

                 }}
                 className={`mx-auto flex h-9 w-12 items-center justify-center rounded-lg text-[14px] font-medium ${
                   isSelected
                     ? "bg-[#344E41] text-white"
                     : "text-[##0C111D] hover:bg-[#F3F4F6]"
                 }`}
               >
                 {cell.day}
               </button>
             );
           })}
       </div>


     </div>


    </div>
   </div>

    </div>
     {/* STEP 2 end */}

     {/*setp 3 */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-5 shadow-sm">
  <div className="flex items-center justify-between">
    <div className="flex items-start gap-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F3F4F6] text-sm font-semibold text-[#111827]">
        3
      </div>
      <div>
        <p className="text-[15px] font-semibold text-[#111827]">
          Location Details
        </p>
        <p className="text-[13px] text-[#6B7280]">
          Select a pickup address
        </p>
      </div>
    </div>
       <span className="text-[#6B7280] text-xl">⌄</span>
    </div>
</div>


    {/* ===================== STICKY FOOTER (OUTSIDE everything) ===================== */}
    <div className="sticky bottom-0 z-10 -mx-6 border-t border-[#E5E7EB] bg-white px-6 py-4">
      <div className="flex items-center justify-between gap-6">
        <div className="flex flex-1 items-center gap-8 text-sm">
          <div>
            <p className="text-[11px] font-semibold text-[#98A2B3]">ITEMS</p>
            <p className="mt-1 text-[13px] text-[#98A2B3]">0 Categories</p>
          </div>

          <div className="h-10 w-px bg-[#E5E7EB]" />

          <div>
            <p className="text-[11px] font-semibold text-[#98A2B3]">
              APPOINTMENT
            </p>
            <p className="mt-1 text-[13px] text-[#98A2B3]">Not scheduled</p>
          </div>

          <div className="h-10 w-px bg-[#E5E7EB]" />

          <div>
            <p className="text-[11px] font-semibold text-[#98A2B3]">EST. COST</p>
            <p className="mt-1 text-[16px] font-semibold text-[#98A2B3]">
              $0.00
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled
          className="flex h-10 items-center gap-2 rounded-md bg-[#A3B0A7] px-6 text-sm font-semibold text-white opacity-70"
        >
          Confirm Pickup
          <span className="text-base">🔒</span>
        </button>
      </div>
    </div>

</div>


    )};
export default SchedulePickupTime;

