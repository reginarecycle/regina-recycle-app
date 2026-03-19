import { getUserRole } from "@/lib/helper";
import type { FunctionComponent } from "react";
import { Navigate } from "react-router-dom";
import { Routes } from "./routes";

export default function addPermissions<P extends object>(
  Element: FunctionComponent<P>,
  requiredPermissions: Array<string> = [],
  props?: P
) {
  const role = getUserRole();
  const userPermissions: Array<string> = role ? [role.toLowerCase()] : [];

  const hasPermissions = () => {
    if (!requiredPermissions.length) return true;
    return requiredPermissions.every((p) => userPermissions.includes(p));
  };

  if (!hasPermissions()) {
    return <Navigate to={Routes.denied} replace />;
  }

  return <Element {...(props as P)} />;
}