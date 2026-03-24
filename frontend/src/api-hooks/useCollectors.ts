import { useGetOne, useGetList } from "@/lib/queryHelpers";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CollectorStats {
  collectorId: string;
  pendingRequests: number;
  acceptedRequests: number;
  totalItems: number;
  pendingAmount: number;
}

export interface PickupOverviewDay {
  day: string;
  units: number;
}

export interface PickupOverview {
  collectorId: string;
  period: string;
  overview: PickupOverviewDay[];
}

export interface MaterialDistributionItem {
  materialId: string;
  name: string;
  type: string;
  totalQuantity: number;
}

export interface MaterialDistribution {
  collectorId: string;
  period: string;
  materials: MaterialDistributionItem[];
}

export interface TopLocation {
  addressId: string;
  line1: string;
  city: string;
  province: string;
  units: number;
}

export interface TopLocations {
  collectorId: string;
  period: string;
  data: TopLocation[];
}

export interface PickupItem {
  materialId: string;
  quantity: number;
  material: {
    materialId: string;
    name: string;
    type: string;
  };
}

export interface CollectorPickup {
  pickupId: string;
  status: string;
  scheduledAt: string;
  estimatedEarning?: number;
  note?: string;
  requester?: {
    userId: string;
    name: string;
    email: string;
    phoneNumber?: string;
  };
  address?: {
    addressId: string;
    line1: string;
    city: string;
    province: string;
    postalCode: string;
  };
  items: PickupItem[];
}

export interface PaginatedPickups {
  data: CollectorPickup[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useGetCollectorStats = () =>
  useGetOne<CollectorStats>(["collectors", "stats"], "/collectors/stats");

export const useGetPickupOverview = () =>
  useGetOne<PickupOverview>(["collectors", "pickup-overview"], "/collectors/pickup-overview");

export const useGetMaterialDistribution = (period?: string) =>
  useGetOne<MaterialDistribution>(
    ["collectors", "material-distribution", period ?? "all"],
    period ? `/collectors/material-distribution?period=${period}` : "/collectors/material-distribution"
  );

export const useGetTopLocations = (limit = 3, period?: string) => {
  const params = new URLSearchParams();
  params.append("limit", String(limit));
  if (period) params.append("period", period);
  return useGetOne<TopLocations>(
    ["collectors", "top-locations", limit, period ?? "all"],
    `/collectors/top-locations?${params.toString()}`
  );
};

export const useGetCollectorPickups = (status?: string, page = 1, limit = 10) => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", String(limit));
  if (status) params.append("status", status);
  return useGetOne<PaginatedPickups>(
    ["collectors", "pickups", status ?? "all", page, limit],
    `/collectors/pickups?${params.toString()}`
  );
};