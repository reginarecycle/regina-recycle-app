import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSchedule } from "@/components/scheduleView/ScheduleContext";
import { ScheduleFooter } from "@/components/scheduleView/ScheduleFooter";
import { CollapsedStep } from "@/components/scheduleView/CollapsedStep";
import { SuccessModal } from "@/components/scheduleView/SuccessModal";
import Step1Items from "./Step1Items";
import Step2Time from "./Step2Time";
import Step3Location from "./Step3Location";

type Step = 1 | 2 | 3;

// ── Main stepper ──────────────────────────────────────────────────────────────

const STEPS = [
  { title: "What are we collecting?",     subtitle: "Select the category of material for pickup" },
  { title: "Select Pickup Time",          subtitle: "Select a suitable time for pickup" },
  { title: "Location Details",            subtitle: "Select a pickup address" },
];

export default function SchedulePickupFlow() {
  const navigate = useNavigate();
  const { resetScheduleData } = useSchedule();
  const [step, setStep] = useState<Step>(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConfirm = () => setShowSuccess(true);

  const reset = () => {
    setShowSuccess(false);
    resetScheduleData();
    setStep(1);
  };

  const handleDone        = () => reset();
  const handleViewHistory = () => { reset(); navigate("/app/history"); };

  return (
    <div className="flex min-h-screen flex-col px-4 sm:px-6 py-4">
      <div className="flex-1 space-y-4 pb-24 sm:pb-27.5">

        {/* Step 1 */}
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

        {/* Step 2 */}
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

        {/* Step 3 */}
        {step === 3 ? (
          <Step3Location onBack={() => setStep(2)} />
        ) : step < 3 ? (
          <CollapsedStep number={3} title={STEPS[2].title} subtitle={STEPS[2].subtitle} />
        ) : null}

      </div>

      <ScheduleFooter step={step} onConfirm={handleConfirm} />

      <SuccessModal open={showSuccess} onClose={handleDone} onViewHistory={handleViewHistory} />
    </div>
  );
}
