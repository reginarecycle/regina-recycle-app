import LearnCards from "./LearnCards"
import Cans from "@/assets/cans-photo.svg"
import Boxes from "@/assets/boxes-img.svg"
import Verified from "@/assets/icons/verfied-icon.svg"
import Warning from "@/assets/icons/warning-icon.png"
import Compostable from "@/assets/icons/compostable-icon.png"
import Garbage from "@/assets/icons/garbage-icon.svg"

export function Main() {
    return (
        <div className="-mt-15">
            <div className="w-full px-4 py-10 md:py-78 lg:py-68.5 bg-gray-50/50">
                <div className="max-w-6xl mx-auto">
                    <div className="max-w-5xl mx-auto pl-2 md:pl-4 lg:pl-8 pr-2 md:pr-0 lg:pr-4">

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
                            <LearnCards
                                photo={Cans}
                                title="Cans"
                                category="Recyclables"
                                description="krljrjntprp"
                                icon={Warning}
                                subtext="4t4kp4p5pkp"
                            />

                            <LearnCards
                                photo={Boxes}
                                title="somethingjejfhdskjfhsdkjfh"
                                category="Recyclables"
                                description="idk"
                                icon={Warning}
                                subtext="4t4kp4p5pkp"
                            />

                            <LearnCards
                                photo={Cans}
                                title="Cans"
                                category="Garbage"
                                description="krljrjntprp"
                                icon={Compostable}
                                subtext="4t4kp4p5pkphello"
                            />

                            <LearnCards
                                photo={Cans}
                                title="Cans"
                                category="Recyclables"
                                description="krljrjntprp"
                                icon={Warning}
                                subtext="4t4kp4p5pkp"
                            />

                            <LearnCards
                                photo={Cans}
                                title="Cans"
                                category="Recyclables"
                                description="krljrjntprp"
                                icon={Verified}
                                subtext="4t4kp4p5pkpksjh"
                            />

                            <LearnCards
                                photo={Cans}
                                title="Cans"
                                category="Recyclables"
                                description="krljrjntprp"
                                icon={Verified}
                                subtext="4t4kp4p5pkp"
                            />

                            <LearnCards
                                photo={Cans}
                                title="Cans"
                                category="Recyclables"
                                description="krljrjntprp"
                                icon={Garbage}
                                subtext="this is a test"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



export default Main;