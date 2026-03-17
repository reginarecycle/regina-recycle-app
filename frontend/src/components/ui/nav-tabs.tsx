import { cn } from "@/lib/utils";
import { useTabs } from "../hooks/useTabs";
import type { TabItem, TabRoutingMode } from "@/types/tabs";

interface TabsProps {
  tabs: TabItem[];
  /**
   * "path"  — active tab is driven by the URL pathname (uses react-router navigate)
   * "query" — active tab is a query param value  (?tab=profile)
   * "none"  — fully controlled, no URL involvement
   */
  mode?: TabRoutingMode;
  /** Query param key when mode === "query". Defaults to "tab" */
  queryKey?: string;
  /** Controlled active value when mode === "none" */
  value?: string;
  /** Called on tab change when mode === "none" */
  onChange?: (href: string) => void;
  /** Extra className on the outer wrapper */
  className?: string;
  /** Extra className on the tab bar */
  tabBarClassName?: string;
  /** Extra className on the content area */
  contentClassName?: string;
}

export function NavTabs({
  tabs,
  mode = "none",
  queryKey = "tab",
  value,
  onChange,
  className,
  tabBarClassName,
  contentClassName,
}: TabsProps) {
  const { activeHref, navigate } = useTabs({
    tabs,
    mode,
    queryKey,
    value,
    onChange,
  });

  const activeTab = tabs.find((t) => t.href === activeHref) ?? tabs[0];
  const ActiveComponent = activeTab.component;

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Tab Bar — scrollable on mobile */}
      <div
        role="tablist"
        className={cn(
          "flex items-center border-b border-border",
          "overflow-x-auto scrollbar-none",
          tabBarClassName
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
              onClick={() => !tab.disabled && navigate(tab.href)}
              className={cn(
                "relative flex items-center gap-2 py-2.5 text-sm font-medium transition-colors outline-none",
                "px-4 sm:px-8",
                "whitespace-nowrap",
                "shrink-0",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-t",
                isActive
                  ? "text-accent-foreground"
                  : "text-muted-foreground hover:text-accent-foreground",
                tab.disabled && "opacity-40 cursor-not-allowed"
              )}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {tab.label}

              {/* Badge */}
              {tab.badge != null && tab.badge > 0 && (
                <span className="ml-1 h-5 min-w-5 px-1.5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                  {tab.badge}
                </span>
              )}

              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-foreground" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div role="tabpanel" className={cn("flex-1", contentClassName)}>
        <ActiveComponent />
      </div>
    </div>
  );
}