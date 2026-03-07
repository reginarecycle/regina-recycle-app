import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThresholdProgress from "@/components/scheduleView/progressBar";
import { useSchedule } from "@/components/scheduleView/ScheduleContext";

type Slot = { id: string; label: string };

type SlotsByDate = Record<string, Slot[]>;
const slotsByDate: SlotsByDate = {
 "2026-03-05": [
   { id: "1a", label: "10:00 AM - 12:00 PM" },
   { id: "1b", label: "12:00 PM - 2:00 PM" },
   { id: "1c", label: "3:00 PM - 5:00 PM" },
 ],
 "2026-03-06": [
   { id: "2a", label: "9:00 AM - 11:00 AM" },
   { id: "2b", label: "1:00 PM - 3:00 PM" },
 ],
 "2026-03-20": [
   { id: "1a", label: "10:00 AM - 12:00 PM" },
   { id: "1b", label: "12:00 PM - 2:00 PM" },
   { id: "1c", label: "3:00 PM - 5:00 PM" },
 ],
 "2026-03-11": [
   { id: "2a", label: "9:00 AM - 11:00 AM" },
   { id: "2b", label: "1:00 PM - 3:00 PM" },
 ],
 "2026-03-10": [
   { id: "1a", label: "10:00 AM - 12:00 PM" },
   { id: "1b", label: "12:00 PM - 2:00 PM" },
   { id: "1c", label: "3:00 PM - 5:00 PM" },
 ],
 "2026-03-13": [
   { id: "2a", label: "9:00 AM - 11:00 AM" },
   { id: "2b", label: "1:00 PM - 3:00 PM" },
 ],
};




const SchedulePickupTime = () => {
  //data store
const { scheduleData, updateScheduleData} = useSchedule();

const navigate = useNavigate();

const DAYS: string[] = ["M", "T", "W", "T", "F", "S", "S"];
 function startDayMondayIndex(date: Date): number {
 return (date.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
}


function daysInMonth(year: number, monthIndex: number): number {
 return new Date(year, monthIndex + 1, 0).getDate();
}
const MONTHS = [
 "January","February","March","April","May","June",
 "July","August","September","October","November","December"
]


const [isMonthOpen, setIsMonthOpen] = useState(false);
const [isYearOpen, setIsYearOpen] = useState(false);

const today = useMemo(() => {
 const t = new Date();
 t.setHours(0, 0, 0, 0);
 return t;
}, []);

const restoredPickupDate = useMemo(() => {
 if (!scheduleData.pickupDate) return null;


 const [year, month, day] = scheduleData.pickupDate.split("-").map(Number);
 const date = new Date(year, month - 1, day);
 date.setHours(0, 0, 0, 0);
 return date;
}, [scheduleData.pickupDate]);


const [viewYear, setViewYear] = useState<number>(
 restoredPickupDate ? restoredPickupDate.getFullYear() : 2026
);

const [viewMonthIndex, setViewMonthIndex] = useState<number>(
 restoredPickupDate ? restoredPickupDate.getMonth() : 2
);


const [selectedDate, setSelectedDate] = useState<Date | null>(restoredPickupDate);


const [hasClickedDate, setHasClickedDate] = useState<boolean>(!!restoredPickupDate);


const [selectedSlotId, setSelectedSlotId] = useState<string | null>(
 scheduleData.slotId ?? null
);




const { leadingBlanks, totalDays } = useMemo(() => {
 const first = new Date(viewYear, viewMonthIndex, 1);
 return {
   leadingBlanks: startDayMondayIndex(first),
   totalDays: daysInMonth(viewYear, viewMonthIndex),
 };
}, [viewYear, viewMonthIndex]);



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


 //month navigation
function goPrevMonth() {
 setSelectedDate(null);
 setHasClickedDate(false);
 setSelectedSlotId(null);


 setViewMonthIndex((m) => {
   if (m === 0) {
     setViewYear((y) => y - 1);
     return 11;
   }
   return m - 1;
 });
}


function goNextMonth() {
 setSelectedDate(null);
 setHasClickedDate(false);
 setSelectedSlotId(null);


 setViewMonthIndex((m) => {
   if (m === 11) {
     setViewYear((y) => y + 1);
     return 0;
   }
   return m + 1;
 });
}


const selectedKey = useMemo(() => {
 if (!selectedDate) return null;
 const y = selectedDate.getFullYear();
 const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
 const d = String(selectedDate.getDate()).padStart(2, "0");
 return `${y}-${m}-${d}`;
}, [selectedDate]);


const slotsForSelectedDay = useMemo<Slot[]>(() => {
 if (!selectedKey) return [];
 return slotsByDate[selectedKey] ?? [];
}, [selectedKey]);




const monthRef = useRef<HTMLDivElement | null>(null);
const yearRef = useRef<HTMLDivElement | null>(null);


useEffect(() => {
 function onDocClick(e: MouseEvent) {
   const t = e.target as Node;
   if (monthRef.current && !monthRef.current.contains(t)) setIsMonthOpen(false);
   if (yearRef.current && !yearRef.current.contains(t)) setIsYearOpen(false);
 }
 document.addEventListener("mousedown", onDocClick);
 return () => document.removeEventListener("mousedown", onDocClick);
}, []);




const years = useMemo(() => {
 const start = new Date().getFullYear();
 return Array.from({ length: 15 }, (_, i) => start + i);
}, []);


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
              navigate("/app/schedule");
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
         <button className="h-6 w-6" type="button" onClick={goPrevMonth}>

         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
         <path d="M15.375 18.75L8.625 12L15.375 5.25" stroke="#999CA0" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
         </svg>
         </button>
       </div>
       <div className="flex justify-center items-start flex-1 ">


       <div ref={monthRef} className="relative flex items-center gap-1">
    <span className="text-[14px] text-[#0C111D] font-semibold">
   {MONTHS[viewMonthIndex]}
    </span>


 <button
   type="button"
   className="h-6 w-6"
   onClick={() => {
     setIsMonthOpen((v) => !v);
     setIsYearOpen(false);
   }}
   aria-label="Choose month"
 >
   {/* your chevron svg */}
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
     <path d="M16.5 9.75L12 14.25L7.5 9.75" stroke="#0C111D" strokeLinecap="round" strokeLinejoin="round"/>
   </svg>
 </button>


 {isMonthOpen && (
   <div className="absolute top-9 left-0 z-20 w-48 rounded-xl border border-[#E5E7EB] bg-white shadow-lg">
     <div className="max-h-64 overflow-auto p-2">
       {MONTHS.map((m, idx) => (
         <button
           key={m}
           type="button"
           onClick={() => {
             setViewMonthIndex(idx);
             setIsMonthOpen(false);


             // reset selection when changing month (optional)
             setSelectedDate(null);
             setHasClickedDate(false);
             setSelectedSlotId(null);
           }}
           className={`w-full rounded-lg px-3 py-2 text-left text-[14px] hover:bg-[#F3F4F6]
             ${idx === viewMonthIndex ? "bg-[#F3F4F6] font-semibold" : ""}
           `}
         >
           {m}
         </button>
       ))}
     </div>
   </div>
 )}
</div>


        <div ref={yearRef} className="relative flex items-center gap-1">
 <span className="text-[14px] text-[#0C111D] font-semibold">
   {viewYear}
 </span>


 <button
   type="button"
   className="h-6 w-6"
   onClick={() => {
     setIsYearOpen((v) => !v);
     setIsMonthOpen(false);
   }}
   aria-label="Choose year"
 >
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
     <path d="M16.5 9.75L12 14.25L7.5 9.75" stroke="#0C111D" strokeLinecap="round" strokeLinejoin="round"/>
   </svg>
 </button>


 {isYearOpen && (
   <div className="absolute top-9 left-0 z-20 w-28 rounded-xl border border-[#E5E7EB] bg-white shadow-lg">
     <div className="max-h-64 overflow-auto p-2">
       {years.map((y) => (
         <button
           key={y}
           type="button"
           onClick={() => {
             setViewYear(y);
             setIsYearOpen(false);


             setSelectedDate(null);
             setHasClickedDate(false);
             setSelectedSlotId(null);
           }}
           className={`w-full rounded-lg px-3 py-2 text-left text-[14px] hover:bg-[#F3F4F6]
             ${y === viewYear ? "bg-[#F3F4F6] font-semibold" : ""}
           `}
         >
           {y}
         </button>
       ))}
     </div>
   </div>
 )}
</div>

       </div>


       <div className="flex p-1 items-center rounded-lg">
         <button className="h-6 w-6" type="button" onClick={goNextMonth}>
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


             const dateObj = new Date(viewYear, viewMonthIndex, cell.day);
       dateObj.setHours(0, 0, 0, 0);


       const isPast = dateObj < today;


        const isSelected =
         selectedDate?.getFullYear() === viewYear &&
         selectedDate?.getMonth() === viewMonthIndex &&
         selectedDate?.getDate() === cell.day;

             return (
               <button
                   key={`day-${cell.day}`}
                   type="button"
                   disabled={isPast}
                   onClick={() => {
                         if (isPast) return;


                         const y = dateObj.getFullYear();
                         const m = String(dateObj.getMonth() + 1).padStart(2, "0");
                         const d = String(dateObj.getDate()).padStart(2, "0");
                         const pickupDate = `${y}-${m}-${d}`;


                         setSelectedDate(dateObj);
                         setHasClickedDate(true);
                         setSelectedSlotId(null);


                         updateScheduleData({
                           pickupDate,
                           slotId: null,
                           slotLabel: null,
                         });
                       }}

                   className={`mx-auto flex h-9 w-12 items-center justify-center rounded-lg text-[14px] font-medium
                     ${
                       isPast
                         ? "text-[#C0C4CC] cursor-not-allowed"
                         : isSelected
                           ? "bg-[#344E41] text-white"
                           : "text-[#0C111D] hover:bg-[#F3F4F6]"
                     }
                   `}
                 >

                 {cell.day}
               </button>
             );
           })}
       </div>


     </div>


    </div>
    {/* right side */}
    <div className="min-w-0 flex flex-col w-full">


   {!hasClickedDate ? (
             <div className="mt-10 text-[14px] text-[#6B7280]">
               Select a date to see available slots.
             </div>
           ) : slotsForSelectedDay.length === 0 ? (
             <div className="mt-10 text-[14px] text-[#6B7280]">
               No slots available for this date.
             </div>
           ) : (
             <>
               <p className="mb-4 text-[12px] font-semibold tracking-wide text-[#000]">
                 AVAILABLE SLOTS
               </p>


               <div className="flex flex-col gap-4 justify-center">
                 {slotsForSelectedDay.map((slot) => {
                   const selected = slot.id === selectedSlotId;


                   return (
                    <button
                       key={slot.id}
                       type="button"
                       onClick={() => {
                               setSelectedSlotId(slot.id);
                               updateScheduleData({
                                 slotId: slot.id,
                                 slotLabel: slot.label,
                               });
                             }}
                       className={`w-full h-[56px] flex items-center justify-between gap-3 rounded-xl px-6 transition-all ${
                         selected
                           ? "bg-[#344E41] text-white"
                           : "border border-[#E5E7EB] text-[#111827] hover:bg-[#F9FAFB]"
                       }`}
                     >

                       {/* left */}
                       <div className="flex items-center gap-3">
                       <span className="text-[16px]">
                         {selected ? (
                         // WHITE CLOCK (for selected slot)
                         <svg
                           xmlns="http://www.w3.org/2000/svg"
                           width="20"
                           height="20"
                           viewBox="0 0 24 24"
                           fill="none"
                         >
                           <path
                             d="M12 6V12L16 14"
                             stroke="white"
                             strokeWidth="2"
                             strokeLinecap="round"
                             strokeLinejoin="round"
                           />
                           <path
                             d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                             stroke="white"
                             strokeWidth="2"
                             strokeLinecap="round"
                             strokeLinejoin="round"
                           />
                         </svg>
                       ) : (
                         // BLACK CLOCK (for unselected slot)
                         <svg
                           xmlns="http://www.w3.org/2000/svg"
                           width="20"
                           height="20"
                           viewBox="0 0 24 24"
                           fill="none"
                         >
                           <path
                             d="M12 6V12L16 14"
                             stroke="#111827"
                             strokeWidth="2"
                             strokeLinecap="round"
                             strokeLinejoin="round"
                           />
                           <path
                             d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                             stroke="#111827"
                             strokeWidth="2"
                             strokeLinecap="round"
                             strokeLinejoin="round"
                           />
                         </svg>
                       )}
                       </span>
                       <span className="text-[14px] font-medium">
                         {slot.label}
                       </span>
                       </div>
                       <span className="flex h-6 w-6 py-[3px] px-[4px] items-center gap-[10px] border border-[#FFFFFF] rounded-full bg-[#FFFFFF]">
                         {
                           selected &&
                           (
                             <svg xmlns="http://www.w3.org/2000/svg"
                                  width="16" height="16"
                                  viewBox="0 0 16 16"
                                  fill="none">
                             <path d="M13.3327 4L5.99935 11.3333L2.66602 8"
                                   stroke="#344E41"
                                   stroke-width="2"
                                   stroke-linecap="round"
                                   stroke-linejoin="round"/>
                             </svg>
                 )}
                       </span>
                     </button>
                   );
                 })}
               </div>
             </>
           )}
         </div>

   </div>
   {/* brakline */}
    <div className="mt-8 border-t border-[#CFCFCF]"></div>

    <div className="mt-6 flex items-center justify-end gap-4">
           <button className="h-[44px] rounded-xl border border-[#344E41] bg-[#FFF] px-5 text-[14px] font-medium text-[#344E41] hover:bg-[#F9FAFB] flex items-center gap-2"
                   onClick={()=>{
                       navigate("/app/schedule");
                   }}
           >
              <span>
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
               <path d="M12 19L5 12M5 12L12 5M5 12H19" stroke="#344E41" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
               </svg></span>
             <span className="text-[16px]">
             Previous Step
             </span>
           </button>


           <Button type = "button"
                   disabled = {!selectedSlotId}
                   onClick={()=>{
                     if(selectedSlotId){
                       navigate("/app/schedule/pickupLoc");
                     }
                   }}
                   className="h-[44px] rounded-xl bg-[#344E41] px-6 text-[14px] font-medium text-[#FFF] flex items-center gap-2"
                   >
             <span className="text-[16px]">
             Next Step
             </span>
             <span>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
               <path d="M3.33398 7.99967H12.6673M12.6673 7.99967L8.00065 3.33301M12.6673 7.99967L8.00065 12.6663" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
               </svg>
               </span>
           </Button>
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
    <div className="fixed bottom-0 right-0 left-[260px] z-40 border-t border-[#E5E7EB] bg-white px-6 py-4 h-[85px]">
 <div className="flex h-full w-full items-center justify-between gap-6 overflow-hidden">
   <div className="min-w-0 flex flex-1 items-center gap-6 overflow-hidden">
     <div className="shrink-0">
       <p className="text-[11px] font-semibold uppercase text-[#98A2B3]">Items</p>
       <div className="mt-1 flex items-center gap-2">
         {/* icon */}
         <p className="text-[16px] font-semibold text-[#0C111D]">
           50 units (3 Categories)
         </p>
       </div>
     </div>


     <div className="h-10 w-px shrink-0 bg-[#E5E7EB]" />


     <div className="shrink-0">
       <p className="text-[11px] font-semibold uppercase text-[#98A2B3]">Appointment</p>
       <div className="mt-1 flex items-center gap-2">
         {/* icon */}
         <p className="text-[14px] font-semibold text-[#0C111D]">
           {scheduleData.pickupDate && scheduleData.slotLabel
             ? `${scheduleData.pickupDate}, ${scheduleData.slotLabel}`
             : "Not scheduled"}
         </p>
       </div>
     </div>


     <div className="h-10 w-px shrink-0 bg-[#E5E7EB]" />


     <div className="shrink-0">
       <p className="text-[11px] font-semibold uppercase text-[#98A2B3]">Est. Cost</p>
       <div className="mt-1 flex items-center gap-2">
         {/* icon */}
         <p className="text-[14px] font-semibold text-[#618171]">$24.50</p>
       </div>
     </div>


     <div className="h-10 w-px shrink-0 bg-[#E5E7EB]" />


     <div className="min-w-0 flex-1 self-start">
       <ThresholdProgress current={24.00} target={5.00} />
     </div>
   </div>


   <button
     type="button"
     disabled
     className="shrink-0 flex h-12 min-w-[180px] items-center justify-center gap-2 rounded-xl px-6 text-[15px] font-semibold bg-[#344E41] text-white cursor-not-allowed opacity-70"
   >
     Confirm Pickup
   </button>
 </div>
</div>


</div>

)};
export default SchedulePickupTime;

