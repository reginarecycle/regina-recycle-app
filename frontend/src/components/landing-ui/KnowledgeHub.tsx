import PlasticIcon from "@/assets/icons/plastic.svg?react";
import PaperIcon from "@/assets/icons/paper.svg?react";
import GlassIcon from "@/assets/icons/glass.svg?react";
import EwasteIcon from "@/assets/icons/ewaste.svg?react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheckIcon,
  BadgeXIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Routes } from "@/routes/routes";

const categories = [
  {
    icon: <PlasticIcon className="size-16" />,
    iconBg: "bg-[#eff6ff]",
    title: "Plastic",
    accepted: "Bottles & Jugs",
    rejected: "Plastic Bags",
  },
  {
    icon: <PaperIcon className="size-16" />,
    iconBg: "bg-[#fff7ed]",
    title: "Paper",
    accepted: "Newspaper/Cardboard",
    rejected: "Soiled Pizza Boxes",
  },
  {
    icon: <GlassIcon className="size-16" />,
    iconBg: "bg-[#f0fdfa]",
    title: "Glass",
    accepted: "Bottles & Jars",
    rejected: "Broken Mirrors",
  },
  {
    icon: <EwasteIcon className="size-16" />,
    iconBg: "bg-[#faf5ff]",
    title: "E-Waste",
    accepted: "Old Phones & Monitors",
    rejected: "Batteries",
  },
];

function KnowledgeHubSection() {
  const navigate = useNavigate();
  return (
    <section
      id="learn"
      className="scroll-mt-20 bg-[#fbfbfb] py-12 md:py-16 lg:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        {/* Section Header */}
        <motion.div
          className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex flex-col gap-2 max-w-[556px]">
            <p className="text-sm font-black text-primary uppercase tracking-wide">
              Knowledge Hub
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-black">
              What Can Be Recycled?
            </h2>
            <p className="text-muted-foreground text-base">
              Confused about what goes in the blue bin? Browse our categories to
              sort smart.
            </p>
          </div>

          <Button
            variant="ghost"
            className="text-primary hover:bg-transparent hover:text-primary/80 px-0"
            onClick={() => navigate(Routes.learn)}
          >
            Learn how to recycle
            <ArrowRight className="ml-1 size-4" />
          </Button>
        </motion.div>

        {/* Category Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="flex flex-col rounded-xl border border-[#ebe9e8] overflow-hidden bg-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              {/* Icon Area */}
              <div
                className={`${category.iconBg} flex items-center justify-center h-36 w-full`}
              >
                {category.icon}
              </div>

              {/* Content Area */}
              <div className="flex flex-col gap-3 p-4">
                <h3 className="text-xl font-bold text-black">
                  {category.title}
                </h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <BadgeCheckIcon className="size-5 text-green-500 shrink-0" />
                    <span className="text-sm text-green-500">
                      {category.accepted}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BadgeXIcon className="size-5 text-red-500 shrink-0" />
                    <span className="text-sm text-red-500">
                      {category.rejected}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default KnowledgeHubSection;
