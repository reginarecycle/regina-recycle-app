import CalendarIcon from "@/assets/icons/calendar.svg?react";
import LocationIcon from "@/assets/icons/location.svg?react";
import TrophyIcon from "@/assets/icons/trophy.svg?react";
import LeafIcon from "@/assets/icons/leaf.svg?react";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: <CalendarIcon className="size-8" />,
    iconBg: "bg-[#e9fffd]",
    title: "Recycle on Your Schedule",
    description:
      "Easily schedule at-home pickups or drop off recyclables when it works best for you.",
  },
  {
    icon: <LocationIcon className="size-8" />,
    iconBg: "bg-[#eed7d7]",
    title: "Find Local Centers",
    description:
      "Locate the nearest recycling points easily with our integrated map. Filter by material type.",
  },
  {
    icon: <TrophyIcon className="size-8" />,
    iconBg: "bg-[#f3ebd5]",
    title: "Earn Rewards for Recycling",
    description:
      "Collect money or points for your recyclables and redeem them through your wallet or rewards card.",
  },
  {
    icon: <LeafIcon className="size-8" />,
    iconBg: "bg-[#f0ffe5]",
    title: "Track Your Impact",
    description:
      "View your recycling stats and see how your actions contribute to a cleaner, greener Regina.",
  },
];

function BenefitsSection() {
  return (
    <section
      id="benefits"
      className="scroll-mt-20 bg-white py-12 md:py-16 lg:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        {/* Section Header */}
        <motion.div
          className="flex flex-col gap-2 items-start mb-12 lg:mb-16 max-w-[556px]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-2xl md:text-3xl font-black text-black">
            Why Use Regina<span className="text-primary">Recycle</span>
          </h2>
          <p className="text-muted-foreground text-base">
            Built to support the Regina community in reducing waste and
            recycling smarter.
          </p>
        </motion.div>

        {/* Benefits Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="bg-white flex flex-col min-h-[233px] justify-center gap-6 p-4 rounded-xl shadow-[0px_0px_4px_0px_rgba(0,0,0,0.15)]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              <div
                className={`${benefit.iconBg} flex items-center justify-center h-[51px] w-[52px] rounded-2xl`}
              >
                {benefit.icon}
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-[#10131d]">
                  {benefit.title}
                </h3>
                <p className="text-sm text-black">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BenefitsSection;
