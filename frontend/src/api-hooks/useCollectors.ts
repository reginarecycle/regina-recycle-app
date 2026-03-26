import { useGetOne, useGetList, usePatch } from "@/lib/queryHelpers";

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

// ─── Query keys ───────────────────────────────────────────────────────────────

export const collectorKeys = {
  stats:                ()                                => ["collectors", "stats"]                          as const,
  materialDistribution: (period?: string)                 => ["collectors", "material-distribution", period]  as const,
  pickupOverview:       ()                                => ["collectors", "pickup-overview"]                 as const,
  pickups:              (query?: object)                  => ["collectors", "pickups", query ?? {}]            as const,
  topLocations:         (limit?: number, period?: string) => ["collectors", "top-locations", limit, period]   as const,
  customers:            (query?: object)                  => ["collectors", "customers", query ?? {}]          as const,
  customerStats:        ()                                => ["collectors", "customers", "stats"]              as const,
  customerDetail:       (id: string)                      => ["collectors", "customers", id]                  as const,
  pricing:              (query?: object)                  => ["collectors", "pricing", query ?? {}]            as const,
  pricingSettings:      ()                                => ["collectors", "pricing-settings"]                as const,
  payoutCalculation:    (materialId: string, qty: number) => ["collectors", "payout", materialId, qty]        as const,
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

// ─── Customer Stats — GET /collectors/customers/stats ────────────────────────
export const useCollectorCustomerStats = () =>
  useGetOne<CollectorCustomerStats>(
    collectorKeys.customerStats(),
    "/collectors/customers/stats",
  );

// ─── Customers list — GET /collectors/customers ───────────────────────────────
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

// ─── Customer detail — GET /collectors/customers/:customerId ─────────────────
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

// ─── Mutations — using usePatch (correct PATCH method) ───────────────────────
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