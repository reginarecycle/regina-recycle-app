import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {useMemo,  useState, useEffect} from "react";
import { useNavigate} from "react-router-dom";
import ThresholdProgress from "@/components/scheduleView/progressBar";
import { useSchedule } from "@/components/scheduleView/ScheduleContext";




type Item = {
  id: string;
  name: string;
  payoutInfo: string;
  estimatedpay : number; // dollar value user get per unit
};


const Items: Item[] = [
  {
    id: "gable",
    name: "Gable-top/Cartons",
    payoutInfo:
      "10¢ - 15¢ on cartons up to 999ml. 25¢ - 35¢ on cartons 1L and over.", // these are just simutalting, the payout info comes from the backend
       estimatedpay : 0.25,


  },
  {
    id: "glass",
    name: "Glass bottles",
    payoutInfo: "10¢ - 12¢ for <1L. 25¢ - 30¢ for 1L and over.",
     estimatedpay: 0.30,
  },
  { id: "drink", name: "Drink boxes", payoutInfo: "…",  estimatedpay: 0.20, },
  { id: "tins", name: "Tins/Cans", payoutInfo: "…",  estimatedpay: 0.32, },
  { id: "refill", name: "Refillable beer bottles", payoutInfo: "…",  estimatedpay: 0.15, },


];


const Itemicon = () => (
  <div className="h-8 w-8 rounded-full bg-[#F3F4F6] flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="12" viewBox="0 0 14 12" fill="none">
      <path
        d="M1.33333 12C0.966667 12 0.652889 11.8696 0.392 11.6087C0.131111 11.3478 0.000444444 11.0338 0 10.6667V0L1.11667 1.11667L2.21667 0L3.33333 1.11667L4.45 0L5.55 1.11667L6.66667 0L7.78333 1.11667L8.88333 0L10 1.11667L11.1167 0L12.2167 1.11667L13.3333 0V10.6667C13.3333 11.0333 13.2029 11.3473 12.942 11.6087C12.6811 11.87 12.3671 12.0004 12 12H1.33333ZM1.33333 10.6667H6V6.66667H1.33333V10.6667ZM7.33333 10.6667H12V9.33333H7.33333V10.6667ZM7.33333 8H12V6.66667H7.33333V8ZM1.33333 5.33333H12V3.33333H1.33333V5.33333Z"
        fill="#111827"
      />
    </svg>
  </div>
);


const SchedulePickup = () => {
  //data store
 const { scheduleData, updateScheduleData } = useSchedule();

    const navigate = useNavigate();
    const [ItemPicked, setItemPicked] = useState<Record<string, number>>(
    scheduleData.itemPicked ?? {}
    );

    const isSelected = (id: string) => ItemPicked[id] !== undefined;


    const removeItem = (id: string) => {
    setItemPicked((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

    const ItemsChosen = useMemo(() => { return Items.filter((item) => ItemPicked[item.id] !== undefined);
    }, [ItemPicked]);
 
  const Threshold_progress = 5.0;
    const TotalSelected = useMemo(() =>{ return Object.values(ItemPicked).reduce((a, b) => a + b, 0);
    }, [ItemPicked] );


    const EstimatedCost = useMemo(() => {
  return Items.reduce((total, item) => {
    const quantity = ItemPicked[item.id] || 0;
    return total + quantity * item.estimatedpay;
  }, 0);
}, [ItemPicked]);


    const ClickItem = (id: string) => {
        setItemPicked((prev) => {
            const copy = { ...prev};
            if(copy[id]!== undefined) {
                delete copy[id];
                return copy;
            }
            return {...copy, [id]: 1};
        });
    };
  const Clickable = ItemsChosen.length > 0;

  useEffect(() => {
 updateScheduleData({
   itemPicked: ItemPicked,
   categories: ItemsChosen.map((item) => item.name),
   totalSelected: TotalSelected,
   estCost: EstimatedCost,
 });
}, [ItemPicked, ItemsChosen, TotalSelected, EstimatedCost, updateScheduleData]);

 
  return (
   
   <div className="space-y-6 px-6 py-4">
   <div className="space-y-6 flex-1 mb-[80px]">
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
     
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1F3D2B] text-sm font-medium text-white">
            1
          </div>
          <h2 className="text-[15px] font-semibold text-[#111827]">
            What are we collecting?
          </h2>
        </div>


        <div className="rounded-full border border-[#E5E7EB] px-4 py-1 text-xs font-medium text-[#6B7280]">
          STEP 1 OF 3
        </div>
      </div>


     
      <div className="mt-4">
        <Input
          placeholder="Search for items (e.g. bottle, 'Battery')"
          className="h-10 rounded-md border border-[#E5E7EB] text-sm"
        />
      </div>


      {/* 2-column section */}
      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2 items-stretch">
        {/* LEFT: Available Categories */}
        <div className="flex flex-col">
          <p className="mb-2 text-xs font-semibold text-[#6B7280]">
            AVAILABLE CATEGORIES
          </p>


          {/* IMPORTANT: make the list scroll inside the fixed-height card */}
          <div className = "rounded-xl border border-[#E5E7EB] bg-white p-4 h-[403px] flex flex-col">
          <div className="space-y-3 flex-1 overflow-auto pr-1">
            {Items.map((item) => {
              const active = isSelected(item.id);


              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => ClickItem(item.id)}
                  className={`w-full flex items-center justify-between rounded-lg border px-4 py-4 ${
                    active
                      ? "border-[#1F3D2B] bg-[#EEF2F0]"
                      : "border-[#E5E7EB] bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                   <Itemicon/>
                    <span className="text-sm text-[#111827]">{item.name}</span>
                  </div>


                  {active ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1F3D2B] text-xs text-white">
                      ✓
                    </div>
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D1D5DB] text-[#6B7280]">
                      +
                    </div>
                  )}
                </button>
              );
            })}
            </div>
          </div>
        </div>


        {/* RIGHT: Selected Categories */}
        <div className="flex flex-col">
          {/* top label row with padding so it doesn't touch borders */}
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="text-[11px] font-semibold tracking-wide text-[#6B7280]">
              CATEGORIES SELECTED FOR COLLECTION
            </p>
            <p className="text-[11px] text-[#6B7280]">
              Total Selection: {TotalSelected} units
            </p>
          </div>


          {/* panel box */}
          <div className="rounded-xl border border-[#E5E7EB] bg-white h-[403px] flex flex-col overflow-hidden">
            {/* Header row needs padding + background */}
            <div className="flex items-center justify-between bg-[#F9FAFB] px-4 py-3">
              <p className="text-[11px] font-semibold tracking-wide text-[#6B7280]">
                MATERIAL & PAYOUT INFO
              </p>
              <p className="text-[11px] font-semibold tracking-wide text-[#6B7280]">
                QUANTITY
              </p>
            </div>


            {/* Body */}
            <div className="px-4 py-4 flex-1">
              {ItemsChosen.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="text-sm font-medium text-[#111827]">
                    No item selected yet
                  </p>
                  <p className="mt-1 text-xs text-[#6B7280] max-w-[280px]">
                    Click on the available categories to start building your pickup
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ItemsChosen.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <Itemicon />
                        <div>
                          <p className="text-[13px] font-semibold text-[#111827]">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-[#6B7280]">
                            {item.payoutInfo}
                          </p>
                        </div>
                      </div>


                      <div className="flex items-center gap-2">
                        <input
                           value={ItemPicked[item.id] || ""}
                           onChange={(e) => {
                             const value = e.target.value;
                             setItemPicked((prev) => ({
                               ...prev,
                               [item.id]: value === "" ? 0 : Number(value),
                             }));
                           }}
                           onBlur={(e) => {
                             const value = Number(e.target.value);
                             setItemPicked((prev) => ({
                               ...prev,
                               [item.id]: value > 0 ? value : 1,
                             }));
                           }}
                           type="number"
                           min={1}
                           className="h-9 w-14 rounded-md border border-[#E5E7EB] text-center text-sm"
                         />

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E5E7EB] text-[#111827]"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Upload Section (still inside step 1 card, full width) */}
      <div className="mt-6 w-full">
        <p className="text-sm font-medium text-[#111827]">
          Upload photos of your bags{" "}
          <span className="text-[#6B7280]">(optional)</span>
        </p>


        {/* (optional) make this a real file upload without backend */}
        <label className="mt-3 flex h-[120px] w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-[#9CA3AF] text-sm text-[#6B7280]">
          <input type="file" accept="image/*" multiple className="hidden" />
          Drag and drop or click to browse images
        </label>
      </div>


      {/* Next step button */}
      <div className="mt-6 border-t border-[#E5E7EB] pt-4 flex justify-end">
        <Button
          type="button"
          size="lg"
          disabled={!Clickable}
         onClick={() => {
      navigate("/app/schedule/pickupTime");
      }}
      className = "w-[158px]" >
        Next Step →
        </Button>
      </div>
    </div>
    {/* ===================== END STEP 1 CARD ===================== */}


    {/* ===================== STEP 2 + STEP 3 (OUTSIDE step 1 card) ===================== */}
    <div className="space-y-4">
      {/* Step 2 */}
      <div
       className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-5 shadow-sm cursor-pointer">
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
          <span className="text-[#6B7280] text-xl">⌄</span>
        </div>
      </div>


      {/* Step 3 */}
      <div
      className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-5 shadow-sm cursor-pointer">
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
             <ThresholdProgress current={scheduleData.estCost} target={Threshold_progress} />
           </div>
         </div>


         {/* button */}
         <Button
     type="button"
     disabled
     className="shrink-0 flex min-w-[200px] h-[52px] items-center justify-center gap-2 px-6 text-[15px] font-semibold bg-[#344E41] text-white cursor-not-allowed opacity-70"
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
);
};

export default SchedulePickup;




