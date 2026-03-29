import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSchedule } from "@/components/scheduleView/ScheduleContext";
import { ScheduleFooter } from "@/components/scheduleView/ScheduleFooter";
import { CollapsedStep } from "@/components/scheduleView/CollapsedStep";
import { SuccessModal } from "@/components/scheduleView/SuccessModal";
import Step1Items from "./Step1Items";
import Step2Time from "./Step2Time";
import Step3Location from "./Step3Location";
import { useCreatePickup } from "@/api-hooks/usePickups";
import { useCurrentUser } from "@/api-hooks/useAuth";

type Step = 1 | 2 | 3;

const STEPS = [
  { title: "What are we collecting?",     subtitle: "Select the category of material for pickup" },
  { title: "Select Pickup Time",          subtitle: "Select a suitable time for pickup" },
  { title: "Location Details",            subtitle: "Select a pickup address" },
];

const SLOT_HOURS: Record<string, number> = {
  "slot-1": 9,
  "slot-2": 11,
  "slot-3": 13,
  "slot-4": 15,
  "slot-5": 17, // TODO: remove after testing
};

export default function SchedulePickupFlow() {
  const navigate = useNavigate();
  const { scheduleData, resetScheduleData } = useSchedule();
  const { data: currentUserResult } = useCurrentUser();
  const { mutateAsync: createPickup, isPending } = useCreatePickup();

  const [step, setStep] = useState<Step>(1);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    return () => { resetScheduleData(); };
  }, []);

  const handleConfirm = async () => {
    try {
      const primaryAddress = currentUserResult?.data?.addresses?.find((a) => a.isPrimary);

      let addressPayload = {
        line1: "",
        city: "Regina",
        province: "Saskatchewan",
        postalCode: "",
      };

      if (scheduleData.address && scheduleData.address !== "") {
        const parts = scheduleData.address.split(", ");
        addressPayload = {
          line1: parts[0] ?? "",
          city: parts[1] ?? "Regina",
          province: parts[2] ?? "Saskatchewan",
          postalCode: parts[3] ?? "",
        };
      } else if (primaryAddress) {
        addressPayload = {
          line1: primaryAddress.line1,
          city: primaryAddress.city,
          province: primaryAddress.province,
          postalCode: primaryAddress.postalCode,
        };
      }

      const slotHour =
        SLOT_HOURS[scheduleData.slotId ?? ""] ??
        (scheduleData.slotId?.startsWith("slot-dynamic-")
          ? parseInt(scheduleData.slotId.replace("slot-dynamic-", ""), 10)
          : 9);
      const [y, m, d] = (scheduleData.pickupDate ?? "").split("-").map(Number);
      const scheduledAt = new Date(y, m - 1, d, slotHour, 0, 0).toISOString();

      const items = Object.entries(scheduleData.itemPicked).map(([materialId, quantity]) => ({
        materialId,
        quantity,
      }));

      const formData = new FormData();
      formData.append("data", JSON.stringify({
        address: addressPayload,
        scheduledAt,
        estimatedCost: scheduleData.estCost,
        items,
        note: scheduleData.note || undefined,
      }));

      if (scheduleData.photo) formData.append("photo", scheduleData.photo);

      await createPickup(formData);
      toast.success("Pickup scheduled successfully!");
      setShowSuccess(true);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to schedule pickup. Please try again.");
    }
  };

  const reset = () => {
    setShowSuccess(false);
    resetScheduleData();
    setStep(1);
  };

  const handleDone        = () => reset();
  const handleViewHistory = () => { reset(); navigate("/app/history"); };

  return (
    <div className="flex min-h-screen flex-col px-4 sm:px-6 py-4">
      <div className="flex-1 space-y-4 pb-36 sm:pb-32">

        {step === 1 ? (
          <Step1Items onNext={() => setStep(2)} />
        ) : (
          <CollapsedStep
            number={1}
            title={STEPS[0].title}
            subtitle={STEPS[0].subtitle}
            onEdit={() => setStep(1)}
          />
        )}

        {step === 2 ? (
          <Step2Time onBack={() => setStep(1)} onNext={() => setStep(3)} />
        ) : step > 2 ? (
          <CollapsedStep
            number={2}
            title={STEPS[1].title}
            subtitle={STEPS[1].subtitle}
            onEdit={() => setStep(2)}
          />
        ) : (
          <CollapsedStep number={2} title={STEPS[1].title} subtitle={STEPS[1].subtitle} />
        )}

        {step === 3 ? (
          <Step3Location onBack={() => setStep(2)} />
        ) : step < 3 ? (
          <CollapsedStep number={3} title={STEPS[2].title} subtitle={STEPS[2].subtitle} />
        ) : null}

      </div>

      <ScheduleFooter
        step={step}
        onConfirm={handleConfirm}
        isPending={isPending}
      />

      <SuccessModal open={showSuccess} onClose={handleDone} onViewHistory={handleViewHistory} />
    </div>
  );
}