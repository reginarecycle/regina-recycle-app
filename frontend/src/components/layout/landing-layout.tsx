import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Navbar from "../shared/navbar";

const LandingLayout = () => {
  return (
    <div className="bg-[#FBFBFB] min-h-screen">
      <Navbar />

      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default LandingLayout;