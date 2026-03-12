import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
const location = useLocation(); 
const itemPicked = location.state?.itemPicked || {};
const BacktoPickup = () => {
  navigate("/app/schedule", {
    state: { itemPicked }
  });
};

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
<div className="space-y-6 flex-1 mb-[80px]">

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
            onClick={BacktoPickup}>
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
           <Button 
           size="lg"
           className=" w-[158px] border border-[#344E41] bg-[#FFF] text-[14px] font-medium text-[#344E41] hover:bg-[#F9FAFB] flex items-center gap-2 "
            onClick={BacktoPickup}
           >
              <span>
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
               <path d="M12 19L5 12M5 12L12 5M5 12H19" stroke="#344E41" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
               </svg></span>
             <span className="text-[16px]">
             Previous Step
             </span>
           </Button>


           <Button type = "button"
                   size="lg"
                   disabled = {!selectedSlotId}
                   onClick={()=>{
                     if(selectedSlotId){
                       navigate("/app/schedule/pickupLoc");
                     }
                   }}
                   className="w-[158px] bg-[#344E41] text-[14px] font-medium text-[#FFF] flex items-center gap-2"
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
</div>


    {/* ===================== STICKY FOOTER (OUTSIDE everything) ===================== */}
    <div className="fixed bottom-0 right-0 left-[260px] z-40 min-h-[90px] border-t border-[#E5E7EB] bg-white px-6 py-4">
       <div className="flex h-full w-full items-start justify-between gap-6 overflow-hidden">
         {/* left summary */}
         <div className="min-w-0 flex flex-1 items-start gap-6 overflow-hidden">
           <div className="shrink-0">
             <p className="text-[11px] font-semibold uppercase text-[#98A2B3]">
               Items
             </p>


             <div className="mt-1 flex items-center gap-2">
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 width="24"
                 height="24"
                 viewBox="0 0 24 24"
                 fill="none"
               >
                 <path
                   d="M4.02413 14.8504C3.75746 14.6504 3.62846 14.3881 3.63713 14.0634C3.64579 13.7387 3.78313 13.4761 4.04913 13.2754C4.23246 13.1421 4.43246 13.0754 4.64913 13.0754C4.86579 13.0754 5.06579 13.1421 5.24913 13.2754L11.9991 18.5004L18.7491 13.2754C18.9325 13.1421 19.1325 13.0754 19.3491 13.0754C19.5658 13.0754 19.7658 13.1421 19.9491 13.2754C20.2158 13.4754 20.3535 13.7377 20.3621 14.0624C20.3708 14.3871 20.2415 14.6497 19.9741 14.8504L13.2241 20.1004C12.8575 20.3837 12.4491 20.5254 11.9991 20.5254C11.5491 20.5254 11.1408 20.3837 10.7741 20.1004L4.02413 14.8504ZM10.7741 15.0504L5.02413 10.5754C4.50746 10.1754 4.24913 9.65039 4.24913 9.00039C4.24913 8.35039 4.50746 7.82539 5.02413 7.42539L10.7741 2.95039C11.1408 2.66706 11.5491 2.52539 11.9991 2.52539C12.4491 2.52539 12.8575 2.66706 13.2241 2.95039L18.9741 7.42539C19.4908 7.82539 19.7491 8.35039 19.7491 9.00039C19.7491 9.65039 19.4908 10.1754 18.9741 10.5754L13.2241 15.0504C12.8575 15.3337 12.4491 15.4754 11.9991 15.4754C11.5491 15.4754 11.1408 15.3337 10.7741 15.0504Z"
                   fill="#618171"
                 />
               </svg>


               <p className="text-[16px] font-semibold text-[#0C111D]">
 {scheduleData.categories.length > 0
   ? `${scheduleData.totalSelected} units (${scheduleData.categories.length} Categories)`
   : "0 Categories"}
</p>
             </div>
           </div>


           <div className="h-10 w-px shrink-0 bg-[#E5E7EB]" />


           <div className="shrink-0">
             <p className="text-[11px] font-semibold uppercase text-[#98A2B3]">
               Appointment
             </p>


             <div className="mt-1 flex items-center gap-2">
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 width="24"
                 height="24"
                 viewBox="0 0 24 24"
                 fill="none"
               >
                 <path d="M8 2V6V2ZM16 2V6V2Z" fill="#0C111D" />
                 <path
                   d="M8 2V6M16 2V6"
                   stroke="#344E41"
                   strokeWidth="2"
                   strokeLinecap="round"
                   strokeLinejoin="round"
                 />
                 <path
                   d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
                   stroke="#344E41"
                   strokeWidth="2"
                   strokeLinecap="round"
                   strokeLinejoin="round"
                 />
                 <path
                   d="M3 10H21M8 14H8.01M12 14H12.01M16 14H16.01M8 18H8.01M12 18H12.01M16 18H16.01"
                   stroke="#344E41"
                   strokeWidth="2"
                   strokeLinecap="round"
                   strokeLinejoin="round"
                 />
               </svg>


               <p className="text-[14px] font-semibold text-[#0C111D]">
                 {scheduleData.pickupDate && scheduleData.slotLabel
                   ? `${scheduleData.pickupDate}, ${scheduleData.slotLabel}`
                   : "Not scheduled"}
               </p>
             </div>
           </div>


           <div className="h-10 w-px shrink-0 bg-[#E5E7EB]" />


           <div className="shrink-0">
             <p className="text-[11px] font-semibold uppercase text-[#98A2B3]">
               Est. Cost
             </p>


             <div className="mt-1 flex items-center gap-2">
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 width="24"
                 height="24"
                 viewBox="0 0 24 24"
                 fill="none"
               >
                 <path
                   d="M15.0005 4C16.5827 4 18.1294 4.46919 19.445 5.34824C20.7606 6.22729 21.786 7.47672 22.3915 8.93853C22.997 10.4003 23.1554 12.0089 22.8468 13.5607C22.5381 15.1126 21.7761 16.538 20.6573 17.6569C19.5385 18.7757 18.113 19.5376 16.5612 19.8463C15.0093 20.155 13.4008 19.9965 11.939 19.391C10.4772 18.7855 9.22776 17.7602 8.34871 16.4446C7.46966 15.129 7.00047 13.5823 7.00047 12C7.00047 9.87827 7.84332 7.84344 9.34361 6.34315C10.8439 4.84285 12.8787 4 15.0005 4ZM3.00047 12C3.00189 13.2396 3.38721 14.4483 4.10347 15.46C4.81973 16.4718 5.83177 17.2368 7.00047 17.65V19.74C5.28848 19.2925 3.77314 18.2901 2.69162 16.8896C1.6101 15.4891 1.02344 13.7695 1.02344 12C1.02344 10.2305 1.6101 8.51093 2.69162 7.11041C3.77314 5.70989 5.28848 4.70746 7.00047 4.26V6.35C5.83177 6.7632 4.81973 7.52824 4.10347 8.53995C3.38721 9.55167 3.00189 10.7604 3.00047 12Z"
                   fill="#F59E0B"
                 />
               </svg>


               <p className="text-[14px] font-semibold text-[#618171]">
 ${scheduleData.estCost.toFixed(2)}
</p>
             </div>
           </div>


           <div className="h-10 w-px shrink-0 bg-[#E5E7EB]" />


           <div className="min-w-0 flex-1 self-start">
             <ThresholdProgress current={scheduleData.estCost} target= {5.0} />
           </div>
         </div>


         {/* button */}
         <Button
     type="button"
     disabled
     className="shrink-0 flex min-w-[200px] h-[52px] items-center justify-center gap-2 rounded-xl px-6 text-[15px] font-semibold bg-[#344E41] text-white cursor-not-allowed opacity-70"
   >
           Confirm Pickup
          
             <svg
               xmlns="http://www.w3.org/2000/svg"
               width="16"
               height="16"
               viewBox="0 0 16 16"
               fill="none"
             >
               <path
                 d="M8.00065 11.3333C8.36884 11.3333 8.66732 11.0349 8.66732 10.6667C8.66732 10.2985 8.36884 10 8.00065 10C7.63246 10 7.33398 10.2985 7.33398 10.6667C7.33398 11.0349 7.63246 11.3333 8.00065 11.3333Z"
                 stroke="white"
                 strokeWidth="2"
                 strokeLinecap="round"
                 strokeLinejoin="round"
               />
               <path
                 d="M12.6667 6.66602H3.33333C2.59695 6.66602 2 7.26297 2 7.99935V13.3327C2 14.0691 2.59695 14.666 3.33333 14.666H12.6667C13.403 14.666 14 14.0691 14 13.3327V7.99935C14 7.26297 13.403 6.66602 12.6667 6.66602Z"
                 stroke="white"
                 strokeWidth="2"
                 strokeLinecap="round"
                 strokeLinejoin="round"
               />
               <path
                 d="M4.66602 6.66634V4.66634C4.66602 3.78229 5.01721 2.93444 5.64233 2.30932C6.26745 1.6842 7.11529 1.33301 7.99935 1.33301C8.8834 1.33301 9.73125 1.6842 10.3564 2.30932C10.9815 2.93444 11.3327 3.78229 11.3327 4.66634V6.66634"
                 stroke="white"
                 strokeWidth="2"
                 strokeLinecap="round"
                 strokeLinejoin="round"
               />
             </svg>
         </Button>
       </div>
     </div>

</div>

)};
export default SchedulePickupTime;

