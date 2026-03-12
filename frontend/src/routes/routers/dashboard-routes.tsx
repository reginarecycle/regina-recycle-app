import { lazy } from "react";
import { Routes } from "../routes";
import type { RouteObject } from "react-router-dom";

const UserDashboard = lazy(() => import("@/views/customer/home"));
const CollectorDashboard = lazy(() => import("@/views/collector/home"));
const CustomerProfile = lazy(() => import("@/views/customer/profile"));
const CustomerWallet = lazy(() => import("@/views/customer/wallet"));
const TransactionHistory = lazy(() => import("@/views/customer/transactionhistory"));
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
      path: Routes.wallet,
      element: <CustomerWallet />,
    },
    {
      path: Routes.transactionhistory,
      element: <TransactionHistory />,
    },
    {
      path: Routes.profile,
      element: <CustomerProfile />,
    },
  ] as RouteObject[];
};