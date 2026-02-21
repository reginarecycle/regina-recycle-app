// components/layout/DashboardLayout.tsx
import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Routes } from "@/routes/routes";
import { Sidebar } from "@/components/layout/sidebar";
import { Toolbar } from "@/components/layout/toolbar";
import { getPageTitle } from "@/constants/data";

export default function DashboardLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("123-lane");

  // Redirect from /app root to user dashboard
  if (location.pathname === Routes.app) {
    return <Navigate to={Routes.dashboard} replace />;
  }

  // Redirect from /app/collector to collector dashboard
  if (location.pathname === "/app/collector") {
    return <Navigate to={Routes.collectordashboard} replace />;
  }

  // Determine if current path is collector route
  const isCollectorRoute = location.pathname.includes("/collector");

  // Mock user data - replace with actual auth context
  const userName = "John Doe";
  const userRole = "Verified User";
  const userAvatar = undefined; // Add user avatar URL from auth

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar
          isCollectorMode={isCollectorRoute}
          userName={userName}
          userRole={userRole}
          userAvatar={userAvatar}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 z-50 lg:hidden">
            <Sidebar
              isCollectorMode={isCollectorRoute}
              userName={userName}
              userRole={userRole}
              userAvatar={userAvatar}
            />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">

        {/* Toolbar */}
        <Toolbar
          currentLocation={currentLocation}
          onLocationChange={setCurrentLocation}
          notificationCount={3}
          pageTitle={getPageTitle()}
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}