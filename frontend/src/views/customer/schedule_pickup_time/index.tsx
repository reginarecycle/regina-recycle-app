import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const SchedulePickupTime = () => {
const navigate = useNavigate();

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