import { lazy } from "react";
import { Routes } from "../routes";
import type { RouteObject } from "react-router-dom";

const Login = lazy(() => import("@/views/auth/login"));
const Onboarding = lazy(() => import("@/views/auth/onboarding"));
const UserRegistration = lazy(() => import("@/views/auth/user-register"));
const AccountVerification = lazy(() => import("@/views/auth/verification"));
const SuccessView = lazy(() => import("@/views/auth/success"));
const CollectorRegistration = lazy(
  () => import("@/views/auth/collector-register")
);
const ForgotPassword = lazy(() => import("@/views/auth/forgot-password"));
const ResetPassword = lazy(() => import("@/views/auth/reset-password"));

export const authenticationRoutes = () => {
  return [
    {
      path: Routes.onboarding,
      element: <Onboarding />,
    },
    {
      path: Routes.login,
      element: <Login />,
    },
    {
      path: Routes.register,
      element: <UserRegistration />,
    },
    {
      path: Routes.verification,
      element: <AccountVerification />,
    },
    {
      path: Routes.success,
      element: <SuccessView />,
    },
    {
      path: Routes.collectorRegister,
      element: <CollectorRegistration />,
    },
    {
      path: Routes.forgot,
      element: <ForgotPassword />,
    },
    {
      path: Routes.reset,
      element: <ResetPassword />,
    },
  ] as RouteObject[];
};
