import { Card } from "@/components/ui/card";
import GreenLightBulb from "@/assets/green-lighbulb.svg";

const TIP = "Rinse milk containers before storage to ensure that they don't smell.";

export function DashboardTip() {
  return (
    <Card className="w-full rounded-xl border border-primary/30 bg-primary/10 shadow-none p-4">
      <div className="flex items-start gap-3">
        <img src={GreenLightBulb} alt="Tip icon" className="w-10 h-10 shrink-0" />
        <div className="flex flex-col gap-1 min-w-0">
          <p className="text-sm font-semibold text-primary">Tip of the day</p>
          <p className="text-sm text-foreground/75 leading-5">{TIP}</p>
        </div>
      </div>
    </Card>
  );
}

export default DashboardTip;
