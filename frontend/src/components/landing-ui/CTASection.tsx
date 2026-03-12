import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import CTACircle from "@/assets/cta-circle.svg?react";
import { useNavigate } from "react-router-dom";
import { Routes } from "@/routes/routes";

function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="bg-white py-12 md:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.div
          className="bg-primary relative overflow-hidden rounded-3xl shadow-[0px_0px_8px_0px_rgba(0,0,0,0.3)] p-8 md:p-12 lg:p-16"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Background decorations */}
          <div className="absolute -left-28 -top-32 size-70 hidden md:block">
            <CTACircle />
          </div>

          <div className="absolute -right-36 -bottom-32 size-70 hidden md:block">
            <CTACircle />
          </div>

          {/* Content */}
          <div className="relative flex flex-col gap-8 md:gap-12 items-center text-center">
            <div className="flex flex-col gap-6 max-w-lg">
              <h2 className="text-3xl md:text-4xl font-black text-primary-foreground">
                Ready to make a difference?
              </h2>
              <p className="text-base font-medium text-primary-foreground/80">
                Join thousands of Regina residents who are turning waste into
                opportunity. Start your journey towards a zero-waste lifestyle
                today.
              </p>
            </div>

            <Button
              variant="outline"
              className="bg-primary-foreground text-primary border-primary hover:bg-primary-foreground/90 hover:text-primary w-full sm:w-auto px-8 py-6 text-base"
              onClick={() => navigate(Routes.onboarding)}
            >
              Get Started
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CTASection;
