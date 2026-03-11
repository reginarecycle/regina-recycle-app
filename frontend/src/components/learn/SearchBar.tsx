import { BadgeCheck, Sprout, TriangleAlert, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Category = 'Recyclable' | 'Garbage' | 'Compostable' | 'Hazardous';

interface SearchBarProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    activeCategory: string
    onCategoryClick: (category: Category | string) => void
}

function SearchBar({
    searchTerm,
    onSearchChange,
    activeCategory,
    onCategoryClick,
}: SearchBarProps) {
    return (
        <div className="search-bar bg-[#FFFFFF] relative w-full max-w-[897px] sm:max-w-[600px] md:max-w-[750px] lg:max-w-[897px] mx-auto">
            <div className="relative flex items-center gap-3">
                <div className="flex-1 min-w-[160px] sm:min-w-[250px] md:min-w-[400px] lg:min-w-[600px]">
                    <Input
                        name="myInput"
                        type="text"
                        placeholder="Search for items (e.g. ‘Milk Container’, ‘Battery’ )"
                        className="flex-1"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <Button
                    className="search-button sm:w-auto"
                    size={'lg'}
                    variant={'secondary'}
                >
                    Search
                </Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                <div className="flex gap-2.75 text-[12px]">
                    <Button
                        className="all-button flex items-center gap-[11px] min-w-[66px]"
                        size={'lg'}
                        // variant={activeCategory === "All" ? "secondary" : "outline"}
                        onClick={() => onCategoryClick("All")}
                    >
                        <BadgeCheck className="size-6" />
                        All
                    </Button>

                    <Button
                        className="recyclables-button flex items-center gap-[11px] min-w-[116px]"
                        size={'lg'}
                        variant={activeCategory === "Recyclable" ? "secondary" : "outline"}
                        onClick={() => onCategoryClick("Recyclable")}
                    >
                        <BadgeCheck className="size-6" />
                        Recyclables
                    </Button>

                    <Button
                        className="hazardous-button flex items-center gap-[11px] min-w-[110px]"
                        size={'lg'}
                        variant={activeCategory === "Hazardous" ? "secondary" : "outline"}
                        onClick={() => onCategoryClick("Hazardous")}
                    >
                        <TriangleAlert className="size-6" />
                        Hazardous
                    </Button>

                    <Button
                        className="compost-button flex items-center gap-[11px] min-w-[111px]"
                        size={'lg'}
                        variant={activeCategory === "Compostable" ? "secondary" : "outline"}
                        onClick={() => onCategoryClick("Compostable")}
                    >
                        <Sprout className="size-6" />
                        Compost
                    </Button>

                    <Button
                        className="garbage-button flex items-center gap-[11px] min-w-[111px]"
                        size={'lg'}
                        variant={activeCategory === "Garbage" ? "secondary" : "outline"}
                        onClick={() => onCategoryClick("Garbage")}
                    >
                        <Trash2 className="size-6" />
                        Garbage
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default SearchBar