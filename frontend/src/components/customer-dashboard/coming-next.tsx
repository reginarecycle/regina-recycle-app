import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import TruckIcon from "@/assets/truck-icon.svg"
import Ellipse from "@/assets/Ellipse 209.svg"
import Line from "@/assets/Line 7.svg"
import { MapPin, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

type props = {
    pickup: string;
    date: string;
    time: string;
    address: string;
    bagNumber: number;
}

export function ComingNext({
    pickup = "Doorstep Pickup",
    date = "",
    time = "",
    address = "123 Lane, Str. ",
    bagNumber = 0,
}:
    props) {
    return (
        <div className="upcoming-content">
            <Card className="bg-[#FFFFFF]">
                <CardHeader className="upcoming-title">Coming up Next</CardHeader>
                <CardContent className="upcoming-main">
                    <div className="info-wrapper">
                        <div className="truck-img">
                            <img className="truck-img" src={TruckIcon} />
                        </div>
                        <div className="pickup-info">
                            <h1>{pickup}</h1>
                            <h2>{date}
                                <img className="ellipse w-1 h-1" src={Ellipse} />
                                {time}
                            </h2>
                            <h3 className="address-bags">
                                <MapPin className="h-6 w-6 -mt-0.5 mr-1" />
                                {address}
                                <img className="bar-icon h-4 w-4" src={Line} />
                                <ShoppingBag className="h-6 w-6 -mt-0.5 mr-1" />
                                {bagNumber} bags
                            </h3>
                        </div>
                    </div>
                    <div className="pickup-buttons flex gap-3">
                        <Button
                            className="text-[#344E41] border-[#344E41] font-bold text-[14px] hover:bg-[#344E41] hover:text-white transition-colors duration-200"
                            variant={"outline"}
                            size={"lg"}
                        >
                            Reschedule
                        </Button>

                        <Button
                            className="text-[#DD1E1E] border-[#DD1E1E] font-bold text-[16px] hover:bg-[#DD1E1E] hover:text-white transition-colors duration-200"
                            variant={"outline"}
                            size={"lg"}
                        >
                            Cancel
                        </Button>
                    </div>
                </CardContent>
                <CardFooter></CardFooter>
            </Card>
        </div>
    )
}

export default ComingNext;