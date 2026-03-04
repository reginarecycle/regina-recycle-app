import { Card, CardFooter, CardContent } from "@/components/ui/card"
import Verified from "@/assets/icons/verfied-icon.svg"
import Warning from "@/assets/icons/warning-icon.png"
import Compostable from "@/assets/icons/compostable-icon.png"
import Garbage from "@/assets/icons/garbage-icon.svg"
import WarningIcon from "@/assets/icons/grey-warning-icon.svg"

type props = {
    photo: string;
    category: 'Recyclable' | 'Garbage' | 'Compostable' | 'Hazardous';
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
    // Map category → correct icon
    const getIcon = () => {
        switch (category) {
            case "Recyclable":
                return Verified;
            case "Garbage":
                return Garbage;
            case "Compostable":
                return Compostable;
            case "Hazardous":
                return Warning; // or another icon if you prefer
            default:
                return Verified; // fallback
        }
    };
    const iconSrc = getIcon();
    return (
        <Card className="learn-card flex">
            <CardContent>

                <img
                    className="absolute top-0.5 left-[37px] w-[209px] h-[173px]"
                    alt="card-img"
                    src={photo}
                />
            </CardContent>
            <CardFooter>
                <div className="absolute w-full h-[57.83%] top-0 left-0">
                    <div className="w-[100%] h-[100%] top-0 bg-[#00000066] rounded-[12px_12px_0px_0px] rotate-[-0.15deg] absolute left-0" />

                    <div className="flex w-[100px] h-[23px] items-center justify-center px-[17px] py-px absolute top-[152px] left-[173px] bg-[#618171] rounded-[4px_0px_0px_0px] right-[17px]">
                        {/* <span className="relative flex items-center justify-center w-fit font-text-xs-medium font-[number:var(--text-xs-medium-font-weight)] text-white text-[length:var(--text-xs-medium-font-size)] text-center tracking-[var(--text-xs-medium-letter-spacing)] leading-[var(--text-xs-medium-line-height)] whitespace-nowrap [font-style:var(--text-xs-medium-font-style)]"> */}
                        <span className="category-txt">
                            {category}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col w-[247px] items-start gap-2.5 absolute top-[191px] left-3.5">
                    <div className="flex flex-col w-[53px] items-start gap-[7px] relative flex-[0_0_auto]">
                        <h2 className="card-title">
                            {title}
                        </h2>

                        <p className="card-description">
                            {description}
                        </p>
                    </div>

                    <div className="inline-flex items-center relative flex-[0_0_auto]">
                        <div className="warning-label">
                            <img src={WarningIcon} className="h-[24px] w-[24px]" />
                            <p className="warning-label-txt">
                                {subtext}
                            </p>
                        </div>
                    </div>
                </div>
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



