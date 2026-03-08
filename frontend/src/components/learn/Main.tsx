import LearnCard from "./LearnCard"
import Cans from "@/assets/cans-photo.svg"
import Boxes from "@/assets/boxes-img.svg"
// import LearnButton from "./LearnButton";

export function Main() {
    return (
        <>
            <div className="w-full px-4 py-10 md:py-78 lg:py-68.5 bg-gray-50/50 ">
                <div className="max-w-5xl mx-auto pl-2 md:pl-4 lg:pl-8 pr-2 md:pr-0 lg:pr-4 ml-[26.8%]">

                    <div
                        className="
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              lg:grid-cols-3 
              gap-6 md:gap-8 
              justify-items-center lg:justify-items-end
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
                            subtext="These are Carboard"
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
        </>
    );
}



export default Main;