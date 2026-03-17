import { lazy } from "react";
import { Routes } from "../routes";
import type { RouteObject } from "react-router-dom";

const UserDashboard = lazy(() => import("@/views/customer/home"));
const CollectorDashboard = lazy(() => import("@/views/collector/dashboard"));
const CustomerProfile = lazy(() => import("@/views/customer/profile"));
const SchedulePickupView = lazy(() => import ("@/views/customer/schedule_pickup_view/index"));
const SchedulePickupTime = lazy(() => import ("@/views/customer/schedule_pickup_time/index"));
const SchedulePickupLoc = lazy (()=> import ("@/views/customer/schedule_pickup_location/index"));
const CollectorRequests = lazy(() => import("@/views/collector/requests"));
const CollectorSettingsPage = lazy(() => import("@/views/collector/settings"));

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
