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
import PermissionRequest from "@/components/shared/permission-request";
import NotFoundPage from "@/components/shared/not-found";

const routes = createBrowserRouter([
  {
    path: "/",
    errorElement: <NotFoundPage />,
    element: <LandingLayout />,
    children: [...landingRoutes()],
  },
  {
    path: "/auth",
    errorElement: <NotFoundPage />,
    element: (
      <RouteProtection redirect={Routes.app} validations={[isUnAuthenticated]}>
        <AuthLayout />
      </RouteProtection>
    ),
    children: [...authenticationRoutes()],
  },
  {
    path: "/app",
    errorElement: <NotFoundPage />,
    element: (
      <RouteProtection
        redirect={Routes.login}
        validations={[isAuthenticated]}
      >
        <DashboardLayout />
      </RouteProtection>
    ),
    children: [...dashboardRoutes()],
  },
  {
    path: Routes.denied,
    element: <PermissionRequest permission={[]} />,
  },
  {
    path: Routes.base,
    errorElement: <NotFoundPage />,
    element: <Navigate to="/app" replace />,
  },
]);

export default routes;
