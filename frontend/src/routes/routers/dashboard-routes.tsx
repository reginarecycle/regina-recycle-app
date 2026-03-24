import { lazy } from "react";
import { Outlet } from "react-router-dom";
import { Routes } from "../routes";
import type { FunctionComponent, LazyExoticComponent } from "react";
import type { RouteObject } from "react-router-dom";
import addPermissions from "../route-permission";

const lazyCast = <P extends object>(fn: () => Promise<{ default: FunctionComponent<P> }>) =>
  lazy(fn) as LazyExoticComponent<FunctionComponent<P>>;

const UserDashboard              = lazyCast(() => import("@/views/customer/home"));
const CollectorDashboard         = lazyCast(() => import("@/views/collector/home"));
const CustomerProfile            = lazyCast(() => import("@/views/customer/profile"));
const CollectorUsersPage         = lazyCast(() => import("@/views/collector/users"));
const SchedulePickupView         = lazyCast(() => import("@/views/customer/schedule_pickup_view/index"));
const CustomerWallet             = lazyCast(() => import("@/views/customer/wallet/index"));
const WalletTransactionHistory   = lazyCast(() => import("@/views/customer/wallet/transactionhistory"));
const CollectorRequests          = lazyCast(() => import("@/views/collector/requests"));
const CollectorSettingsPage      = lazyCast(() => import("@/views/collector/settings"));
const NotificationsPage          = lazyCast(() => import("@/views/notifications"));
const CollectorWalletPage        = lazyCast(() => import("@/views/collector/wallet/index"));
const CustomerHistoryPage        = lazyCast(() => import("@/views/customer/history/index"));

const UserDashboardGuard          = addPermissions(UserDashboard,           ["customer"]);
const CollectorDashboardGuard     = addPermissions(CollectorDashboard,      ["collector"]);
const CustomerProfileGuard        = addPermissions(CustomerProfile,         ["customer"]);
const CollectorUsersGuard         = addPermissions(CollectorUsersPage,      ["collector"]);
const SchedulePickupViewGuard     = addPermissions(SchedulePickupView,      ["customer"]);
const CustomerWalletGuard         = addPermissions(CustomerWallet,          ["customer"]);
const TransactionHistoryGuard     = addPermissions(WalletTransactionHistory,["customer"]);
const CollectorRequestsGuard      = addPermissions(CollectorRequests,       ["collector"]);
const CollectorSettingsGuard      = addPermissions(CollectorSettingsPage,   ["collector"]);
const CustomerNotificationsGuard  = addPermissions(NotificationsPage,       ["customer"]);
const CollectorNotificationsGuard = addPermissions(NotificationsPage,       ["collector"]);
const CollectorWalletGuard        = addPermissions(CollectorWalletPage,     ["collector"]);
const CustomerHistoryGuard        = addPermissions(CustomerHistoryPage,     ["customer"]);

export const dashboardRoutes = (): RouteObject[] => [
  { path: Routes.dashboard,          element: <UserDashboardGuard /> },
  { path: Routes.schedulePickup,     element: <SchedulePickupViewGuard /> },
  { path: Routes.wallet,             element: <CustomerWalletGuard /> },
  { path: Routes.transactionhistory, element: <TransactionHistoryGuard /> },
  { path: Routes.profile,            element: <CustomerProfileGuard /> },
  { path: Routes.notifications,      element: <CustomerNotificationsGuard /> },
  { path: Routes.history,            element: <CustomerHistoryGuard /> },
  {
    path: Routes.collectorapp,
    element: <Outlet />,
    children: [
      { path: Routes.collectordashboard,     element: <CollectorDashboardGuard /> },
      { path: Routes.collectorusers,         element: <CollectorUsersGuard /> },
      { path: Routes.collectorsettings,      element: <CollectorSettingsGuard /> },
      { path: Routes.collectornotifications, element: <CollectorNotificationsGuard /> },
      { path: Routes.requests,               element: <CollectorRequestsGuard /> },
      { path: Routes.collectorwallet,        element: <CollectorWalletGuard /> },
    ],
  },
];