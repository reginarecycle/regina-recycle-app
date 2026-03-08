import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type props = {
    name: string;
}

export function WelcomeMessage({
    name = "John Doe",
}: props) {
    return (
        <div className="welcome-wrapper">
            <h1 className="welcome-message">Welcome, {name}</h1>

            <Button
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