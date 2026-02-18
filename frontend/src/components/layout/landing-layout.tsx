import { Outlet } from "react-router-dom";

const LandingLayout = () => {
  return (
    <div className="min-h-screen bg-card">
      <Outlet />
    </div>
  );
};

export default LandingLayout;
