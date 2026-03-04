import LearnCard from "./LearnCard"
import Cans from "@/assets/cans-photo.svg"
import Boxes from "@/assets/boxes-img.svg"
// import LearnButton from "./LearnButton";

export function Main() {
    return (
        <div className="w-full min-h-[1100px] py-10 px-4 flex-c">
            <div className="cards-wrapper -ml-4 w-full h-full
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              lg:grid-cols-3 
              gap-6 md:gap-8 
              justify-items-center lg:justify-items-end"
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

            </div >
            {/* <div className=" bottom-8 left-1/2 -translate-x-1/2 z-50">
                <LearnButton />
            </div> */}
        </div >
    );
}



export default Main;