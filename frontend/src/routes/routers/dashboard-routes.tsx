import { lazy } from "react";
import { Outlet } from "react-router-dom";
import { Routes } from "../routes";
import type { RouteObject } from "react-router-dom";
import addPermissions from "../route-permission";

const UserDashboard         = lazy(() => import("@/views/customer/home"));
const CollectorDashboard    = lazy(() => import("@/views/collector/dashboard"));
const CustomerProfile       = lazy(() => import("@/views/customer/profile"));
const SchedulePickupView    = lazy(() => import("@/views/customer/schedule_pickup_view/index"));
const SchedulePickupTime    = lazy(() => import("@/views/customer/schedule_pickup_time/index"));
const SchedulePickupLoc     = lazy(() => import("@/views/customer/schedule_pickup_location/index"));
const CollectorRequests     = lazy(() => import("@/views/collector/requests"));
const CollectorSettingsPage = lazy(() => import("@/views/collector/settings"));
const NotificationsPage     = lazy(() => import("@/views/notifications"));
const CollectorWalletPage   = lazy(() => import("@/views/collector/wallet/WalletManagement"));
const CustomerHistoryPage = lazy(() => import("@/views/customer/history/RecycleHistory"));


const UserDashboardGuard         = addPermissions(UserDashboard, ["customer"]);
const CollectorDashboardGuard    = addPermissions(CollectorDashboard, ["collector"]);
const CustomerProfileGuard       = addPermissions(CustomerProfile, ["customer"]);
const SchedulePickupViewGuard    = addPermissions(SchedulePickupView, ["customer"]);
const SchedulePickupTimeGuard    = addPermissions(SchedulePickupTime, ["customer"]);
const SchedulePickupLocGuard     = addPermissions(SchedulePickupLoc, ["customer"]);
const CollectorRequestsGuard     = addPermissions(CollectorRequests, ["collector"]);
const CollectorSettingsGuard     = addPermissions(CollectorSettingsPage, ["collector"]);
const CustomerNotificationsGuard = addPermissions(NotificationsPage, ["customer"]);
const CollectorNotificationsGuard = addPermissions(NotificationsPage, ["collector"]);
const CollectorWalletGuard = addPermissions(CollectorWalletPage, ["collector"]);
const CustomerHistoryGuard = addPermissions(CustomerHistoryPage, ["customer"]);

export const dashboardRoutes = (): RouteObject[] => [
  {
    path: Routes.dashboard,
    element: <UserDashboardGuard />,
  },
  {
    path: Routes.schedulePickup,
    element: <SchedulePickupViewGuard />,
  },
  {
    path: Routes.schedulePickupTime,
    element: <SchedulePickupTimeGuard />,
  },
  {
    path: Routes.schedulePickupLoc,
    element: <SchedulePickupLocGuard />,
  },
  {
    path: Routes.profile,
    element: <CustomerProfileGuard />,
  },
  {
    path: Routes.notifications,
    element: <CustomerNotificationsGuard />,
  },
  {
    path: Routes.history,
    element: <CustomerHistoryGuard />,
  },
  {
    path: Routes.collectorapp,
    element: <Outlet />,
    children: [
      {
        path: Routes.collectordashboard,
        element: <CollectorDashboardGuard />,
      },
      {
        path: Routes.collectorsettings,
        element: <CollectorSettingsGuard />,
      },
      {
        path: Routes.collectornotifications,
        element: <CollectorNotificationsGuard />,
      },
      {
        path: Routes.requests,
        element: <CollectorRequestsGuard />,
      },
      {
        path: Routes.collectorwallet,
        element: <CollectorWalletGuard />,
      },
    ],
  },
];
