import { BadgeCheck, Sprout, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";

function SearchBar() {
    return (
        <div className="search-bar bg-[#FFFFFF] relative">
            <div className="relative flex justify-between">
                <div>
                    {/* <Search className="search-icon size-3.5 absolute left-6 top-1/3" strokeWidth={3} /> */}
                    <Input name="myInput" type="text" placeholder="Search for items (e.g. ‘Milk Container’, ‘Battery’ )" />
                </div>
                <Button className="search-button">Search</Button>
            </div>

            <div className="mt-[14px]">
                <div className="flex gap-2.75">
                    <Button className="all-button" size={'lg'}>
                        <BadgeCheck className="size-6" />
                        All
                    </Button>
                    <Button className="recyclables-button" size={'lg'}>
                        <BadgeCheck className="size-6" />
                        Recyclables
                    </Button>
                    <Button className="hazardous-button bg-[#FFFFFF]" variant={'secondary'} size={'lg'}>
                        <TriangleAlert className="size-6" />
                        Hazardous
                    </Button>
                    <Button className="compost-button bg-[#FFFFFF]" variant={'secondary'} size={'lg'}>
                        <Sprout className="size-6" />
                        Compost
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default SearchBar

