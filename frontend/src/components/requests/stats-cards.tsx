import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import BlueCash from "@/assets/blue-cash.svg";
import YellowArrow from "@/assets/yellow-arrow.svg";
import GreenBox from "@/assets/green-box.svg";

const COLOR_THEMES = {
    green:  { accent: "text-[#22C55E]", icon: GreenBox },
    blue:   { accent: "text-[#3B82F6]", icon: BlueCash },
    yellow: { accent: "text-[#F59E0B]", icon: YellowArrow },
};

export interface StatItem {
    title: string;
    data: number;
    unit?: string;
    color: "green" | "blue" | "yellow";
    currency?: string;
}

function StatCard({ title, data, unit = "", color, currency = "" }: StatItem) {
    const theme = COLOR_THEMES[color];
    const formattedData = color === "blue" ? data.toLocaleString() : data;

    return (
        <Card className="w-full rounded-lg shadow-sm bg-white flex-row gap-3.5 px-6 py-6 items-center min-h-27.5">
            <img src={theme.icon} alt={`${color} icon`} className="w-10 h-10 sm:w-12 sm:h-12 shrink-0" />
            <CardContent className="flex flex-col px-0">
                <div className="text-[#999CA0] text-sm font-bold">{title}</div>
                <span className={`text-2xl sm:text-3xl font-bold mt-1 ${theme.accent}`}>
                    {currency}{formattedData}{unit && ` ${unit}`}
                </span>
            </CardContent>
        </Card>
    );
}

interface StatsCardsProps {
    items: StatItem[];
}

export function StatsCards({ items }: StatsCardsProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [dragWidth, setDragWidth] = useState(0);

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        setDragWidth(el.scrollWidth - el.offsetWidth);
    }, []);

    return (
        <>
            {/* Mobile: drag carousel */}
            <div className="sm:hidden overflow-hidden -mx-6">
                <motion.div
                    ref={trackRef}
                    className="flex gap-4 px-6 cursor-grab active:cursor-grabbing"
                    drag="x"
                    dragConstraints={{ right: 0, left: -dragWidth }}
                    dragElastic={0.08}
                    dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
                >
                    {items.map((item, i) => (
                        <motion.div
                            key={item.title}
                            className="shrink-0 w-[72vw]"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08, duration: 0.35, ease: "easeOut" }}
                        >
                            <StatCard {...item} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* sm+: grid */}
            <div className="hidden sm:grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {items.map((item) => (
                    <StatCard key={item.title} {...item} />
                ))}
            </div>
        </>
    );
}


