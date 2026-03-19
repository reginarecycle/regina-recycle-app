import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Routes } from "@/routes/routes";
import { Sidebar } from "@/components/layout/sidebar";
import { Toolbar } from "@/components/layout/toolbar";
import { useCurrentUser } from "@/api-hooks/useAuth";
import { useInactivityLogout } from "@/hooks/use-inactivity";

const PAGE_TITLES: Record<string, string> = {
  "/app/dashboard":           "Dashboard",
  "/app/schedule":            "Schedule Pickup",
  "/app/wallet":              "My Wallet",
  "/app/history":             "History",
  "/app/profile":             "Profile",
  "/app/collector/dashboard": "Dashboard",
  "/app/collector/requests":  "Collection Requests",
  "/app/collector/wallet":    "Wallet",
  "/app/collector/users":     "Users",
  "/app/collector/settings":  "Settings",
};

function getPageTitle(pathname: string): string {
  if (pathname.includes("/notification")) return "Notifications";
  if (pathname.startsWith("/app/schedule")) return "Schedule Pickup";
  return PAGE_TITLES[pathname] ?? "Dashboard";
}

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCollectorRoute = location.pathname.includes("/collector");
  const isOnNotifications = location.pathname.includes("/notification");

  const { data: userResult, isLoading} = useCurrentUser();
  const currentuser=  useCurrentUser()
  console.log(currentuser)
  const user = userResult?.data;

  if (location.pathname === Routes.app) {
    return <Navigate to={Routes.dashboard} replace />;
  }

  if (location.pathname === Routes.collectorapp) {
    return <Navigate to={Routes.collectordashboard} replace />;
  }

  const notificationsRoute = isCollectorRoute
    ? Routes.collectornotifications
    : Routes.notifications;

    useInactivityLogout (60 * 60 * 1000);
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:flex">
        <Sidebar
          isCollectorMode={isCollectorRoute}
          userName={user?.name!}
          userRole={user?.role }
          userAvatar={undefined}
          isLoading={isLoading}
          activePath={isOnNotifications
            ? (isCollectorRoute ? Routes.collectordashboard : Routes.dashboard)
            : location.pathname
          }
        />
      </div>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 z-50 lg:hidden">
            <Sidebar
              isCollectorMode={isCollectorRoute}
              userName={user?.name!}
              userRole={user?.role }
              userAvatar={undefined}
              isLoading={isLoading}
              activePath={isOnNotifications
                ? (isCollectorRoute ? Routes.collectordashboard : Routes.dashboard)
                : location.pathname
              }
            />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        <Toolbar
         currentLocation={user?.addresses?.find(a => a.isPrimary)?.line1 ?? "—"}
          notificationCount={3}
          pageTitle={getPageTitle(location.pathname)}
          onMenuClick={() => setMobileMenuOpen(true)}
          onNotificationClick={() => navigate(notificationsRoute)}
        />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}