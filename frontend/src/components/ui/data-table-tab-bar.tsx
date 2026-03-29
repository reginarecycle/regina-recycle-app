import { cn } from "@/lib/utils";
import { useTabs } from "@/components/hooks/useTabs";
import type { TabRoutingMode } from "@/types/tabs";
import type { ComponentType } from "react";

// ── Tab item — same as TabItem but component is not required ─────────────────

export interface DataTableTabItem {
  /** Value used to identify this tab.
   *  - "path"  mode: full URL path, e.g. "/history/completed"
   *  - "query" mode: query param value, e.g. "completed"
   *  - "none"  mode: any unique string, e.g. "COMPLETED"
   */
  href: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  disabled?: boolean;
  badge?: number;
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface DataTableTabBarProps {
  tabs: DataTableTabItem[];
  /**
   * "path"  — active tab driven by URL pathname (react-router navigate)
   * "query" — active tab is a ?tab= query param
   * "none"  — fully controlled via value + onChange (default)
   */
  mode?: TabRoutingMode;
  /** Query param key when mode === "query". Defaults to "tab" */
  queryKey?: string;
  /** Controlled active value when mode === "none" */
  value?: string;
  /** Called on tab change when mode === "none" */
  onChange?: (href: string) => void;
  className?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DataTableTabBar({
  tabs,
  mode = "none",
  queryKey = "tab",
  value,
  onChange,
  className,
}: DataTableTabBarProps) {
  // Adapt to useTabs — component is not used by DataTable so we pass a no-op
  const adaptedTabs = tabs.map((t) => ({
    ...t,
    component: (() => null) as ComponentType,
  }));

  const { activeHref, navigate } = useTabs({
    tabs: adaptedTabs,
    mode,
    queryKey,
    value,
    onChange,
  });

  return (
    <div
      role="tablist"
      className={cn(
        "flex border-b border-border px-3 sm:px-6 pt-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.href === activeHref;
        const Icon = tab.icon;

        return (
          <button
            key={tab.href}
            role="tab"
            aria-selected={isActive}
            aria-disabled={tab.disabled}
            disabled={tab.disabled}
            type="button"
            onClick={() => !tab.disabled && navigate(tab.href)}
            className={cn(
              "relative py-3 px-1 mr-4 sm:mr-7 text-sm border-b-2 -mb-px transition-colors",
              "shrink-0 whitespace-nowrap outline-none",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-t",
              isActive
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground font-medium",
              tab.disabled && "opacity-40 cursor-not-allowed"
            )}
          >
            <span className="flex items-center gap-2">
              {Icon && <Icon className="w-4 h-4" />}
              {tab.label}
              {tab.badge != null && tab.badge > 0 && (
                <span className="h-5 min-w-5 px-1.5 rounded-full bg-primary text-primary-foreground text-xs inline-flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
