import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

type Slot = { id: string; label: string };

const slotsByDay: Record<number, Slot[]> = {
 1: [
   { id: "1a", label: "10:00 AM - 12:00 PM" },
   { id: "1b", label: "12:00 PM - 2:00 PM" },
   { id: "1c", label: "3:00 PM - 5:00 PM" },
 ],
 2: [
   { id: "2a", label: "9:00 AM - 11:00 AM" },
   { id: "2b", label: "1:00 PM - 3:00 PM" },
 ],
 3: [{ id: "3a", label: "2:00 PM - 4:00 PM" }],
 4: [],
};


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

//slot shows only after user click date
 const [hasClickedDate, setHasClickedDate] = useState<boolean>(false);


 //selected slot
 const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);


 const slotsForSelectedDay = useMemo<Slot[]>(()=>{
   return slotsByDay[selectedDay] ?? [];
 }, [selectedDay]);


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
                                 setHasClickedDate(true);
                                 setSelectedSlotId(null);

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
                       onClick={() => setSelectedSlotId(slot.id)}
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

