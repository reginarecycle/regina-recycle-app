import { Card, CardHeader, CardFooter } from "@/components/ui/card";

type StatsCardsProps = {
    title: string;
    data: number;
    unit: string;
    color?: 'red' | 'green' | 'blue' | 'gold' | string;  // theme name or custom hex
    currency?: string;
};

export function StatsCards({
    title = "default",
    data = 0,
    unit = "units",
    color = "blue",
    currency = "",
}: StatsCardsProps) {

    // Fixed neutral title color (same for all cards)
    const titleColorClass = "text-gray-700";

    // Color themes — accent for number + unit
    const colorThemes = {
        red: {
            accent: 'text-[#CA4F4F]',
        },
        green: {
            accent: 'text-[#7A9085]',
        },
        blue: {
            accent: 'text-[#0171B6]',
        },
        gold: {
            accent: 'text-[#854D0E]',
        },
    };

    // Get theme or fallback to blue
    const theme = colorThemes[color as keyof typeof colorThemes] || colorThemes.blue;

    const isCustomHex = typeof color === 'string' && (color.startsWith('#') || color.startsWith('rgb'));
    const accentClass = isCustomHex
        ? `text-[${color}]`
        : (theme.accent || 'text-[#0171B6]');

    // Format data: show 2 decimal places only for gold
    const displayValue = color === 'gold'
        ? data.toFixed(2)
        : data.toString();

    return (
        <Card
            className={`
                stats-card
                rounded-lg
                shadow-sm
                ${color === 'gold' ? 'bg-[#FFFBEB]' : ''}
            `}
        >
            <CardHeader className={`font-medium ${titleColorClass}`}>
                {title}
            </CardHeader>

            <CardFooter className="card-footer flex items-baseline gap-2">
                <span className={`number text-3xl font-bold ${accentClass}`}>
                    {currency}{displayValue}
                </span>
                <span className={`unit text-lg font-medium ${accentClass}`}>
                    {unit}
                </span>
            </CardFooter>
        </Card>
    );
}