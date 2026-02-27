import Warning from "@/assets/icons/grey-warning-icon.svg"
// import type { Url } from "url"

type props = {
    photo: string;
    category: string
    title: string
    description: string
    subtext: string
    icon: string
}

function LearnCards({
    photo,
    category = "something",
    title = "title",
    description = "This is the description",
    subtext = "This is a warning label",
    icon,
}: props) {
    return (
        <article className="relative w-[275px] h-[303px]">
            <div className="absolute w-[275px] h-[303px] top-0 left-42.5">
                <div className="top-px w-[275px] h-[302px] bg-reginarecycle-page-background rounded-xl shadow-[0px_0px_4px_#00000040] absolute left-0" />

                <img
                    className="absolute top-0.5 left-[37px] w-[209px] h-[173px]"
                    alt="card-img"
                    src={photo}
                />

                <div className="absolute w-full h-[57.83%] top-0 left-0">
                    <div className="w-[99.84%] h-[99.60%] top-0 bg-[#00000066] rounded-[12px_12px_0px_0px] rotate-[-0.15deg] absolute left-0" />

                    <div className="flex w-[102px] h-[23px] items-center justify-center gap-2.5 px-[17px] py-px absolute top-[152px] left-[173px] bg-[#618171] rounded-[4px_0px_0px_0px]">
                        <span className="relative flex items-center justify-center w-fit font-text-xs-medium font-[number:var(--text-xs-medium-font-weight)] text-white text-[length:var(--text-xs-medium-font-size)] text-center tracking-[var(--text-xs-medium-letter-spacing)] leading-[var(--text-xs-medium-line-height)] whitespace-nowrap [font-style:var(--text-xs-medium-font-style)]">
                            {category}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col w-[247px] items-start gap-2.5 absolute top-[191px] left-3.5">
                    <div className="flex flex-col w-[53px] items-start gap-[7px] relative flex-[0_0_auto]">
                        <h2 className="relative flex items-center justify-left self-stretch mt-[-1.00px] font-text-xs-medium font-[number:var(--text-xs-medium-font-weight)] text-black text-[length:var(--text-xs-medium-font-size)] tracking-[var(--text-xs-medium-letter-spacing)] leading-[var(--text-xs-medium-line-height)] [font-style:var(--text-xs-medium-font-style)]">
                            {title}
                        </h2>

                        <p className="relative flex items-center justify-left self-stretch font-text-xs-medium font-[number:var(--text-xs-medium-font-weight)] text-black text-[length:var(--text-xs-medium-font-size)] text-center tracking-[var(--text-xs-medium-letter-spacing)] leading-[var(--text-xs-medium-line-height)] [font-style:var(--text-xs-medium-font-style)]">
                            {description}
                        </p>
                    </div>

                    <div className="flex flex-col h-[43px] items-start gap-2.5 px-2.5 py-[5px] relative self-stretch w-full bg-reginarecycle-card-background">
                        <div className="inline-flex items-center gap-[15px] relative flex-[0_0_auto]">
                            <div className="warning-label">
                                <img src={Warning}></img>
                                <p className="relative flex items-center justify-center w-fit [font-family:'Satoshi-Medium',Helvetica] font-medium text-black text-xs text-center tracking-[0] leading-4 whitespace-nowrap">
                                    {subtext}
                                </p>
                            </div>
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
                                src={icon}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default LearnCards




