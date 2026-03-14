"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "@/routes/hooks/use-router";

type Props = {
    name?: string;
};

export function WelcomeMessage({
    name = "John Doe",
}: Props) {

    const router = useRouter();

    const handleSchedulePickup = () => {
        router.push("/app/schedule"); // takes the user to the schedule pickup page
    };

    return (
        <div className="flex justify-between flex-wrap gap-4 p-8 pb-0">
            <h1 className="text-2xl font-bold">
                Welcome, {name}
            </h1>

            <Button
                onClick={handleSchedulePickup}
                className="group border-[#344E41] text-[#344E41] hover:bg-[#618171] hover:border-[#618171] hover:text-white transition-colors duration-200"
                variant="outline"
                size="lg"
            >
                <Plus className="mr-2 h-4 w-4 text-[#344E41] group-hover:text-white transition-colors duration-200" />
                Schedule Pickup
            </Button>
        </div>
    );
}

export default WelcomeMessage;