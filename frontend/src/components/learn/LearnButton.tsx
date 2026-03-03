import { Button } from "../ui/button"
import { ChevronDown } from "lucide-react"

export function LearnButton() {
    return (

        <Button className="load-more-btn" variant={"outline"}>
            Load More
            <ChevronDown />
        </Button>
    )
}

export default LearnButton