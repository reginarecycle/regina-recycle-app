// components/layout/DashboardLayout.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Routes } from "@/routes/routes";

export default function DashboardLayout() {
  const location = useLocation();

  // If on /app root, redirect based on path check
  if (location.pathname === Routes.app) {
    // Check if user came from a collector route or has collector in their previous path
    // Or just default to user dashboard
    return <Navigate to={Routes.dashboard} replace />;
  }

  if (location.pathname === "/app/collector") {
    return <Navigate to={Routes.collectordashboard} replace />;
  }
  // Check if current path is collector route
  const isCollectorRoute = location.pathname.includes("/collector");

  //   const role = getUserRole();

  //   // Redirect from /app root to correct dashboard based on role
  //   if (location.pathname === Routes.app) {
  //     const destination = role === 'collector'
  //       ? Routes.collectordashboard
  //       : Routes.dashboard;

  return (
    <div className="dashboard-layout">
      <>sidebar</>

      {isCollectorRoute ? <>CollectorMenu </> : <>UserMenu </>}
      <>toolbar</>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
