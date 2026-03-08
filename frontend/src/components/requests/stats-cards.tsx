import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import PurpleCalendar from "@/assets/purple-calendar.svg"
import YellowArrow from "@/assets/yellow-arrow.svg"
import GreenBox from "@/assets/green-box.svg"

type StatsCardsProps = {
    title: string;
    data: number;
    unit: string;
    color?: 'green' | 'purple' | 'yellow' | string;
    currency?: string;
};

export function StatsCards({
    title = "default",
    data = 0,
    unit = "units",
    color = "green",
    currency = "",
}: StatsCardsProps) {

    const titleColorClass = "white";

    const colorThemes = {
        green: {
            accent: 'text-[#22C55E]',
            icon: GreenBox,
        },
        purple: {
            accent: 'text-[#A855F7]',
            icon: PurpleCalendar,
        },
        yellow: {
            accent: 'text-[#F59E0B]',
            icon: YellowArrow,
        },
    };

    const theme = colorThemes[color as keyof typeof colorThemes] || colorThemes.green;

    const isCustomHex = typeof color === 'string' && (color.startsWith('#') || color.startsWith('rgb'));

    const accentClass = isCustomHex
        ? `text-[${color}]`
        : (theme.accent || 'text-[#22C55E]');

    const formattedData =
        color === "yellow"
            ? data.toLocaleString()
            : data;

    const Icon = theme.icon;

    return (
        <Card
            className={`
                stats-card
                rounded-lg
                shadow-sm
                bg-white
                w-full
                h-[112px]
                flex-row
                gap-3.5
                pt-6
                pr-8.75
                pl-6
                pb-6
                sm:p-5
                w-full
        max-w-[381px]
        min-h-[110px]
        rounded-lg
        shadow-sm
        items-center
                }
            `}
        >
            <img src={Icon} alt={`${color} icon`} className="w-10 h-10 sm:w-12 sm:h-12" />

            <CardContent className="card-txt flex-col px-0">
                <div className="text-[#999CA0] text-sm sm:text-base">{title}</div>
                <div className="h-[38px] w-fitflex items-baseline gap-2">
                    <span className={` text-2xl sm:text-3xl font-bold mr-1.5 ${accentClass}`}>
                        {currency}{formattedData}
                    </span>
                    <span className={`text-xs sm:text-sm font-medium text-[#999CA0]`}>
                        {unit}
                    </span>
                </div>

            </CardContent>
        </Card>
    );
}