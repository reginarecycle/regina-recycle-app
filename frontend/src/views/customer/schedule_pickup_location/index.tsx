import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SchedulePickupLocation = () => {
const navigate = useNavigate();
const [selectedAddress, setSelectedAddress] = useState("current");
const [customAddress, setCustomAddress] = useState("");
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
{/* Content area (you can add your address + map here) */}
  <div className="mt-4 grid grid-cols-2 gap-6">
    {/* LEFT: address tabs */}
          <div className="space-y-4">
            {/* Current address tab */}
            <button
              type="button"
              onClick={() => setSelectedAddress("current")}
              className={`w-full rounded-xl border p-4 text-left transition ${
                selectedAddress === "current"
                  ? "border-[#111827] shadow-sm"
                  : "border-[#E5E7EB] hover:border-[#9CA3AF]"
              }`}
            >
                 <div className="flex items-start gap-4">
                {/* radio */}
                <div className={`mt-1 h-5 w-5 rounded-full border flex items-center justify-center ${
                  selectedAddress === "current" ? "border-[#111827]" : "border-[#D1D5DB]"
                }`}>
                  {selectedAddress === "current" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-[#111827]" />
                  )}
                </div>
                 <div>
                  <p className="text-[15px] font-semibold text-[#111827]">
                    Use my current address
                  </p>
                  <p className="text-[13px] text-[#6B7280]">123 Lane, Str.</p>
                </div>
              </div>
            </button>

        {/* Different address tab */}
        <button
      type="button"
      onClick={() => setSelectedAddress("different")}
      className={`w-full rounded-xl border p-5 text-left transition ${
              selectedAddress === "different"
              ? "border-[#111827] shadow-sm"
               : "border-[#E5E7EB] hover:border-[#9CA3AF]"
            }`}
          >
    <div className="flex items-start gap-4">
    {/* radio */}
    <div
      className={`mt-1 h-6 w-6 rounded-full border flex items-center justify-center ${
        selectedAddress === "different" ? "border-[#111827]" : "border-[#D1D5DB]"
      }`}
    >
         {selectedAddress === "different" && (
        <div className="h-3 w-3 rounded-full bg-[#111827]" />
      )}
    </div>
    <div className="w-full">
      <p className="text-[15px] font-semibold text-[#111827]">
        Use a different address
      </p>
     {/* show input only when selected */}
      {selectedAddress === "different" && (
        <div
          className="mt-4 flex items-center gap-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-2 py-2"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[#6B7280]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8.00098 1.83301C9.10593 1.83309 10.1659 2.27239 10.9473 3.05371C11.7285 3.83508 12.167 4.89509 12.167 6C12.1669 6.77376 11.9061 7.6782 11.4814 8.62598C11.0597 9.56729 10.4938 10.5157 9.91992 11.3662C9.34704 12.2153 8.77284 12.9582 8.3418 13.4893C8.21498 13.6455 8.098 13.7811 8 13.8975C7.90216 13.7813 7.78667 13.6451 7.66016 13.4893C7.22916 12.9582 6.65489 12.2152 6.08203 11.3662C5.50814 10.5156 4.94126 9.56733 4.51953 8.62598C4.09493 7.6782 3.83406 6.77376 3.83398 6C3.83398 4.89493 4.27329 3.83511 5.05469 3.05371C5.83609 2.27231 6.89591 1.83301 8.00098 1.83301ZM8.00098 3.83301C7.42634 3.83301 6.87508 4.06144 6.46875 4.46777C6.06242 4.8741 5.83398 5.42536 5.83398 6C5.83407 6.57452 6.0625 7.12597 6.46875 7.53223C6.87505 7.93835 7.42649 8.16602 8.00098 8.16602C8.2854 8.16597 8.56731 8.10982 8.83008 8.00098C9.0928 7.89209 9.33211 7.73332 9.5332 7.53223C9.7343 7.33113 9.89307 7.09182 10.002 6.8291C10.1108 6.56633 10.1669 6.28442 10.167 6C10.167 5.42552 9.93933 4.87407 9.5332 4.46777C9.12695 4.06152 8.57549 3.83309 8.00098 3.83301Z" fill="#344E41" stroke="#0C111D"/>
            </svg>
          </span>

          <input
            value={customAddress}
            onChange={(e) => setCustomAddress(e.target.value)}
            placeholder="123, Wascana str."
            className="w-full bg-transparent text-[15px] text-[#111827] outline-none placeholder:text-[#9CA3AF]"
          />
        </div>
         )}
    </div>
  </div>
   </button>
          </div>
    <div className="h-[260px] roundec-xl overflow-hidden border borde-[#E5E7EB">
      <img src="/map.png" className="h-full w-full object-cover" alt="pickup location map"></img>
    </div>
  </div>
   <div className="mt-8 border-t border-[#CFCFCF]"></div>
   <div className="mt-6 flex items-center justify-end gap-4">
    <button className="h-[44px] rounded-xl border border-[#344E41] bg-[#FFF] px-5 text-[14px] font-medium text-[#344E41] hover:bg-[#F9FAFB] flex items-center gap-2"
                    onClick={()=>{
                        navigate("/app/schedule/pickupTime");
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
