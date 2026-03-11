import LearnCard from "./LearnCard"
import Cans from "@/assets/cans-photo.svg"
import Boxes from "@/assets/boxes-img.svg"

export function Main() {
    return (
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
                    <LearnCard
                        photo={Cans}
                        category="Recyclable"
                        title="Cans"
                        description="can be recycled"
                        subtext="something"
                    />

                    <LearnCard
                        photo={Boxes}
                        category="Recyclable"
                        title="Cardboard Boxes"
                        description="can be recycled"
                        subtext="These are Cardboard"
                    />

                    <LearnCard
                        photo={Cans}
                        category="Recyclable"
                        title="Cans"
                        description="can be recycled"
                        subtext="something"
                    />

                    <LearnCard
                        photo={Cans}
                        category="Recyclable"
                        title="Cans"
                        description="can be recycled"
                        subtext="something"
                    />

                    <LearnCard
                        photo={Cans}
                        category="Recyclable"
                        title="Cans"
                        description="can be recycled"
                        subtext="something"
                    />

                    <LearnCard
                        photo={Cans}
                        category="Recyclable"
                        title="Cans"
                        description="can be recycled"
                        subtext="something"
                    />

                    <LearnCard
                        photo={Cans}
                        category="Recyclable"
                        title="Cans"
                        description="can be recycled"
                        subtext="something"
                    />
                </div>

            </div>
        </div>
    );
}

export default Main;