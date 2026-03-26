import { useGetOne, useGetList, usePatch } from "@/lib/queryHelpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CollectorStats {
  collectorId:      string;
  pendingRequests:  number;
  acceptedRequests: number;
  totalItems:       number;
  pendingAmount:    number;
}

export interface MaterialDistributionItem {
  materialId:    string;
  name:          string;
  type:          string;
  totalQuantity: number;
}

export interface MaterialDistribution {
  collectorId: string;
  period:      string;
  materials:   MaterialDistributionItem[];
}

export interface PickupOverviewDay {
  day:   string;
  units: number;
}

export interface PickupOverview {
  collectorId: string;
  period:      string;
  overview:    PickupOverviewDay[];
}

export interface TopLocation {
  addressId: string;
  line1:     string;
  city:      string;
  province:  string;
  units:     number;
}

export interface TopLocations {
  collectorId: string;
  period:      string;
  data:        TopLocation[];
}

export interface CollectorCustomer {
  customerId:       string;
  name:             string;
  email:            string;
  phoneNumber:      string | null;
  status:           string;
  neighborhood:     string | null;
  totalCollections: number;
  totalRevenue:     number;
}

export interface CollectorCustomerStats {
  totalUsers:        number;
  avgRevenuePerUser: number;
  totalCollections:  number;
}

export interface PaginatedCustomers {
  data: CollectorCustomer[];
  meta: { total: number; page: number; limit: number; hasNextPage: boolean };
}

export interface CustomerPickup {
  pickupId:    string;
  status:      string;
  scheduledAt: string;
  address:     { line1: string; city: string; province: string } | null;
  items:       { materialId: string; quantity: number; material: { name: string } }[];
}

export interface CustomerDetails {
  customer: {
    customerId:  string;
    name:        string;
    email:       string;
    phoneNumber: string | null;
    status:      string;
    address:     { line1: string; city: string; province: string } | null;
  };
  stats: {
    collections: number;
    revenue:     number;
    avgOrder:    number;
  };
  collectedItems:  string[];
  nextCollection:  string | null;
}

export interface MaterialPricing {
  collectorPricingId: string;
  collectorUserId:    string;
  materialId:         string;
  basePrice:          number;
  bulkPrice:          number | null;
  status:             string;
  createdAt:          string;
  updatedAt:          string;
  material: {
    materialId: string;
    name:       string;
    type:       string;
    photoUrl:   string | null;
  };
}

export interface PaginatedPricing {
  data: MaterialPricing[];
  meta: { total: number; page: number; limit: number; hasNextPage: boolean };
}

export interface MaterialSettings {
  collectorId: string;
  settings: {
    bulkIncentiveEnabled: boolean;
    bulkThreshold:        number;
    serviceFee:           number;
    feeType:              string;
  } | null;
}

export interface MaterialPayoutCalculation {
  collectorId:  string;
  materialId:   string;
  materialName: string;
  quantity:     number;
  unitPrice:    number;
  grossPayout:  number;
  feeType:      string;
  serviceFee:   number;
  netPayout:    number;
}

export interface UpdateCollectorPayload {
  name?:                 string;
  phoneNumber?:          string;
  licenseId?:            string;
  serviceFee?:           number;
  feeType?:              string;
  bulkIncentiveEnabled?: boolean;
  bulkThreshold?:        number;
}

export interface UpdateMaterialSettingsPayload {
  bulkIncentiveEnabled?: boolean;
  bulkThreshold?:        number;
  serviceFee?:           number;
  feeType?:              string;
}

export interface UpdateMaterialPricingPayload {
  basePrice?: number;
  bulkPrice?: number;
  status?:    string;
}

export interface CreateMaterialPricingPayload {
  materialId: string;
  basePrice:  number;
  bulkPrice?: number;
  status?:    string;
}

// ─── Collector Users types ────────────────────────────────────────────────────

export interface CollectorUser {
  customerId:     string;
  name:           string;
  email:          string;
  phone:          string | null;
  neighborhood:   string;
  status:         string;
  collections:    number;
  revenue:        number;
  avgPerOrder:    number;
  collectedItems: string[];
}

export interface CollectorUsersStats {
  totalUsers:        number;
  avgRevenuePerUser: number;
  totalCollection:   number;
}

export interface CollectorUsersResponse {
  stats:      CollectorUsersStats;
  data:       CollectorUser[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

// ─── Collector Pickup Request types ──────────────────────────────────────────

export interface PickupItemMaterial {
  materialId: string;
  name:       string;
  type:       string;
}

export interface PickupRequestItem {
  materialId: string;
  quantity:   number;
  unitPrice?: number;
  material?:  PickupItemMaterial;
}

export interface PickupSnapshot {
  materialId: string;
  quantity:   number;
  priceUsed:  number;
  material?:  PickupItemMaterial;
}

export interface PickupRequester {
  userId:       string;
  name:         string;
  email:        string;
  phoneNumber?: string;
}

export interface PickupAddress {
  line1:       string;
  line2?:      string;
  city?:       string;
  province?:   string;
  postalCode?: string;
}

export interface CollectorPickup {
  pickupId:          string;
  requestNumber?:    string;
  status:            'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';
  scheduledAt:       string;
  /** Customer's estimated payout — always set on creation */
  estimatedCost?:    number | string;
  /** Collector's net earning after service fee — set on acceptance */
  estimatedEarning?: number | string;
  actualEarning?:    number | string;
  note?:             string;
  isCompatible?:     boolean;
  requester?:        PickupRequester;
  address?:          PickupAddress;
  items?:            PickupRequestItem[];
  snapshots?:        PickupSnapshot[];
}

export interface CollectorPickupsPaginated {
  data: CollectorPickup[];
  meta: {
    total:           number;
    page:            number;
    limit:           number;
    totalPages:      number;
    hasNextPage:     boolean;
    hasPreviousPage: boolean;
  };
}

export interface CollectorPickupsQuery {
  status?:    'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';
  search?:    string;
  page?:      number;
  limit?:     number;
  startDate?: string;
  endDate?:   string;
}

export interface CollectorPickupStats {
  pendingRequests:  number;
  acceptedRequests: number;
  potentialRevenue: number;
}

// ─── Query keys ───────────────────────────────────────────────────────────────

export const collectorKeys = {
  stats:                ()                                => ["collectors", "stats"]                          as const,
  materialDistribution: (period?: string)                 => ["collectors", "material-distribution", period]  as const,
  pickupOverview:       ()                                => ["collectors", "pickup-overview"]                 as const,
  pickups:              (query?: object)                  => ["collectors", "pickups", query ?? {}]            as const,
  topLocations:         (limit?: number, period?: string) => ["collectors", "top-locations", limit, period]   as const,
  customers:            (query?: object)                  => ["collectors", "customers", query ?? {}]          as const,
  customerStats:        ()                                => ["collectors", "customers", "stats"]              as const,
  customerDetail:       (id: string)                      => ["collectors", "customers", id]                   as const,
  pricing:              (query?: object)                  => ["collectors", "pricing", query ?? {}]            as const,
  pricingSettings:      ()                                => ["collectors", "pricing-settings"]                as const,
  payoutCalculation:    (materialId: string, qty: number) => ["collectors", "payout", materialId, qty]        as const,
  users:                (id: string, query?: object)      => ["collectors", id, "users", query ?? {}]         as const,
  usersStats:           (id: string)                      => ["collectors", id, "users", "stats"]             as const,
};

export const pickupRequestKeys = {
  all:   ()            => ["pickups", "collector"]                    as const,
  list:  (q?: object)  => ["pickups", "collector", "list", q ?? {}]  as const,
  stats: ()            => ["pickups", "collector", "stats"]          as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useCollectorStats = () =>
  useGetOne<CollectorStats>(collectorKeys.stats(), "/collectors/stats");

export const useCollectorMaterialDistribution = (period?: string) =>
  useGetOne<MaterialDistribution>(
    collectorKeys.materialDistribution(period),
    `/collectors/material-distribution${period ? `?period=${period}` : ""}`,
  );

export const useCollectorPickupOverview = () =>
  useGetOne<PickupOverview>(collectorKeys.pickupOverview(), "/collectors/pickup-overview");

export const useCollectorPickups = (query?: { status?: string; page?: number; limit?: number }) => {
  const params = new URLSearchParams();
  if (query?.status) params.append("status", query.status);
  if (query?.page)   params.append("page",   String(query.page));
  if (query?.limit)  params.append("limit",  String(query.limit));
  const qs = params.toString();
  return useGetList<CollectorCustomer>(
    collectorKeys.pickups(query),
    `/collectors/pickups${qs ? `?${qs}` : ""}`,
  );
};

export const useCollectorTopLocations = (limit?: number, period?: string) => {
  const params = new URLSearchParams();
  if (limit)  params.append("limit",  String(limit));
  if (period) params.append("period", period);
  const qs = params.toString();
  return useGetOne<TopLocations>(
    collectorKeys.topLocations(limit, period),
    `/collectors/top-locations${qs ? `?${qs}` : ""}`,
  );
};

export const useCollectorCustomerStats = () =>
  useGetOne<CollectorCustomerStats>(
    collectorKeys.customerStats(),
    "/collectors/customers/stats",
  );

export const useCollectorCustomers = (query?: {
  search?: string;
  status?: string;
  page?:   number;
  limit?:  number;
}) => {
  const params = new URLSearchParams();
  if (query?.search) params.append("search", query.search);
  if (query?.status) params.append("status", query.status);
  if (query?.page)   params.append("page",   String(query.page));
  if (query?.limit)  params.append("limit",  String(query.limit));
  const qs = params.toString();
  return useGetOne<PaginatedCustomers>(
    collectorKeys.customers(query),
    `/collectors/customers${qs ? `?${qs}` : ""}`,
  );
};

export const useCollectorCustomerDetail = (customerId: string) =>
  useGetOne<CustomerDetails>(
    collectorKeys.customerDetail(customerId),
    `/collectors/customers/${customerId}`,
    { enabled: Boolean(customerId) },
  );

export const useCollectorPricing = (query?: { search?: string; status?: string; page?: number; limit?: number }) => {
  const params = new URLSearchParams();
  if (query?.search) params.append("search", query.search);
  if (query?.status) params.append("status", query.status);
  if (query?.page)   params.append("page",   String(query.page));
  if (query?.limit)  params.append("limit",  String(query.limit));
  const qs = params.toString();
  return useGetOne<PaginatedPricing>(
    collectorKeys.pricing(query),
    `/collectors/me/pricing${qs ? `?${qs}` : ""}`,
  );
};

export const useCollectorPricingSettings = () =>
  useGetOne<MaterialSettings>(collectorKeys.pricingSettings(), "/collectors/pricing-settings");

export const useCalculatePayout = (materialId: string, quantity: number) =>
  useGetOne<MaterialPayoutCalculation>(
    collectorKeys.payoutCalculation(materialId, quantity),
    `/collectors/material-pricing/${materialId}/calculate?quantity=${quantity}`,
    { enabled: Boolean(materialId) && quantity > 0 },
  );

export const useUpdateCollectorProfile = () =>
  usePatch<{ message: string }, UpdateCollectorPayload>(
    "/collectors/profile",
    collectorKeys.stats(),
  );

export const useUpdatePricingSettings = () =>
  usePatch<{ message: string }, UpdateMaterialSettingsPayload>(
    "/collectors/pricing-settings",
    collectorKeys.pricingSettings(),
  );

export const useUpdateMaterialPricing = (materialId: string) =>
  usePatch<{ message: string }, UpdateMaterialPricingPayload>(
    `/collectors/pricing/${materialId}`,
    collectorKeys.pricing(),
  );

// ─── Collector Users hooks ────────────────────────────────────────────────────

export const useCollectorUsers = (
  collectorId: string,
  query?: { keyword?: string; page?: number; limit?: number },
) => {
  const params = new URLSearchParams();
  if (query?.keyword) params.append("keyword", query.keyword);
  if (query?.page)    params.append("page",    String(query.page));
  if (query?.limit)   params.append("limit",   String(query.limit));
  const qs = params.toString();
  return useGetOne<CollectorUsersResponse>(
    collectorKeys.users(collectorId, query),
    `/collectors/${collectorId}/users${qs ? `?${qs}` : ""}`,
    { enabled: Boolean(collectorId) },
  );
};

export const useCollectorUsersStats = (collectorId: string) =>
  useGetOne<CollectorUsersStats>(
    collectorKeys.usersStats(collectorId),
    `/collectors/${collectorId}/users/stats`,
    { enabled: Boolean(collectorId) },
  );

// ─── Collector Pickup Request hooks ──────────────────────────────────────────

export const useGetCollectorPickupStats = () =>
  useGetOne<CollectorPickupStats>(pickupRequestKeys.stats(), "/pickups/collector/stats");

export const useGetCollectorPickupRequests = (query?: CollectorPickupsQuery, enabled = true) => {
  const params = new URLSearchParams();
  if (query?.status)    params.append("status",    query.status);
  if (query?.search)    params.append("search",    query.search);
  if (query?.page)      params.append("page",      String(query.page));
  if (query?.limit)     params.append("limit",     String(query.limit));
  if (query?.startDate) params.append("startDate", query.startDate);
  if (query?.endDate)   params.append("endDate",   query.endDate);
  const qs = params.toString();
  return useGetOne<CollectorPickupsPaginated>(
    pickupRequestKeys.list(query),
    `/pickups/collector${qs ? `?${qs}` : ""}`,
    { enabled },
  );
};

export const useAcceptPickup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pickupId: string) =>
      apiFetch(`/pickups/${pickupId}/accept`, { method: "PATCH" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: pickupRequestKeys.all() }),
  });
};

export const useRejectPickup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ pickupId, reason, comment }: { pickupId: string; reason?: string; comment?: string }) =>
      apiFetch(`/pickups/${pickupId}/reject`, {
        method: "PATCH",
        data: { reason, comment },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: pickupRequestKeys.all() }),
  });
};

export const useCompletePickup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pickupId: string) =>
      apiFetch(`/pickups/${pickupId}/complete`, { method: "PATCH" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: pickupRequestKeys.all() }),
  });
};

export const useCancelPickupByCollector = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pickupId: string) =>
      apiFetch(`/pickups/${pickupId}/cancel`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: pickupRequestKeys.all() }),
  });
};
