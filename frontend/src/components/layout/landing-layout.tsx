import { Outlet } from "react-router-dom";

const LandingLayout = () => {
  return (
    <div className="min-h-screen w-full bg-white">
      <Outlet />
    </div>
  );
};

export default LandingLayout;