import { Navigate } from "react-router-dom";

export type RouteProtectionProps = {
  children: React.ReactNode;
  redirect: string;
  replace?: boolean;
  /**
   * if all a true then it's a valid route and content would be
   * rendered but if any of the array item returns false then path would be redirected
   */
  validations: Array<boolean | (() => boolean)>;
  /**
   * called when  validations return false;
   */
  onInValid?: () => void;
};

function RouteProtection({
  children,
  redirect,
  validations,
  replace,
  onInValid,
}: RouteProtectionProps) {
  const canReplace = typeof replace === "undefined" || replace;

  if (
    validations.length &&
    !validations.every((value) => {
      if (typeof value === "function") {
        return value();
      }
      return value;
    })
  ) {
    if (onInValid) {
      onInValid();
    }
    return <Navigate to={redirect} replace={canReplace} />;
  }

  return children;
}

export default RouteProtection;
