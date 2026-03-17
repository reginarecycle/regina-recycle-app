// components/layout/DashboardLayout.tsx
import { useState, useEffect, useRef } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Routes } from "@/routes/routes";
import { Sidebar } from "@/components/layout/sidebar";
import { Toolbar } from "@/components/layout/toolbar";

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("123-lane");
  const [pageTitle, setPageTitle] = useState("Dashboard");
  
  // Determine if current path is collector route
  const isCollectorRoute = location.pathname.includes("/collector");

  // Initialize lastMainPage from localStorage or default to dashboard
  const getInitialLastPage = () => {
    if (location.pathname.includes('/notification')) {
      const stored = localStorage.getItem('lastMainPage');
      if (stored) return stored;
      return isCollectorRoute ? Routes.collectordashboard : Routes.dashboard;
    }
    return location.pathname;
  };

  const lastMainPage = useRef(getInitialLastPage());

  // Update last main page if we're not on notifications
  useEffect(() => {
    if (!location.pathname.includes('/notification')) {
      lastMainPage.current = location.pathname;
      localStorage.setItem('lastMainPage', location.pathname);
    }
  }, [location.pathname]);

  // Update page title when location changes
  useEffect(() => {
    const pathname = location.pathname;

    if (pathname.includes('/notification')) {
      setPageTitle('Notifications');
    } else if (pathname === '/app' || pathname === '/app/dashboard') {
      setPageTitle('Dashboard');
    } else if (pathname === '/app/schedule') {
      setPageTitle('Schedule Pickup');
    } else if (pathname === '/app/wallet') {
      setPageTitle('My Wallet');
    } else if (pathname === '/app/history') {
      setPageTitle('History');
    } else if (pathname === '/app/profile') {
      setPageTitle('Profile');
    } else if (pathname === '/app/collector/dashboard') {
      setPageTitle('Dashboard');
    } else if (pathname === '/app/collector/requests') {
      setPageTitle('Collection Requests');
    } else if (pathname === '/app/collector/wallet') {
      setPageTitle('Wallet');
    } else if (pathname === '/app/collector/users') {
      setPageTitle('Users');
    } else if (pathname === '/app/collector/settings') {
      setPageTitle('Settings');
    } else {
      setPageTitle('Dashboard');
    }
  }, [location.pathname]);

  // Redirect from /app root to user dashboard
  if (location.pathname === Routes.app) {
    return <Navigate to={Routes.dashboard} replace />;
  }

  // Redirect from /app/collector root to collector dashboard
  if (location.pathname === Routes.collectorapp) {
    return <Navigate to={Routes.collectordashboard} replace />;
  }

  // Mock user data - replace with actual auth context
  const userName = "John Doe";
  const userRole = "Verified User";
  const userAvatar = undefined;

  // Get notifications route based on current user type
  const getNotificationsRoute = () => {
    if (isCollectorRoute) {
      return Routes.collectornotifications;
    }
    return Routes.notifications;
  };

  // Handle notification bell click
  const handleNotificationClick = () => {
    navigate(getNotificationsRoute());
  };

  // Get the active path for sidebar (use last main page if on notifications)
  const sidebarActivePath = location.pathname.includes('/notification') 
    ? lastMainPage.current 
    : location.pathname;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar
          isCollectorMode={isCollectorRoute}
          userName={userName}
          userRole={userRole}
          userAvatar={userAvatar}
          activePath={sidebarActivePath}
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
              activePath={sidebarActivePath}
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
          pageTitle={pageTitle}
          onMenuClick={() => setMobileMenuOpen(true)}
          onNotificationClick={handleNotificationClick}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}