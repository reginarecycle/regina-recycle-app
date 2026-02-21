import type { RouteObject } from "react-router-dom";
import { Routes } from "../routes";
import { lazy } from "react";

const Home = lazy(() => import("@/views/landing"));
const Learn = lazy(() => import("@/views/landing/learn"));

// for the landing page
export const landingRoutes = () => {
  return [
    {
      path: Routes.base,
      element: <Home />,
    },
    {
      path: Routes.learn,
      element: <Learn />,
    },
  ] as RouteObject[];
};
