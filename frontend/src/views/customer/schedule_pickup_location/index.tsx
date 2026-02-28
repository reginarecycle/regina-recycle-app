import { useNavigate } from "react-router-dom";
import map from "@/assets/map.png";


const SchedulePickupLocation = () => {
const navigate = useNavigate();

return(

    // Step 1
    <div className="space-y-6 px-6 py-4"> 
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

 {/* Step2  */}
    <div className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-5 shadow-sm">
      <div className="flex items-center justify-between">
         <div className="flex items-start gap-4">
             <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F3F4F6] text-sm font-semibold text-[#111827]">
             2
            </div>
         <div>
        <p className="text-[15px] font-semibold text-[#111827]">
          Select Pickup Time
        </p>
        <p className="text-[13px] text-[#6B7280]">
          Select a suitable time for pickup
        </p>
       </div>
       </div>
       <button className=""
            type="button"
            onClick={()=>{
              navigate("/app/schedule/pickupTime");
            }}>
        <span className="text-[#111827 · 75%] text-[14px] font-semibold">EDIT SELECTION</span>
      </button>
   </div>
 </div>

 {/* Step 3 */}
 <div className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-5 shadow-sm">
  <div className="flex items-start justify-between">
    <div className="flex items-start gap-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#344E41] text-white text-sm font-semibold">
        3
      </div>

      <div>
        <p className="text-[15px] font-semibold text-[#111827]">Location Details</p>
      </div>
    </div>

    <span className="flex p-[10px] justify-center items-center h-8 w-[173px] border border-[#CFCFCF] rounded-xl text-[#999CA0]">
      STEP 3 OF 3
    </span>
  </div>
 {/* Step 3 Body (structure only) */}
<div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
  {/* Left: address choices */}
  <div className="space-y-4">
    <div className="rounded-xl border border-[#E5E7EB] px-5 py-4">
      <p className="text-sm font-semibold text-[#111827]">Use my current address</p>
      <p className="mt-1 text-sm text-[#6B7280]">123 Lane, Str.</p>
    </div>

    <div className="rounded-xl border border-[#E5E7EB] px-5 py-4">
      <p className="text-sm font-semibold text-[#111827]">Use a different address</p>
      <p className="mt-1 text-sm text-[#6B7280]">Enter a new pickup location</p>
    </div>
  </div>

  {/* Right: map placeholder */}
   <div className="h-[260px] rounded-xl overflow-hidden border border-[#E5E7EB]">
    <img
      src={map}
      alt="Pickup location map"
      className="h-full w-full object-cover"
    />
  </div>
</div>

<div className="mt-6 border-t border-[#E5E7EB]" />

{/* Step 3 Footer */}
<div className="mt-8 flex justify-end">
  <button
    type="button"
    onClick={() => navigate("/app/schedule/pickupTime")}
    className="flex h-10 items-center gap-2 rounded-md border border-[#1F3D2B] px-4 text-sm font-medium text-[#1F3D2B]"
  >
    ← Previous Step
  </button>
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

export default SchedulePickupLocation;
