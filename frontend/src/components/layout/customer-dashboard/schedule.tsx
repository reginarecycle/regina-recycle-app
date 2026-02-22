import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card.tsx";
import { ChevronRight, } from "lucide-react";

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
                <CardContent>
                    stuff
                </CardContent>
                <CardFooter></CardFooter>
            </Card>
        </div>
    )
}

export default Schedule;