import { lazy } from "react";
import { Routes } from "../routes";
import type { RouteObject } from "react-router-dom";

const UserDashboard = lazy(() => import("@/views/customer/home"));
const CollectorDashboard = lazy(() => import("@/views/collector/history"));
const CustomerProfile = lazy(() => import("@/views/customer/profile"));
const CustomerHistory = lazy(() => import("@/views/customer/history"));
const CollectorSettingsPage = lazy(() => import("@/views/collector/settings"));

export const dashboardRoutes = () => {
  return [
    {
      path: Routes.dashboard,
      element: <UserDashboard />,
    },
    {
      path: Routes.collectorapp,
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
       path: "/app/history",
      element: <CustomerHistory />,

    },
  ] as RouteObject[];
};
