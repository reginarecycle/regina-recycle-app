import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import AuthImage from "@/assets/images/authimage.png";
import CityImage from "@/assets/city_of_regina.jpg";
import CollectorsImage from "@/assets/collectors.jpg";
import GreenBinImage from "@/assets/greenbin_plastic.png";
import AuthNav from "../shared/authnav";
import { Routes } from "@/routes/routes";

const SLIDES = [
  { src: AuthImage,        alt: "Recycling background" },
  { src: CityImage,        alt: "City of Regina"       },
  { src: CollectorsImage,  alt: "Collectors at work"   },
  { src: GreenBinImage,    alt: "Green bin plastic"    },
];

const INTERVAL_MS = 4000;

const AuthLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === Routes.login;
  const isOnboardingPage = location.pathname.startsWith("/auth/onboarding");

  const navText = isLoginPage ? "Get Started" : "Login";
  const navLink = isLoginPage
    ? Routes.onboarding
    : isOnboardingPage
    ? Routes.login
    : Routes.login;

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <main>
      <AuthNav link={navLink} text={navText} />
      <div className="h-dvh flex overflow-hidden justify-center">
        <div className="hidden xl:flex w-1/2 h-full relative overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-white/0 to-[#344E41]/81 z-10" />

          {/* Sliding images */}
          <AnimatePresence initial={false}>
            <motion.img
              key={current}
              src={SLIDES[current].src}
              alt={SLIDES[current].alt}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </AnimatePresence>

          {/* Text */}
          <div className="absolute bottom-8 left-8 flex flex-col items-start text-white p-8 z-20">
            <h5 className="text-4xl font-black mb-3">There is no Planet B</h5>
            <div className="w-14 h-1 bg-white mb-4" />
            <p className="text-base text-white/70 font-medium">
              Recycle today for a sustainable environment while making money.
            </p>
          </div>

          {/* Dot indicators */}
          <div className="absolute bottom-10 right-10 flex items-center gap-2 z-20">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 h-3 bg-white"
                    : "w-3 h-3 bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 bg-white flex flex-col items-center justify-center pt-20 sm:pt-52 2xl:mt-10 py-12 px-4 sm:px-8 lg:px-12 container overflow-y-scroll">
          <Outlet />

          <p className="text-sm font-medium text-center mt-12 lg:mt-4">
            © 2026 ReginaRecycle. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
