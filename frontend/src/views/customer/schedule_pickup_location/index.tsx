import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ThresholdProgress from "@/components/scheduleView/progressBar";
import { useSchedule } from "@/components/scheduleView/ScheduleContext";
import { Button } from "@/components/ui/button";


const SchedulePickupLocation = () => {
  //data
const { scheduleData, updateScheduleData, resetScheduleData } = useSchedule();

const threshold = 5.0;
const hasMetThreshold = scheduleData.estCost >= threshold;
const navigate = useNavigate();
const defaultAddress = "123 Lane, Str.";
const [selectedAddress, setSelectedAddress] = useState<"current" | "different">(
 scheduleData.address
   ? scheduleData.address === defaultAddress
     ? "current"
     : "different"
   : "current"
);


const [customAddress, setCustomAddress] = useState(
 scheduleData.address && scheduleData.address !== defaultAddress
   ? scheduleData.address
   : ""
);
const isAddressValid =
   selectedAddress === "current" ||
   (selectedAddress === "different" && customAddress.trim() !== "");

const [showSuccessModal, setShowSuccessModal] = useState(false);
 const canConfirm = isAddressValid && hasMetThreshold;

const mapAddress =
   selectedAddress === "different" && customAddress
     ? `${customAddress}, Regina, Saskatchewan`
     : defaultAddress;
return(

    // Step 1
    
    <div className="flex min-h-screen flex-col px-6 py-4">
   <div className="space-y-6 flex-1 mb-[80px]">

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
  <div className="mt-4 grid grid-cols-2 gap-6">
    {/* LEFT: address tabs */}
          <div className="space-y-4">
            {/* Current address tab */}
            <div
             onClick={() => {setSelectedAddress("current");
               updateScheduleData({
                 address : defaultAddress,
               });
             }}

             className={`w-full rounded-xl border p-4 text-left transition ${
               selectedAddress === "current"
                 ? "border-[#111827] shadow-sm"
                 : "border-[#E5E7EB] hover:border-[#9CA3AF]"
             }`}
           >
             <div className="flex items-start gap-4">
               {/* radio */}
               <div className={`mt-1 h-6 w-6 rounded-full border flex items-center justify-center ${
                 selectedAddress === "current" ? "bg-[#344E41] border-[#344E41]" : "border-[#D1D5DB]"
               }`}>
                 {selectedAddress === "current" && (
                   <div className="h-3 w-3 rounded-full bg-[#FFFFFF]" />
                 )}
               </div>


               {/* text */}
               <div>
                 <p className="text-[15px] font-semibold text-[#111827]">
                   Use my current address
                 </p>
                <p className="text-[13px] text-[#6B7280]">{defaultAddress}</p>
               </div>
             </div>
           </div>


           {/* Different address tab */}
           {/* Different */}
    <div
    onClick={() => setSelectedAddress("different")}
    className={`w-full rounded-xl border p-5 text-left transition cursor-pointer ${
    selectedAddress === "different"
     ? "border-[#111827] shadow-sm"
     : "border-[#E5E7EB] hover:border-[#9CA3AF]"
    }`}>
    {/* first row */}
    <div className="flex items-center gap-4">
     <div
     className={`flex h-6 w-6 items-center justify-center rounded-full border ${
       selectedAddress === "different"
         ? "bg-[#344E41] border-[#344E41]" : "border-[#D1D5DB]"
     }`}>
     {selectedAddress === "different" && (
       <div className="h-3 w-3 rounded-full bg-[#FFFFFF]" />
     )}
    </div>


    <p className="text-[15px] font-semibold text-[#111827]">
     Use a different address
    </p>
   </div>


     {/* second row */}
    {selectedAddress === "different" && (
     <div
     className="mt-2 ml-0"
     onClick={(e) => e.stopPropagation()}>
     <div className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3">
       <span className="text-[#6B7280]">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
       <path d="M8.00098 1.83301C9.10593 1.83309 10.1659 2.27239 10.9473 3.05371C11.7285 3.83508 12.167 4.89509 12.167 6C12.1669 6.77376 11.9061 7.6782 11.4814 8.62598C11.0597 9.56729 10.4938 10.5157 9.91992 11.3662C9.34704 12.2153 8.77284 12.9582 8.3418 13.4893C8.21498 13.6455 8.098 13.7811 8 13.8975C7.90216 13.7813 7.78667 13.6451 7.66016 13.4893C7.22916 12.9582 6.65489 12.2152 6.08203 11.3662C5.50814 10.5156 4.94126 9.56733 4.51953 8.62598C4.09493 7.6782 3.83406 6.77376 3.83398 6C3.83398 4.89493 4.27329 3.83511 5.05469 3.05371C5.83609 2.27231 6.89591 1.83301 8.00098 1.83301ZM8.00098 3.83301C7.42634 3.83301 6.87508 4.06144 6.46875 4.46777C6.06242 4.8741 5.83398 5.42536 5.83398 6C5.83407 6.57452 6.0625 7.12597 6.46875 7.53223C6.87505 7.93835 7.42649 8.16602 8.00098 8.16602C8.2854 8.16597 8.56731 8.10982 8.83008 8.00098C9.0928 7.89209 9.33211 7.73332 9.5332 7.53223C9.7343 7.33113 9.89307 7.09182 10.002 6.8291C10.1108 6.56633 10.1669 6.28442 10.167 6C10.167 5.42552 9.93933 4.87407 9.5332 4.46777C9.12695 4.06152 8.57549 3.83309 8.00098 3.83301Z" fill="#344E41" stroke="#0C111D"/>
        </svg>
       </span>


       <input
         value={customAddress}
         onChange={(e) => {
       const value = e.target.value;
       setCustomAddress(value);
       updateScheduleData({
       address: value.trim(),
      });
      }}

         placeholder="123, Wascana str."
         className="w-full h-[18px] bg-transparent text-[15px] text-[#111827] outline-none placeholder:text-[#9CA3AF]" />
     </div>
   </div>
 )}
</div>

</div>

    <div className="h-[300px] rounded-s overflow-hidden border border-[#E5E7EB]">
      <iframe
      title="pickup location map"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      loading="eager"
      allowFullScreen
      src={`https://www.google.com/maps?q=${encodeURIComponent(
       mapAddress
      )}&z=17&output=embed`}
      />
    </div>
  </div>

   <div className="mt-8 border-t border-[#CFCFCF]"></div>
   <div className="mt-6 flex items-center justify-end gap-4">
    <Button 
    size = "lg"
    className=" w-[158px] border border-[#344E41] bg-[#FFF] text-[14px] font-medium text-[#344E41] hover:bg-[#F9FAFB] flex items-center gap-2 "
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
            </Button>
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
             <ThresholdProgress current={scheduleData.estCost} target= {threshold} />
           </div>
         </div>


         {/* button */}
         <Button
           type="button"
           disabled={!canConfirm}
           onClick={() => {
             if (!canConfirm) return;
             setShowSuccessModal(true);
           }}
           className={`shrink-0 flex min-w-[200px] h-[52px] items-center justify-center gap-2 rounded-xl px-6 text-[15px] font-semibold ${
             canConfirm
               ? "bg-[#344E41] text-white hover:bg-[#2e4237]"
               : "bg-[#344E41] text-white cursor-not-allowed opacity-70"
           }`}
         >
           Confirm Pickup
           {canConfirm? (
             <svg
               xmlns="http://www.w3.org/2000/svg"
               width="16"
               height="16"
               viewBox="0 0 16 16"
               fill="none"
             >
               <path
                 d="M13.3327 4L5.99935 11.3333L2.66602 8"
                 stroke="white"
                 strokeWidth="2"
                 strokeLinecap="round"
                 strokeLinejoin="round"
               />
             </svg>
           ) : (
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
           )}
         </Button>
       </div>
     </div>


{/* popup */}
{showSuccessModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="w-full max-w-[720px] rounded-2xl bg-white p-10 shadow-xl">
      {/* Icon */}
      {/* Icon */}
<div className="relative mx-auto flex h-20 w-20 items-center justify-center">


  {/* Inner solid circle */}
  <div className="absolute h-16 w-16 rounded-full bg-[#88D18E]" />
  {/* Check */}
  <svg  className="absolute translate-y-[1px]" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 39 39" fill="none">
  <path d="M37.6275 15.8063C38.4724 19.9527 37.8702 24.2634 35.9215 28.0196C33.9728 31.7758 30.7952 34.7504 26.9188 36.4473C23.0423 38.1442 18.7013 38.461 14.6196 37.3446C10.5379 36.2283 6.96227 33.7465 4.48897 30.3129C2.01568 26.8793 0.794243 22.7017 1.02835 18.4765C1.26245 14.2514 2.93794 10.2343 5.77542 7.09496C8.61289 3.95567 12.4408 1.884 16.6209 1.22544C20.8009 0.566885 25.0804 1.36124 28.7456 3.47605" stroke="#344E41" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M13.9473 17.6551L19.4973 23.2051L37.9972 4.70508" stroke="#344E41" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</div>


      {/* Text */}
      <h2 className="mt-6 text-center text-[28px] font-semibold text-[#0C111D]">
        Pickup Scheduled <br /> Successfully!
      </h2>


      <p className="mt-3 text-center text-[14px] text-[#667085]">
        Your items should be ready and available at <br />
        the pickup location
      </p>


      {/* Buttons */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => {
           setShowSuccessModal(false);
           resetScheduleData();
           navigate("/app/history"); // change route if needed
         }}

         className="h-12 w-[220px] rounded-xl border border-[#D0D5DD] bg-white text-[16px] font-semibold text-[#344054] hover:bg-[#F9FAFB]"
        >
          View History
        </button>


        <button
          type="button"
          onClick={() => {
           setShowSuccessModal(false);
           resetScheduleData();
           navigate("/app/history"); // change route if needed
         }}
         className="h-12 w-[220px] rounded-xl bg-[#344E41] text-[16px] font-semibold text-white hover:opacity-95"
        >
          Done
        </button>
      </div>
    </div>
  </div>
)}
 </div>


)};

export default SchedulePickupLocation;