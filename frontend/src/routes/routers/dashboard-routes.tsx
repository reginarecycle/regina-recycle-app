import { lazy } from "react";
import { Routes } from "../routes";
import type { RouteObject } from "react-router-dom";

const UserDashboard = lazy(() => import("@/views/customer/home"));
const CollectorDashboard = lazy(() => import("@/views/collector/dashboard"));
const CustomerProfile = lazy(() => import("@/views/customer/profile"));
const CollectorRequests = lazy(() => import("@/views/collector/requests"));
const CollectorSettingsPage = lazy(() => import("@/views/collector/settings"));

export const dashboardRoutes = () => {
  return [
    {
      path: Routes.dashboard,
      element: <UserDashboard />,
    },

    {
      path: Routes.collectorapp,
      element: <CollectorDashboard />, 
      children: [
        {
          path: Routes.collectordashboard,
          element: <CollectorDashboard />,
        },
        {
          path: Routes.collectorsettings,
          element: <CollectorSettingsPage />,
        },
      ],
    },

    {
      path: Routes.profile,
      element: <CustomerProfile />,
    },
    {
      path: Routes.requests,
      element: <CollectorRequests />,
    },
  ] as RouteObject[];
};
