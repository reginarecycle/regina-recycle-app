import { Card, CardFooter, CardContent } from "@/components/ui/card"
import Verified from "@/assets/icons/verfied-icon.svg"
import Warning from "@/assets/icons/warning-icon.png"
import Compostable from "@/assets/icons/compostable-icon.png"
import Garbage from "@/assets/icons/garbage-icon.svg"
import WarningIcon from "@/assets/icons/grey-warning-icon.svg"

type Category = 'Recyclable' | 'Garbage' | 'Compostable' | 'Hazardous';

type props = {
    photo: string;
    category: Category;
    title: string
    description: string
    subtext: string
}

function LearnCard({
    photo,
    category = "Recyclable",
    title = "Cans",
    description = "This is a description",
    subtext = "This is a warning label",
}: props) {
    // Icon mapping (unchanged)
    const getIcon = () => {
        switch (category) {
            case "Recyclable": return Verified;
            case "Garbage": return Garbage;
            case "Compostable": return Compostable;
            case "Hazardous": return Warning;
            default: return Verified;
        }
    };

    const iconSrc = getIcon();

    // New: Category badge background color
    const getBadgeBgColor = () => {
        switch (category) {
            case "Garbage": return "#999CA0";     // gray
            case "Compostable": return "#CA8A05";     // gold/yellow
            case "Hazardous": return "#FEE2E2";     // light red
            case "Recyclable":
            default: return "#618171";     // current green
        }
    };

    // New: Text color inside badge (only Hazardous needs red text)
    const badgeTextColor = category === "Hazardous" ? "#991B1B" : "white";

    return (
        <Card className="relative learn-card flex w-full max-w-[275.44px] overflow-hidden">
            {/* card img */}
            <CardContent className="!p-0">
                <img
                    className="absolute w-full h-43.25 top-0.5"
                    alt="card-img"
                    src={photo}
                />
            </CardContent>

            <CardFooter>
                {/* card text and labels */}
                <div className="absolute w-full h-[57.83%] top-0 left-0">
                    <div className="w-[100%] h-[100%] top-0 bg-[#00000066] rounded-[12px_12px_0px_0px] rotate-[-0.15deg] absolute left-0" />

                    {/* Category badge – only background & text color change here */}
                    <div
                        className="flex w-[100px] h-[23px] items-center justify-center px-[17px] py-px absolute top-[152px] left-[173px] rounded-[4px_0px_0px_0px] right-[17px]"
                        style={{ backgroundColor: getBadgeBgColor() }}
                    >
                        <span
                            className="category-txt"
                            style={{ color: badgeTextColor }}
                        >
                            {category}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col w-[247px] items-start gap-2.5 absolute top-[191px] left-3.5">
                    <div className="flex flex-col w-[53px] items-start gap-[7px] relative flex-[0_0_auto]">
                        <h2 className="card-title">{title}</h2>
                        <p className="card-description">{description}</p>
                    </div>

                    <div className="inline-flex items-center relative flex-[0_0_auto]">
                        <div className="warning-label">
                            <img src={WarningIcon} className="h-[24px] w-[24px]" alt="warning" />
                            <p className="warning-label-txt">{subtext}</p>
                        </div>
                    </div>
                </div>

                {/* Top-right icon circle – background stays #49b972 as before */}
                <div className="flex w-8 h-8 items-center justify-around gap-2.5 p-1 absolute top-[11px] left-[236px]">
                    <div className="inline-flex items-center absolute top-0 left-0">
                        <div className="relative w-8 h-8 rounded-2xl overflow-hidden">
                            <div className="absolute inset-0 bg-[#49b972]" />
                            <img
                                className="absolute inset-0 w-full h-full object-cover"
                                alt="card icon"
                                src={iconSrc}
                            />
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

export default LearnCard