import { Card, CardTitle, CardContent } from "@/components/ui/card";
import GreenLightBulb from "@/assets/green-lighbulb.svg"
// import { Lightbulb } from "lucide-react";

export function DashboardTip() {
    return (
        <Card className="dashboard-tip-card pb-100 bg-[#344E41]/25 ">
            {/* <Lightbulb className="tip-img" /> */}
            <img className="tip-img" src={GreenLightBulb} />
            <div className="content">
                <CardTitle className="tip-title">
                    Tip of the Day
                </CardTitle>
                <CardContent className="tip -px-6">
                    Rinse milk containers before storage to ensure that they don’t smell.
                </CardContent>
            </div>
        </Card>
    )
}

export default DashboardTip;
