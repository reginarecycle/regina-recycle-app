import { Card, CardTitle, CardContent } from "@/components/ui/card";
import GreenLightBulb from "@/assets/green-lighbulb.svg";

export function DashboardTip() {
    return (
        <Card className="w-full max-w-[288px] rounded-xl border border-[#344E41] bg-[#344E4117] shadow-none p-4">
            <div className="flex items-start gap-3">

                {/* icon container */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                    <img
                        src={GreenLightBulb}
                        alt="Tip icon"
                    />
                </div>

                {/* text content */}
                <div className="flex flex-col gap-1 min-w-0">
                    <CardTitle className="text-[16px] font-semibold text-[#344E41]">
                        Tip of the day
                    </CardTitle>

                    <CardContent className="p-0 text-[14px] leading-5 text-[#111827BF]">
                        Rinse milk containers before storage to ensure that they don’t smell.
                    </CardContent>
                </div>

            </div>
        </Card>
    );
}

export default DashboardTip;