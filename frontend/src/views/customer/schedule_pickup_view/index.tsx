import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {useMemo,  useState} from "react";
import { useNavigate } from "react-router-dom";

type Item = {
  id: string;
  name: string;
  payoutInfo: string;
};

const Items: Item[] = [
  {
    id: "gable",
    name: "Gable-top/Cartons",
    payoutInfo:
      "10¢ - 15¢ on cartons up to 999ml. 25¢ - 35¢ on cartons 1L and over.", // these are just simutalting, the payout info comes from the backend 
  },
  {
    id: "glass",
    name: "Glass bottles",
    payoutInfo: "10¢ - 12¢ for <1L. 25¢ - 30¢ for 1L and over.",
  },
  { id: "drink", name: "Drink boxes", payoutInfo: "…" },
  { id: "tins", name: "Tins/Cans", payoutInfo: "…" },
  { id: "refill", name: "Refillable beer bottles", payoutInfo: "…" },
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

    const navigate = useNavigate(); 
    
    const [ItemPicked, setItemPicked] = useState<Record<string, number>>({});

    const isSelected = (id: string) => ItemPicked[id] !== undefined;

    const removeItem = (id: string) => {
    setItemPicked((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

    const SelectQuantity = (id: string, qunty: number) => {
    setItemPicked((prev) => ({
      ...prev,
      [id]: Math.max(1, qunty),
    }));
  };

    const ItemsChosen = useMemo(() => { return Items.filter((item) => ItemPicked[item.id] !== undefined);
    }, [ItemPicked]);
  
  
    const TotalSelected = useMemo(() =>{ return Object.values(ItemPicked).reduce((a, b) => a + b, 0);
    }, [ItemPicked] );

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
  
  return (
   
   <div className="space-y-6 px-6 py-4 pb-8">
    
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
                          value={ItemPicked[item.id]}
                          onChange={(e) =>
                            SelectQuantity(item.id, Number(e.target.value))
                          }
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
          disabled={!Clickable}
          onClick={() =>navigate("/app/schedule/pickupTime", {
         state: { itemPicked: ItemPicked }
         })
        }
         className={`h-10 px-6 ${
         Clickable ? "bg-[#1F3D2B] hover:bg-[#163022]" : "bg-[#A3B0A7] opacity-70"
         }`}
          >
        
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
          <span className="text-base"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M8.00065 11.3333C8.36884 11.3333 8.66732 11.0349 8.66732 10.6667C8.66732 10.2985 8.36884 10 8.00065 10C7.63246 10 7.33398 10.2985 7.33398 10.6667C7.33398 11.0349 7.63246 11.3333 8.00065 11.3333Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12.6667 6.66602H3.33333C2.59695 6.66602 2 7.26297 2 7.99935V13.3327C2 14.0691 2.59695 14.666 3.33333 14.666H12.6667C13.403 14.666 14 14.0691 14 13.3327V7.99935C14 7.26297 13.403 6.66602 12.6667 6.66602Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4.66602 6.66634V4.66634C4.66602 3.78229 5.01721 2.93444 5.64233 2.30932C6.26745 1.6842 7.11529 1.33301 7.99935 1.33301C8.8834 1.33301 9.73125 1.6842 10.3564 2.30932C10.9815 2.93444 11.3327 3.78229 11.3327 4.66634V6.66634" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></span>
        </button>
      </div>
    </div>

  </div>
);

};

export default SchedulePickup;