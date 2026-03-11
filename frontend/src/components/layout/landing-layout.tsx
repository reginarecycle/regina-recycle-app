import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar"
import LearnFooter from "@/components/layout/LearnFooter";
import { Toolbar } from "@/components/layout/toolbar";

const LandingLayout = () => {
  const location = useLocation();

  // Check if we're on the /learn route (exact match)
  const isLearnPage = location.pathname === "/learn";
  const isLoginPage = location.pathname === "/login"

  return (
    <main>
      {isLearnPage || isLoginPage ? <Navbar /> : <Toolbar />}


      <div className="min-h-svh lg:min-h-[767px] bg-card overflow-auto">
        <Outlet />
      </div>

      {isLearnPage ? <LearnFooter /> : <>footer</>}
    </main>
  );
};

export default LandingLayout;