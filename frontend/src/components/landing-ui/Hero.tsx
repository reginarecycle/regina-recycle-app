import heroImage from "@/assets/hero-image.svg";
import CircleImg from "@/assets/hero-circle.svg?react";
import SemiBlue from "@/assets/hero-lightsemi.svg?react";
import TypewriterText from "./TypewriterText";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Routes } from "@/routes/routes";

function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="absolute -top-24 opacity-50 pointer-events-none hidden lg:block">
        <CircleImg />
      </div>
      <div className="absolute top-6 right-0 -rotate-3 h-[211.549px] pointer-events-none hidden lg:block">
        <SemiBlue />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16 lg:py-20">
        <div className="grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center">
          <motion.div
            className="flex flex-col items-center text-center lg:items-start lg:text-left order-1"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="bg-foreground/30 flex items-center px-4 py-2 rounded-full w-fit mb-6">
              <p className="text-sm text-white">🎯 #1 Recycling App</p>
            </div>

            <div className="flex flex-col items-center lg:items-start w-full mb-10">
              <h1 className="lg:leading-18 md:leading-16 leading-14 font-black text-5xl lg:text-[56px]">
                Make Everyday Waste
              </h1>
              <div className="flex flex-wrap gap-x-4 items-baseline mt-2 justify-center lg:justify-start">
                <span className="lg:leading-18 md:leading-16 leading-14 font-black text-5xl lg:text-[56px]">
                  Count
                </span>
                <TypewriterText />
              </div>
              <p className="text-paragraph2 max-w-lg mt-5">
                Track your recycling, learn what can be reused, and reduce
                everyday waste with an easy-to-use recycling platform designed
                for real life.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 sm:gap-7 items-center lg:items-start">
              <Button
                variant="outlineprimary"
                onClick={() => navigate(Routes.learn)}
              >
                Learn More <ArrowRight className="ml-2" />
              </Button>
              <Button onClick={() => navigate(Routes.onboarding)}>
                Get Started
              </Button>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="order-2 h-75 md:h-100 lg:h-116.25"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <img
              alt="Recycling illustration"
              className="w-full h-full object-contain"
              src={heroImage}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
