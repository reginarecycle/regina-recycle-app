import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SchedulePickup = () => {

  const Items = ["Gable-top/Cartons","Glass bottles","Drink boxes","Tins/Cans","Refillable beer bottles",];

  return (
   
    <div className="space-y-6 px-6 py-4"> 
    <h1 className="text-[24px] leading-[32px] font-black text-[#0C111D]">
      Schedule
    </h1>
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
         className="h-10 rounded-md border border-[#E5E7EB] text-sm"/>
    </div>

    <div className="mt-6 grid grid-cols-2 gap-6">
    <div className="rounded-xl border border-[#E5E7EB] p-4">
     <p className="text-xs font-semibold text-[#6B7280]">
         AVAILABLE CATEGORIES
     </p>

    <div className="mt-4 space-y-4">
      {Items.map((item) => (
          <div
            key={item}
            className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-white px-4 py-4"
          >
            <span className="text-sm text-[#111827]">{item}</span>

            <button className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D1D5DB] text-[#6B7280] hover:bg-[#F9FAFB]">
              +
            </button>
          </div>
        ))}

    </div>
    </div>

    <div className="rounded-xl border border-[#E5E7EB] p-4">
    <div className="flex justify-between text-xs font-semibold text-[#6B7280]">
        <p>MATERIAL & PAYOUT INFO</p>
        <p>QUANTITY</p>
    </div>

    <div className="flex h-[250px] flex-col items-center justify-center text-center">
     <p className="text-sm font-medium text-[#111827]">
        No item selected yet
     </p>
     <p className="mt-1 text-xs text-[#6B7280]">
       Click on the available categories to start building your pickup
    </p>
    </div>
    </div>
    </div>

    {/* Upload Section */}
    <div className="mt-6">
    <p className="text-sm font-medium text-[#111827]">
      Upload photos of your bags{" "}
     <span className="text-[#6B7280]">(optional)</span>
    </p>

    <div className="mt-3 flex h-[120px] items-center justify-center rounded-xl border border-dashed border-[#9CA3AF] text-sm text-[#6B7280]">
      Drag and drop or click to browse images
    </div>
     </div>

    {/* Next Step Button */}
    <div className="mt-6 flex justify-end">
     <Button className="bg-[#1F3D2B] px-6 hover:bg-[#163022]">
      Next Step →
     </Button>
    </div>
    </div>

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
    <span className="text-[#6B7280] text-xl">⌄</span>
   </div>
 </div>
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
    
)};

export default SchedulePickup;