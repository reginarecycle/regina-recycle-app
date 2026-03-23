import { useGetOne } from "@/lib/queryHelpers";

export interface CustomerDashboardStats {
  co2Saved:        number;
  totalQuantity:   number;
  waterSaved:      number;
  pendingEarnings: number;
}

export const useCustomerDashboardStats = () =>
  useGetOne<CustomerDashboardStats>(
    ["customers", "dashboard-stats"],
    "/customers/dashboard-stats",
  );