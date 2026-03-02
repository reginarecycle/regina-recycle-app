import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const UserDashboard = lazy(() => import("@/views/customer/home"));
const CustomerWallet = lazy(() => import("@/views/customer/wallet"));
const TransactionHistory = lazy(() => import("@/views/customer/transactionhistory"));
const CustomerProfile = lazy(() => import("@/views/customer/profile"));

export const dashboardRoutes = (): RouteObject[] => [
  { path: "dashboard", element: <UserDashboard /> },
  { path: "wallet", element: <CustomerWallet /> },
  { path: "wallet/history", element: <TransactionHistory /> },
  { path: "profile", element: <CustomerProfile /> },
];