import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type Props = {
    name?: string;
    onSchedulePickup?: () => void;
};

export function WelcomeMessage({
    name = "John Doe",
    onSchedulePickup,
}: Props) {
    return (
        <div className="flex justify-between flex-wrap gap-4 p-8 pb-0">
            <h1 className="text-2xl font-bold">
                Welcome, {name}
            </h1>

            <Button
                onClick={onSchedulePickup}
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