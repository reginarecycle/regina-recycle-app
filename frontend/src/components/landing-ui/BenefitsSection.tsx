// // import FeatureCard from "@/FeatureCard";

// import CalendarIcon from "@/assets/icons/calendar.svg?react";
// import LocationIcon from "@/assets/icons/location.svg?react";
// import TrophyIcon from "@/assets/icons/trophy.svg?react";
// import LeafIcon from "@/assets/icons/leaf.svg?react";
// import FeatureCard from "./FeatureCard";

// function BenefitsSection() {
//   return (
//     <section id="benefits" className="bg-white py-12 md:py-16 lg:py-20">
//       <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
//         {/* Section Header */}
//         <div className="content-stretch flex flex-col gap-[8px] items-start leading-[0] not-italic mb-12 lg:mb-16 max-w-[556px]" data-aos="fade-up" data-aos-duration="800">
//           <div className="flex flex-col font-['Satoshi:Black',sans-serif] justify-center text-[24px] md:text-[30px] text-black w-full">
//             <p>
//               <span className="leading-[32px] md:leading-[38px]">Why Use Regina</span>
//               <span className="leading-[32px] md:leading-[38px] text-[#344e41]">Recycle</span>
//             </p>
//           </div>
//           <div className="flex flex-col font-['Satoshi:Regular',sans-serif] justify-center text-[#999ca0] text-[16px] w-full">
//             <p className="leading-[24px]">Built to support the Regina community in reducing waste and recycling smarter.</p>
//           </div>
//         </div>

//         {/* Benefits Cards */}
//         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-[20px] lg:gap-[24px]">
//           {/* Card 1 */}
//           <div className="bg-white content-stretch flex flex-col min-h-[233px] items-center justify-center p-[16px] relative rounded-[12px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.15)]" data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">
//             <div className="content-stretch flex flex-col gap-[25px] items-start w-full">
//               <div className="bg-[#e9fffd] content-stretch flex h-[51px] items-center justify-center py-[4px] relative rounded-[16px] shrink-0 w-[52px]">
//                 <div className="relative shrink-0 size-[32px]">
//                   <div className="absolute inset-[8.33%_12.5%]">
//                     <div className="absolute inset-[-3.75%_-4.17%]">
//                       <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 28.6667">
//                         <g>
//                           <path d={svgPaths.p2b043780} stroke="var(--stroke-0, #0081BC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
//                           <path d={svgPaths.p236a4200} stroke="var(--stroke-0, #0081BC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
//                           <path d={svgPaths.p2a211480} stroke="var(--stroke-0, #0081BC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
//                         </g>
//                       </svg>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="content-stretch flex flex-col gap-[16px] items-start leading-[0] not-italic w-full">
//                 <div className="flex flex-col font-['Satoshi:Bold',sans-serif] justify-center text-[#10131d] text-[18px]">
//                   <p className="leading-[28px]">Recycle on Your Schedule</p>
//                 </div>
//                 <div className="flex flex-col font-['Satoshi:Regular',sans-serif] justify-center text-[16px] text-black">
//                   <p className="leading-[24px]">Easily schedule at-home pickups or drop off recyclables when it works best for you.</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Card 2 */}
//           <div className="bg-white content-stretch flex flex-col min-h-[233px] items-center justify-center p-[16px] relative rounded-[12px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.15)]" data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
//             <div className="content-stretch flex flex-col gap-[25px] items-start w-full">
//               <div className="bg-[#eed7d7] content-stretch flex h-[51px] items-center justify-center py-[4px] relative rounded-[16px] shrink-0 w-[52px]">
//                 <div className="relative shrink-0 size-[32px]">
//                   <div className="absolute inset-[8.33%_16.67%_11.15%_16.67%]">
//                     <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.3333 25.7667">
//                       <path d={svgPaths.p248ec080} fill="var(--fill-0, #C70D0D)" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//               <div className="content-stretch flex flex-col gap-[16px] items-start leading-[0] not-italic text-black w-full">
//                 <div className="flex flex-col font-['Satoshi:Bold',sans-serif] justify-center text-[18px]">
//                   <p className="leading-[28px]">Find Local Centers</p>
//                 </div>
//                 <div className="flex flex-col font-['Satoshi:Regular',sans-serif] justify-center text-[16px]">
//                   <p className="leading-[24px]">Locate the nearest recycling points easily with our integrated map. Filter by material type.</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Card 3 */}
//           <div className="bg-white content-stretch flex flex-col min-h-[233px] items-center justify-center p-[16px] relative rounded-[12px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.15)]" data-aos="fade-up" data-aos-duration="800" data-aos-delay="300">
//             <div className="content-stretch flex flex-col gap-[25px] items-start w-full">
//               <div className="bg-[#f3ebd5] content-stretch flex h-[51px] items-center justify-center py-[4px] relative rounded-[16px] shrink-0 w-[52px]">
//                 <div className="relative shrink-0 size-[32px]">
//                   <div className="absolute inset-[12.5%]">
//                     <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
//                       <path d={svgPaths.p3f7ad800} fill="var(--fill-0, #B9A174)" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//               <div className="content-stretch flex flex-col gap-[16px] items-start leading-[0] not-italic text-black w-full">
//                 <div className="flex flex-col font-['Satoshi:Bold',sans-serif] justify-center text-[18px]">
//                   <p className="leading-[28px]">Earn Rewards for Recycling</p>
//                 </div>
//                 <div className="flex flex-col font-['Satoshi:Regular',sans-serif] justify-center text-[16px]">
//                   <p className="leading-[24px]">Collect money or points for your recyclables and redeem them through your wallet or rewards card.</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Card 4 */}
//           <div className="bg-white content-stretch flex flex-col min-h-[233px] items-center justify-center p-[16px] relative rounded-[12px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.15)]" data-aos="fade-up" data-aos-duration="800" data-aos-delay="400">
//             <div className="content-stretch flex flex-col gap-[25px] items-start w-full">
//               <div className="bg-[#f0ffe5] content-stretch flex h-[51px] items-center justify-center py-[4px] relative rounded-[16px] shrink-0 w-[52px]">
//                 <div className="relative shrink-0 size-[32px]">
//                   <div className="absolute inset-[8.33%_12.5%_12.5%_8.33%]">
//                     <div className="absolute inset-[-3.95%]">
//                       <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.3333 27.3333">
//                         <g>
//                           <path d={svgPaths.p27dfd400} fill="var(--fill-0, #A0F48A)" stroke="var(--stroke-0, #97BC79)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
//                           <g>
//                             <path d={svgPaths.pb2d5d80} fill="var(--fill-0, #A0F48A)" />
//                             <path d={svgPaths.pb2d5d80} stroke="var(--stroke-0, #97BC79)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
//                           </g>
//                         </g>
//                       </svg>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="content-stretch flex flex-col gap-[16px] items-start leading-[0] not-italic text-black w-full">
//                 <div className="flex flex-col font-['Satoshi:Bold',sans-serif] justify-center text-[18px]">
//                   <p className="leading-[28px]">Track Your Impact</p>
//                 </div>
//                 <div className="flex flex-col font-['Satoshi:Regular',sans-serif] justify-center text-[16px]">
//                   <p className="leading-[24px]">View your recycling stats and see how your actions contribute to a cleaner, greener Regina.</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default BenefitsSection;

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
