import type { ComponentType } from "react";

export type TabRoutingMode = "path" | "query" | "none";

export interface TabItem {
  /** Label shown in the tab bar */
  label: string;
  /** The URL or value used to identify this tab.
   *  - path mode:  full path e.g. "/settings/profile"
   *  - query mode: the param value e.g. "profile"  (key is set on <Tabs>)
   *  - none mode:  any unique string used as an internal key
   */
  href: string;
  /** The component rendered when this tab is active */
  component: ComponentType;
  /** Optional icon rendered before the label */
  icon?: ComponentType<{ className?: string }>;
  /** Disable this tab */
  disabled?: boolean;
}
