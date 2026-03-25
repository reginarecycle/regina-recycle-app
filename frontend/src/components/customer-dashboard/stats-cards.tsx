import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";

export interface StatItem {
  title: string;
  data: number;
  unit: string;
  color?: "red" | "green" | "blue" | "gold";
  currency?: string;
}

const COLOR_THEMES = {
  red:  { accent: "text-[#CA4F4F]", bg: "bg-white",     border: "border-border"      },
  green:{ accent: "text-[#7A9085]", bg: "bg-white",     border: "border-border"      },
  blue: { accent: "text-[#0171B6]", bg: "bg-white",     border: "border-border"      },
  gold: { accent: "text-[#A16207]", bg: "bg-[#FCF7E8]", border: "border-[#C58A2A]"  },
};

function StatCard({ title, data, unit, color = "blue", currency = "" }: StatItem) {
  const theme = COLOR_THEMES[color];
  const displayValue = color === "gold" ? data.toFixed(2) : data.toFixed(0);

  return (
    <Card className={`w-full min-h-36 sm:min-h-42 rounded-xl border shadow-none px-4 py-4 sm:px-6 sm:py-5 flex flex-col justify-between overflow-hidden ${theme.bg} ${theme.border}`}>
      <CardHeader className="p-0">
        <h3 className="text-sm sm:text-base font-semibold text-muted-foreground">{title}</h3>
      </CardHeader>
      <CardFooter className="p-0 flex items-end flex-wrap gap-x-1">
        <span className={`text-4xl sm:text-5xl leading-none font-bold tracking-tight ${theme.accent}`}>
          {currency}{displayValue}
        </span>
        <span className={`text-sm sm:text-base font-medium pb-1 ${theme.accent}`}>
          {unit}
        </span>
      </CardFooter>
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
      {/* Mobile: Framer Motion drag carousel */}
      <div className="sm:hidden overflow-hidden -mx-4">
        <motion.div
          ref={trackRef}
          className="flex gap-4 px-4 cursor-grab active:cursor-grabbing"
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

      {/* sm+: regular grid */}
      <div className="hidden sm:grid sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>
    </>
  );
}
