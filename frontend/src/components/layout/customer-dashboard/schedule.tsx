import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card.tsx";
import { ChevronRight, } from "lucide-react";
import { ScheduleEntry } from "./schedule-entry";

export function Schedule() {
    return (

        <div className="schedule-content">
            <Card className="bg-[#FFFFFF]">
                <CardHeader className="schedule-title">
                    <div>Recent Schedule</div>
                    <div className="view-more-link flex items-center gap-1">
                        View More
                        <ChevronRight className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardTitle className="-mt-6">
                    <div className="schedule-headings">
                        <h2 className="material-heading">Material</h2>
                        <h2 className="schedule-heading">Schedule Date</h2>
                        <h2 className="status-heading">Status</h2>
                        <h2 className="action-heading">Action</h2>
                    </div>
                </CardTitle>
                <CardContent className="-m-6">
                    {/* <table className="schedule-table "> */}
                    {/* <tr className="schedule-headings"> 
                            <th className="material-heading">Material</th>
                            <th className="schedule-heading">Schedule Date</th>
                            <th className="status-heading">Status</th>
                            <th className="action-heading">Action</th>
                        </tr> */}
                    <ScheduleEntry
                        material1={'Glass'}
                        date={new Date("2026-1-1")}
                        status={'Pending'}
                    />
                    <ScheduleEntry
                        material1={'Cardboard'}
                        material2={'Glass'}
                        date={new Date()}
                        status={'Approved'}
                    />
                    <ScheduleEntry
                        material1={'Cardboard'}
                        material2={'Glass'}
                        material3={'Plastic'}
                        date={new Date()}
                        status={'Not Started'}
                    />
                    {/* </table> */}
                    {/* <ScheduleEntry /> */}
                </CardContent>
            </Card>
        </div>
    )
}

export default Schedule;