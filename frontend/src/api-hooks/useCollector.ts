import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";

// ── Types ──────────────────────────────────────────────────────────────────

export interface CollectorPricing {
  collectorPricingId: string;
  materialId:         string;
  basePrice:          number;
  bulkPrice:          number | null;
  status:             "ACTIVE" | "INACTIVE";
  material: {
    materialId:  string;
    name:        string;
    type:        string;
    description: string | null;
    photoUrl:    string | null;
  };
}

export interface PricingSettings {
  serviceFee:           number;
  feeType:              string;
  bulkIncentiveEnabled: boolean;
  bulkThreshold:        number;
}

// ── Query Keys ─────────────────────────────────────────────────────────────

export const collectorKeys = {
  pricing:         () => ["collector", "pricing"]          as const,
  pricingSettings: () => ["collector", "pricing-settings"] as const,
  profile:         () => ["collector", "profile"]          as const,
};

// ── Hooks ──────────────────────────────────────────────────────────────────

export const useGetCollectorPricing = () =>
  useQuery({
    queryKey: collectorKeys.pricing(),
    queryFn:  () => apiFetch<{ data: CollectorPricing[] }>("/collectors/me/pricing"),
  });

export const useGetPricingSettings = () =>
  useQuery({
    queryKey: collectorKeys.pricingSettings(),
    queryFn:  () => apiFetch<PricingSettings>("/collectors/pricing-settings"),
  });

export const useCreateMaterialPricing = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: { materialId: string; basePrice: number; bulkPrice?: number }) =>
      apiFetch("/collectors/pricing", { method: "POST", data: dto }),
    onSuccess: () => qc.invalidateQueries({ queryKey: collectorKeys.pricing() }),
  });
};

export const useUpdateMaterialPricing = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ materialId, ...dto }: { materialId: string; basePrice?: number; bulkPrice?: number; status?: string }) =>
      apiFetch(`/collectors/pricing/${materialId}`, { method: "PATCH", data: dto }),
    onSuccess: () => qc.invalidateQueries({ queryKey: collectorKeys.pricing() }),
  });
};

export const useUpdatePricingSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: { serviceFee?: number; feeType?: string; bulkIncentiveEnabled?: boolean; bulkThreshold?: number }) =>
      apiFetch("/collectors/pricing-settings", { method: "PATCH", data: dto }),
    onSuccess: () => qc.invalidateQueries({ queryKey: collectorKeys.pricingSettings() }),
  });
};

export const useUpdateCollectorProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Record<string, unknown>) =>
      apiFetch("/collectors/profile", { method: "PATCH", data: dto }),
    onSuccess: () => qc.invalidateQueries({ queryKey: collectorKeys.profile() }),
  });
};