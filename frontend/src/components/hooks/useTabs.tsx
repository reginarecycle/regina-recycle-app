import type { TabItem, TabRoutingMode } from "@/types/tabs";
import { useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import type { TabItem, TabRoutingMode } from "../types/tabs";

interface UseTabsOptions {
  tabs: TabItem[];
  mode: TabRoutingMode;
  /** Query param key used when mode === "query". Defaults to "tab" */
  queryKey?: string;
  /** Controlled value used when mode === "none" */
  value?: string;
  /** Called when mode === "none" and the user clicks a tab */
  onChange?: (href: string) => void;
}

interface UseTabsReturn {
  activeHref: string;
  navigate: (href: string) => void;
}

export function useTabs({
  tabs,
  mode,
  queryKey = "tab",
  value,
  onChange,
}: UseTabsOptions): UseTabsReturn {
  const location = useLocation();
  const nav = useNavigate();

  const activeHref = useMemo(() => {
    if (mode === "path") {
      // Exact match first, then startsWith for nested routes
      return (
        tabs.find((t) => location.pathname === t.href)?.href ??
        tabs.find((t) => location.pathname.startsWith(t.href))?.href ??
        tabs[0].href
      );
    }

    if (mode === "query") {
      const params = new URLSearchParams(location.search);
      const paramValue = params.get(queryKey);
      return (
        tabs.find((t) => t.href === paramValue)?.href ?? tabs[0].href
      );
    }

    // mode === "none" — controlled
    return value ?? tabs[0].href;
  }, [mode, tabs, location, queryKey, value]);

  const navigate = useCallback(
    (href: string) => {
      if (mode === "path") {
        nav(href);
        return;
      }

      if (mode === "query") {
        const params = new URLSearchParams(location.search);
        params.set(queryKey, href);
        nav({ search: params.toString() });
        return;
      }

      // mode === "none"
      onChange?.(href);
    },
    [mode, nav, location.search, queryKey, onChange]
  );

  return { activeHref, navigate };
}
