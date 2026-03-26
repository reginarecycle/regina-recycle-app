import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSchedule } from "@/components/scheduleView/ScheduleContext";
import { AddressAutocompleteField, type ParsedAddress } from "@/components/forms/address-field";
import { useCurrentUser } from "@/api-hooks/useAuth";

type AddressOption = "current" | "different";

type Props = { onBack: () => void };

export default function Step3Location({ onBack }: Props) {
  const { scheduleData, updateScheduleData } = useSchedule();
  const { data } = useCurrentUser();

  const primaryAddress = data?.data?.addresses?.find((a) => a.isPrimary);
  const currentAddressLabel = primaryAddress
    ? [primaryAddress.line1, primaryAddress.city, primaryAddress.province, primaryAddress.postalCode]
        .filter(Boolean)
        .join(", ")
    : "";

  const [addressOption, setAddressOption] = useState<AddressOption>("current");

  useEffect(() => {
    if (addressOption === "current" && currentAddressLabel) {
      updateScheduleData({ address: currentAddressLabel });
    }
  }, [addressOption, currentAddressLabel]);

  const mapAddress = scheduleData.address || currentAddressLabel || "Regina, Saskatchewan";

  const selectCurrent = () => {
    setAddressOption("current");
    if (currentAddressLabel) updateScheduleData({ address: currentAddressLabel });
  };

  const selectDifferent = () => {
    setAddressOption("different");
    updateScheduleData({ address: "" });
  };

  const handleAddressSelect = (parsed: ParsedAddress) => {
    const formatted = [parsed.line1, "Regina", "Saskatchewan", parsed.postalCode]
      .filter(Boolean)
      .join(", ");
    updateScheduleData({ address: formatted });
  };

  return (
    <div className="rounded-xl border border-border bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            3
          </div>
          <h2 className="text-[15px] font-semibold text-foreground">Location Details</h2>
        </div>
        <span className="rounded-full border border-border px-4 py-1 text-xs font-medium text-muted-foreground">
          STEP 3 OF 3
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <button
            type="button"
            onClick={selectCurrent}
            className={`w-full rounded-xl border p-4 text-left transition-colors ${
              addressOption === "current" ? "border-foreground shadow-sm" : "border-border hover:border-muted-foreground"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`mt-1 h-6 w-6 shrink-0 rounded-full border-2 flex items-center justify-center ${
                addressOption === "current" ? "border-primary bg-primary" : "border-border"
              }`}>
                {addressOption === "current" && <div className="h-2.5 w-2.5 rounded-full bg-primary-foreground" />}
              </div>
              <div>
                <p className="text-[15px] font-semibold text-foreground">Use my current address</p>
                <p className="text-[13px] text-muted-foreground">
                  {currentAddressLabel || "Loading address…"}
                </p>
              </div>
            </div>
          </button>

          <div
            onClick={selectDifferent}
            className={`w-full rounded-xl border p-4 cursor-pointer transition-colors ${
              addressOption === "different" ? "border-foreground shadow-sm" : "border-border hover:border-muted-foreground"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`h-6 w-6 shrink-0 rounded-full border-2 flex items-center justify-center ${
                addressOption === "different" ? "border-primary bg-primary" : "border-border"
              }`}>
                {addressOption === "different" && <div className="h-2.5 w-2.5 rounded-full bg-primary-foreground" />}
              </div>
              <p className="text-[15px] font-semibold text-foreground">Use a different address</p>
            </div>

            {addressOption === "different" && (
              <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                <AddressAutocompleteField
                  showLabel={false}
                  restrictToRegina
                  onAddressSelect={handleAddressSelect}
                />
              </div>
            )}
          </div>
        </div>

        <div className="h-65 sm:h-75 rounded-xl overflow-hidden border border-border">
          <iframe
            title="pickup location map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="eager"
            allowFullScreen
            src={`https://www.google.com/maps?q=${encodeURIComponent(mapAddress)}&z=17&output=embed`}
          />
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-4 flex justify-start">
        <Button
          type="button"
          size="lg"
          onClick={onBack}
          className="w-39.5 border border-primary bg-white text-primary hover:bg-muted"
        >
          ← Previous Step
        </Button>
      </div>
    </div>
  );
}
