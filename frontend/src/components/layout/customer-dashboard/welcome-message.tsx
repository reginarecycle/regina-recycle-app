import { Button } from "@/components/ui/button";
import { Plus, } from "lucide-react";

type props = {
    name: string;
}

export function WelcomeMessage({
    name = "John Doe",
}:
    props) {
    return (
        <div className="welcome-wrapper">
            <h1 className="welcome-message">Welcome {name}</h1>
            <Button
                className="request-pickup-btn"
                variant="outline"
                size="lg"
            >
                <Plus />
                Schedule Pickup</Button>
        </div>
    )
}

export default WelcomeMessage;