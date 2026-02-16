// components/layout/DashboardLayout.tsx
import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Routes } from "@/routes/routes";
import { Sidebar } from "@/components/layout/sidebar";
import { Toolbar } from "@/components/layout/toolbar";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

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
  const userAvatar = "/src/assets/avatar.png";

  //const { user } = useAuth();
  //userName={user.name}
  //userRole={user.role}
  //userAvatar={user.avatar}

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          isCollectorMode={isCollectorRoute}
          userName={userName}
          userRole={userRole}
          userAvatar={userAvatar}
        />
      </div>

      {/* Mobile Drawer */}
      <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <DrawerContent className="lg:hidden">
          <Sidebar
            isCollectorMode={isCollectorRoute}
            userName={userName}
            userRole={userRole}
            userAvatar={userAvatar}
          />
        </DrawerContent>
      </Drawer>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 border-b bg-background px-4 py-3 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold">ReginaRecycle</span>
        </div>

        {/* Toolbar */}
        <Toolbar
          currentLocation={currentLocation}
          onLocationChange={setCurrentLocation}
          notificationCount={3}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}