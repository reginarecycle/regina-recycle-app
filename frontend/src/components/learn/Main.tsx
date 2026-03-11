import { useState, useMemo } from "react"
import LearnCard from "./LearnCard"
import Cans from "@/assets/cans-photo.svg"
import Boxes from "@/assets/boxes-img.svg"
import SearchBar from "@/components/learn/SearchBar"

type Category = "Recyclable" | "Garbage" | "Compostable" | "Hazardous"

//constant data for testing until we can pass actual data through
const allItems: Array<{
    photo: string
    category: Category
    title: string
    description: string
    subtext: string
}> = [
        { photo: Cans, category: "Recyclable", title: "Cans", description: "can be recycled", subtext: "something" },
        { photo: Boxes, category: "Recyclable", title: "Cardboard Boxes", description: "can be recycled", subtext: "These are Cardboard" },
        { photo: Cans, category: "Hazardous", title: "Batteries", description: "handle with care", subtext: "toxic" },
        { photo: Cans, category: "Compostable", title: "Banana Peels", description: "compost", subtext: "organic" },
        { photo: Cans, category: "Recyclable", title: "Cans", description: "can be recycled", subtext: "something" },
        { photo: Cans, category: "Garbage", title: "Plastic Bag", description: "general waste", subtext: "not recyclable" },
        { photo: Cans, category: "Garbage", title: "Used Tissue", description: "general waste", subtext: "not recyclable" },
    ]

export function Main() {
    const [searchTerm, setSearchTerm] = useState("")
    // Now using Category | string instead of a named union with "All"
    const [activeCategory, setActiveCategory] = useState<Category | string>("All")

    const visibleItems = useMemo(() => {
        const term = searchTerm.toLowerCase().trim()

        return allItems.filter(item => {
            // Category filter
            if (activeCategory !== "All" && item.category !== activeCategory) {
                return false
            }

            // Text search
            if (!term) return true

            return (
                item.title.toLowerCase().includes(term) ||
                item.description.toLowerCase().includes(term) ||
                item.subtext.toLowerCase().includes(term) ||
                item.category.toLowerCase().includes(term)
            )
        })
    }, [searchTerm, activeCategory])

    return (
        <>
            <div className="pt-4 md:pt-6">
                {/* import the search bar */}
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    activeCategory={activeCategory}
                    onCategoryClick={setActiveCategory}
                />
            </div>

            <div className="w-full bg-gray-50/50 py-10 sm:py-10 lg:py-14 px-4">
                {/* Page Container */}
                <div className="w-full max-w-[897px] mx-auto">
                    {/* Card Grid */}
                    <div
                        className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-3
              gap-6
              sm:gap-8
              justify-items-center
            "
                    >
                        {/* using the list of constant data create a bunch of cards */}
                        {visibleItems.map((item, i) => (
                            <LearnCard
                                key={i}
                                photo={item.photo}
                                category={item.category}
                                title={item.title}
                                description={item.description}
                                subtext={item.subtext}
                            />
                        ))}
                    </div>

                    {visibleItems.length === 0 && (
                        <p className="text-center mt-12 text-gray-500">
                            No items found
                        </p>
                    )}
                </div>
            </div>
        </>
    )
}

export default Main