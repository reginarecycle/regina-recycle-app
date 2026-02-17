import { lazy } from "react";
import { Routes } from "../routes";
import type { RouteObject } from "react-router-dom";

const Login = lazy(() => import("@/views/login"));

export const authenticationRoutes = () => {
  return [
    {
      path: Routes.login,
      element: <Login />,
    },
  ] as RouteObject[];
};
