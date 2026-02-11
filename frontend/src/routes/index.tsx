import { Navigate, createBrowserRouter } from "react-router-dom";
import RouteProtection from "./route-protection";
import { Routes } from "@/routes/routes";
import { isAuthenticated, isUnAuthenticated } from "@/lib/helper";
import LandingLayout from "@/components/layout/landing-layout";
import { landingRoutes } from "./routers/landing-routes";
import AuthLayout from "@/components/layout/auth-layout";
import { authenticationRoutes } from "./routers/authentication-routes";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { dashboardRoutes } from "./routers/dashboard-routes";

const routes = createBrowserRouter([
  {
    path: "/",
    errorElement: <>Not found</>,
    element: (
      <RouteProtection
        redirect={Routes.dashboard}
        validations={[isUnAuthenticated]}
      >
        <LandingLayout />
      </RouteProtection>
    ),
    children: [...landingRoutes()],
  },
  {
    path: "/auth",
    errorElement: <>Not found</>,
    element: (
      <RouteProtection redirect={Routes.app} validations={[isUnAuthenticated]}>
        <AuthLayout />
      </RouteProtection>
    ),
    children: [...authenticationRoutes()],
  },
  {
    path: "/app",
    errorElement: <>Not found</>,
    element: (
      <RouteProtection
        redirect={Routes.login}
        validations={[isUnAuthenticated]}
      >
        <DashboardLayout />
      </RouteProtection>
    ),
    children: [...dashboardRoutes()],
  },
  {
    path: Routes.base,
    errorElement: <>Not found</>,
    element: <Navigate to="/app" replace />,
  },
]);

export default routes;
