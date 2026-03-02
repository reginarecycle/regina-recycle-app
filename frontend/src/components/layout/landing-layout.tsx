import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import LearnFooter from "../learn/LearnFooter";
import { Toolbar } from "@/components/layout/toolbar";

const LandingLayout = () => {
  const location = useLocation();

  // Check if we're on the /learn route (exact match)
  const isLearnPage = location.pathname === "/learn";
  const isLoginPage = location.pathname === "/login"

  return (
    <main className="min-h-screen flex flex-col">
      {/* if on the learn page use the Navbar, otherwise use the Toolbar */}
      {isLearnPage || isLoginPage ? <Navbar /> : <Toolbar />}


      {/* Main content area - grows to fill available space */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Footer always shown */}
      {isLearnPage ? <LearnFooter /> : <>footer</>}
    </main>
  );
};

export default LandingLayout;