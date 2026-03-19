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
const CollectorWalletPage   = lazy(() => import("@/views/collector/wallet"));

export const dashboardRoutes = () => {
  return [
    {
      path: Routes.dashboard,
      element: addPermissions(UserDashboard, ["customer"])    },
    {
      path: Routes.schedulePickup,
      element: addPermissions(SchedulePickupView, ["customer"]) 
    },
    {
      path: Routes.schedulePickupTime,
      element: addPermissions(SchedulePickupTime, ["customer"]) 
    },
    {
      path: Routes.schedulePickupLoc,
      element: addPermissions(SchedulePickupLoc, ["customer"]) 
    },
    {
      path: Routes.profile,
      element: addPermissions(CustomerProfile, ["customer"]) 
    },
    {
      path: Routes.notifications,
      element: addPermissions(NotificationsPage, ["customer"], { userRole: "customer" }) 
    },
    {
      path: Routes.collectorapp,
      element: <Outlet />,
      children: [
        {
          path: Routes.collectordashboard,
          element: addPermissions(CollectorDashboard, ["collector"])
        },
        {
          path: Routes.collectorsettings,
          element: addPermissions(CollectorSettingsPage, ["collector"])
        },
        {
          path: Routes.collectornotifications,
          element: addPermissions(NotificationsPage, ["collector"], { userRole: "collector" })
        },
        {
          path: Routes.requests,
          element: addPermissions(CollectorRequests, ["collector"])
        },
        {
          path: Routes.collectorwallet,
          element: addPermissions(CollectorWalletPage, ["collector"])
        },
      ],
    },
  
  ] as RouteObject[];
};