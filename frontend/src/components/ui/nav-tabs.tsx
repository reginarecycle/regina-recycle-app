import { cn } from "@/lib/utils";
import { useTabs } from "../hooks/useTabs";
import type { TabItem, TabRoutingMode } from "@/types/tabs";
import { useState, type ReactNode } from "react";

interface TabsProps {
  tabs: TabItem[];
  mode?: TabRoutingMode;
  queryKey?: string;
  value?: string;
  onChange?: (href: string) => void;
  /** "underline" — bottom border indicator (default)
   *  "pill"      — filled segment toggle (like the earnings chart) */
  variant?: "underline" | "pill";
  /** Content rendered to the left of the pill tab bar (pill variant only) */
  header?: ReactNode;
  className?: string;
  tabBarClassName?: string;
  contentClassName?: string;
}

export function NavTabs({
  tabs,
  mode = "none",
  queryKey = "tab",
  value,
  onChange,
  variant = "underline",
  header,
  className,
  tabBarClassName,
  contentClassName,
}: TabsProps) {
  // Internal state for uncontrolled mode="none" (no external value/onChange)
  const [internalValue, setInternalValue] = useState(tabs[0].href);
  const isControlled = value !== undefined || onChange !== undefined;
  const resolvedValue = isControlled ? value : internalValue;
  const resolvedOnChange = isControlled ? onChange : setInternalValue;

  const { activeHref, navigate } = useTabs({ tabs, mode, queryKey, value: resolvedValue, onChange: resolvedOnChange });

  const activeTab = tabs.find((t) => t.href === activeHref) ?? tabs[0];
  const ActiveComponent = activeTab.component;

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Tab Bar */}
      {variant === "pill" ? (
        <div className={cn("flex items-center justify-between", tabBarClassName)}>
          {header}
          <div role="tablist" className="inline-flex items-center gap-1 rounded-lg bg-muted p-1">
          {tabs.map((tab) => {
            const isActive = tab.href === activeHref;
            return (
              <button
                key={tab.href}
                role="tab"
                aria-selected={isActive}
                disabled={tab.disabled}
                onClick={() => !tab.disabled && navigate(tab.href)}
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-semibold transition-all outline-none whitespace-nowrap",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                  tab.disabled && "opacity-40 cursor-not-allowed"
                )}
              >
                {tab.label}
              </button>
            );
          })}
          </div>
        </div>
      ) : (
        <div
          role="tablist"
          className={cn(
            "flex items-center border-b border-border overflow-x-auto scrollbar-none",
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
                disabled={tab.disabled}
                onClick={() => !tab.disabled && navigate(tab.href)}
                className={cn(
                  "relative flex items-center gap-2 px-3 sm:px-8 py-2.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors outline-none",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-t",
                  isActive ? "text-accent-foreground" : "text-muted-foreground hover:text-accent-foreground",
                  tab.disabled && "opacity-40 cursor-not-allowed"
                )}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {tab.label}
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
      )}

      {/* Tab Content */}
      <div role="tabpanel" className={cn("flex-1", contentClassName)}>
        <ActiveComponent />
      </div>
    </div>
  );
}
