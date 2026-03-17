import { Card, CardHeader, CardContent } from "@/components/ui/card";
import TruckIcon from "@/assets/truck-icon.svg";
import { MapPin, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/routes/hooks/use-router";

type Props = {
    pickup: string;
    date: string;
    time: string;
    address: string;
    bagNumber: number;
};

export function ComingNext({
    pickup = "Doorstep Pickup",
    date = "Jan. 25, 2026",
    time = "9:00AM -11:00AM",
    address = "123 Lane, Str.",
    bagNumber = 3,
}: Props) {

    const router = useRouter();

    const handlePickup = () => {
        router.push("/app/schedule"); // takes the user to the schedule pickup page
    };

    return (
        <Card className="w-full min-w-0 rounded-xl border border-[#CFCFCF] bg-white shadow-none overflow-hidden !py-1.5 min-h-[179px] ">
            <CardHeader className="border-b border-[#CFCFCF] px-6 !py-1">
                <h2 className="text-[17px] leading-7 font-semibold text-black">
                    Coming up next
                </h2>
            </CardHeader>

            <CardContent className="px-5 py-7 pt-0 sm:px-6 min-w-0">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between min-w-0">

                    <div className="flex items-start gap-4 sm:gap-5 min-w-0">
                        <div className="flex sm:h-[92px] sm:w-[92px] shrink-0 items-center justify-center rounded-full">
                            <img
                                src={TruckIcon}
                                alt="Truck icon"
                                className="shrink-0"
                            />
                        </div>

                        <div className="min-w-0">
                            <h3 className="text-[24px] leading-8 font-semibold text-[#111827] break-words">
                                {pickup}
                            </h3>

                            <div className="mt-1 font-bold flex flex-wrap items-center gap-x-3 gap-y-1 text-[16px] leading-6 text-[#111827]">
                                <span className="break-words">{date}</span>
                                <span className="h-1.5 w-1.5 font-bold rounded-full bg-[#6B7280] shrink-0" />
                                <span className="break-words">{time}</span>
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-[16px] leading-6 text-[#111827BF]">
                                <div className="flex items-center min-w-0">
                                    <MapPin className="mr-1.5 h-5 w-5 text-[#111827BF] shrink-0" />
                                    <span className="break-words">{address}</span>
                                </div>

                                <span className="hidden sm:block h-5 w-px bg-[#9CA3AF] shrink-0" />

                                <div className="flex items-center text-[#111827BF] shrink-0">
                                    <ShoppingBag className="mr-1.5 h-5 w-5 text-[#111827BF] shrink-0" />
                                    <span>{bagNumber} bags</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center lg:justify-end shrink-0">
                        <Button
                            onClick={handlePickup}
                            variant="outline"
                            className="h-[46px] rounded-xl border-[#DD1E1E] px-6 text-[16px] min-w-[84px]
                            font-semibold text-[#DD1E1E] hover:bg-[#DD1E1E] hover:text-white"
                        >
                            Cancel
                        </Button>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
}

export default ComingNext;