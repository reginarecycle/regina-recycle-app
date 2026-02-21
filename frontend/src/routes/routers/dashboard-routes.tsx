import { lazy } from "react";
import { Routes } from "../routes";
import type { RouteObject } from "react-router-dom";

const UserDashboard = lazy(() => import("@/views/customer/home"));
const CollectorDashboard = lazy(() => import("@/views/collector/home"));
const CustomerProfile = lazy(() => import("@/views/customer/profile"));

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
      ],
    },
    {
      path: Routes.profile,
      element: <CustomerProfile />,
    },
  ] as RouteObject[];
};
