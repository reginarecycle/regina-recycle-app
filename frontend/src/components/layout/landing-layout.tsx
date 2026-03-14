import { Outlet } from "react-router-dom";
import Navbar from "../shared/navbar";

const LandingLayout = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default LandingLayout;
