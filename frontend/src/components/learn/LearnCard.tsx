import type { RecyclingItem } from "@/constants/interface";
import { motion } from "framer-motion";
import BadgeIcon from "../ui/badge-icon";

function LearnCard({ item }: { item: RecyclingItem }) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div
          className="absolute bottom-0 right-0 px-3 py-0.5 text-xs font-medium rounded-tl-md"
          style={{
            backgroundColor: item.labelColor,
            color: item.labelTextColor,
          }}
        >
          {item.label}
        </div>
        <BadgeIcon type={item.badgeIcon} color={item.badgeColor} />
      </div>
      <div className="p-3 flex flex-col gap-2">
        <div>
          <p className="text-sm font-bold text-black">{item.title}</p>
          <p className="text-xs text-muted-foreground">{item.description}</p>
        </div>
        <div className="bg-card flex items-center gap-2 px-2 py-2 rounded-lg">
          ♻️
          {/* <AlertTriangle className="size-4 text-muted-foreground shrink-0" /> */}
          <p className="text-xs text-black">{item.tip}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default LearnCard;
