import ContentCard from "./ContentCard";
import KidsRecycleImg from "@/assets/KidsRecycleImg.png";
import MapImg from "@/assets/map.png";
import RecyclePhonesImg from "@/assets/RecyclePhones.png";
import { Routes } from "@/routes/routes";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AboutSection = () => {
  const navigate = useNavigate();
  const cards = [
    {
      title: "Recycle with Confidence",
      description:
        "Learn what materials can be recycled, how to sort them properly, and make better recycling decisions every day.",
      buttonText: "Learn how to recycle",
      imageSrc: KidsRecycleImg,
      bgColor: "bg-[#f3fff8]",
      order: "image-first" as const,
      onButtonClick: () => navigate(Routes.learn),
    },
    {
      title: "Build a Greener Regina",
      description:
        "By making recycling accessible to everyone, ReginaRecycle helps create a cleaner, more sustainable community.",
      buttonText: "Explore the community",
      imageSrc: MapImg,
      bgColor: "bg-[#fffef3]",
      order: "content-first" as const,
      onButtonClick: () => navigate(Routes.onboarding),
    },
    {
      title: "Track Your Impact",
      description:
        "See how much waste you've diverted from landfills and understand the real impact of your recycling efforts.",
      buttonText: "See your impact",
      imageSrc: RecyclePhonesImg,
      bgColor: "bg-[#fffef3]",
      order: "image-first" as const,
    },
  ];

  return (
    <section
      id="about"
      className="scroll-mt-20 bg-[#fbfbfb] py-12 md:py-16 lg:py-20 text-foreground"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        {/* Section Header */}
        <motion.div
          className="flex flex-col gap-2 items-center text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-black">About Us</h2>
          <p className="text-muted-foreground max-w-2xl">
            ReginaRecycle is a community-focused recycling platform that makes
            recycling easy, accessible for everyone, and supports a greener
            Regina.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col gap-8 lg:gap-10">
          {cards.map((card, index) => (
            <ContentCard key={index} {...card} delay={index * 0.15} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
