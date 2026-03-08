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
                <Button className="search-button" size={'lg'} variant={'secondary'}>Search</Button>
            </div>

            <div className="mt-[14px]">
                <div className="flex gap-2.75 text-[12px]">
                    <Button className="all-button gap-[11px]" size={'lg'} variant={'secondary'}>
                        <BadgeCheck className="size-6" />
                        All
                    </Button>
                    <Button className="recyclables-button gap-[11px]" size={'lg'} variant={'secondary'}>
                        <BadgeCheck className="size-6" />
                        Recyclables
                    </Button>
                    <Button className="hazardous-button gap-[11px] bg-[#FFFFFF]" variant={'outline'} size={'lg'}>
                        <TriangleAlert className="size-6" />
                        Hazardous
                    </Button>
                    <Button className="compost-button gap-[11px] bg-[#FFFFFF]" variant={'outline'} size={'lg'}>
                        <Sprout className="size-6" />
                        Compost
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default SearchBar

