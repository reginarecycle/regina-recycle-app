import { getUserRole } from "@/lib/helper";
import type { FunctionComponent, LazyExoticComponent } from "react";
import { Navigate } from "react-router-dom";
import { Routes } from "./routes";

export default function addPermissions<P extends object>(
  Element: LazyExoticComponent<FunctionComponent<P>>,
  requiredPermissions: Array<string> = [],
  props?: P,
) {
  return function PermissionGuard() {
    const role = getUserRole();
    const userPermissions = role ? [role.toLowerCase()] : [];

    const hasPermissions =
      !requiredPermissions.length ||
      requiredPermissions.every((p) => userPermissions.includes(p));

    if (!hasPermissions) {
      // Redirect to correct dashboard instead of denied
      if (role === 'COLLECTOR') {
        return <Navigate to={Routes.collectordashboard} replace />;
      }
      return <Navigate to={Routes.dashboard} replace />;
    }

    return <Element {...(props as P)} />;
  };
}