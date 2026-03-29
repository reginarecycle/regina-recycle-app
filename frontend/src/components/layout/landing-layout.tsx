import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Navbar from "../shared/navbar";
import ReginaRecycleLogo from "@/assets/logoicon.svg?react";


const LandingLayout = () => {
  return (
    <div className="bg-[#FBFBFB] min-h-screen">
      <Navbar />

      <Suspense fallback={
          <div className="max-sm:h-dvh h-screen flex items-center justify-center">
          <ReginaRecycleLogo className="text-foreground animate-bounce" />
        </div>
      }>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default LandingLayout;