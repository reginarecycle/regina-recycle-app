import { useGetOne } from "@/lib/queryHelpers";

// ─── Type ─────────────────────────────────────────────────────────────────────

export interface CustomerDashboardStats {
  co2Saved:        number;
  totalQuantity:   number;
  waterSaved:      number;
  pendingEarnings: number;
}

// ─── Query keys ───────────────────────────────────────────────────────────────

export const customerKeys = {
  dashboardStats: () => ["customers", "dashboard-stats"] as const,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useCustomerDashboardStats = () =>
  useGetOne<CustomerDashboardStats>(
    customerKeys.dashboardStats(),
    "/customers/dashboard-stats",
  );
