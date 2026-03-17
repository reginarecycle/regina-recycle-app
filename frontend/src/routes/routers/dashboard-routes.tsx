import { lazy } from "react";
import { Routes } from "../routes";
import type { RouteObject } from "react-router-dom";

const UserDashboard = lazy(() => import("@/views/customer/home"));
const CollectorDashboard = lazy(() => import("@/views/collector/home"));
const CustomerProfile = lazy(() => import("@/views/customer/profile"));
const SchedulePickupView = lazy(() => import ("@/views/customer/schedule_pickup_view/index"));
const SchedulePickupTime = lazy(() => import ("@/views/customer/schedule_pickup_time/index"));
const SchedulePickupLoc = lazy (()=> import ("@/views/customer/schedule_pickup_location/index"));
const CollectorRequests = lazy(() => import("@/views/collector/requests"));
const CollectorSettingsPage = lazy(() => import("@/views/collector/settings"));
const NotificationsPage = lazy(() => import("@/views/notifications"));

export const dashboardRoutes = () => {
  return [
    {
      path: Routes.dashboard,
      element: <UserDashboard />,
    },

    {
      path : Routes.schedulePickup,
      element: <SchedulePickupView/>,
    },

    {
      path : Routes.schedulePickupTime,
      element: <SchedulePickupTime/>,
    },

    {
      path : Routes.schedulePickupLoc, 
      element: <SchedulePickupLoc/>,
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
        {
          path: Routes.collectornotifications,
          element: <NotificationsPage userRole="collector" />,
        },
      ],
    },
    {
      path: Routes.profile,
      element: <CustomerProfile />,
    },
    {
      path: Routes.notifications,
      element: <NotificationsPage userRole="customer" />,
    },
    {
      path: Routes.requests,
      element: <CollectorRequests />,
    },
  ] as RouteObject[];
};