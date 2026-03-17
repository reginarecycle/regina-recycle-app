import { Card, CardHeader, CardFooter } from "@/components/ui/card";

type StatsCardsProps = {
    title: string;
    data: number;
    unit: string;
    color?: "red" | "green" | "blue" | "gold" | string;
    currency?: string;
};

export function StatsCards({
    title = "default",
    data = 0,
    unit = "units",
    color = "blue",
    currency = "",
}: StatsCardsProps) {
    const colorThemes = {
        red: {
            accent: "text-[#CA4F4F]",
            bg: "bg-white",
            border: "border-[#CFCFCF]",
        },
        green: {
            accent: "text-[#7A9085]",
            bg: "bg-white",
            border: "border-[#CFCFCF]",
        },
        blue: {
            accent: "text-[#0171B6]",
            bg: "bg-white",
            border: "border-[#CFCFCF]",
        },
        gold: {
            accent: "text-[#A16207]",
            bg: "bg-[#FCF7E8]",
            border: "border-[#C58A2A]",
        },
    };

    const isCustomHex =
        typeof color === "string" &&
        (color.startsWith("#") || color.startsWith("rgb"));

    const theme =
        !isCustomHex && colorThemes[color as keyof typeof colorThemes]
            ? colorThemes[color as keyof typeof colorThemes]
            : colorThemes.blue;

    const displayValue = color === "gold" ? data.toFixed(2) : data.toString();

    return (
        <Card
            className={`
        w-full min-w-0
        min-h-[140px] sm:min-h-[166px]
        rounded-xl border shadow-none
        px-4 py-4 sm:px-6 sm:py-5
        flex flex-col justify-between
        overflow-hidden
        ${theme.bg}
        ${theme.border}
      `}
        >
            <CardHeader className="p-0">
                <h3 className="text-[14px] sm:text-[16px] leading-5 sm:leading-6 font-semibold text-[#4B5563] break-words">
                    {title}
                </h3>
            </CardHeader>

            <CardFooter className="p-0 flex items-end flex-wrap gap-x-1 gap-y-1">
                <span
                    className={`
            text-[32px] sm:text-[40px] lg:text-[48px]
            leading-none font-bold tracking-tight break-words
            ${isCustomHex ? "" : theme.accent}
          `}
                    style={isCustomHex ? { color } : undefined}
                >
                    {currency}
                    {displayValue}
                </span>

                <span
                    className={`
            text-[14px] sm:text-[16px] align-baseline
            leading-5 sm:leading-6 font-medium pb-0 sm:pb-1
            ${isCustomHex ? "" : theme.accent}
          `}
                    style={isCustomHex ? { color } : undefined}
                >
                    {unit}
                </span>
            </CardFooter>
        </Card>
    );
}