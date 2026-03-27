import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";
import { toast } from "sonner";

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
  collectorId: string;
  settings: {
    serviceFee:           string;
    feeType:              string;
    bulkIncentiveEnabled: boolean;
    bulkThreshold:        number;
  };
}

export interface PricingMeta {
  total:           number;
  page:            number;
  limit:           number;
  totalPages:      number;
  hasNextPage:     boolean;
  hasPreviousPage: boolean;
}

export const collectorKeys = {
  pricing:         () => ["collector", "pricing"]          as const,
  pricingSettings: () => ["collector", "pricing-settings"] as const,
};

export const useGetCollectorPricing = (params?: { page?: number; limit?: number }) =>
  useQuery({
    queryKey: [...collectorKeys.pricing(), params],
    queryFn:  () => apiFetch<{ data: CollectorPricing[]; meta: PricingMeta }>(
      `/collectors/me/pricing?page=${params?.page ?? 1}&limit=${params?.limit ?? 10}`
    ),
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
  const { data: meData } = useQuery({
    queryKey: ["auth", "me"],
    queryFn:  () => apiFetch<{ userId: string }>("/auth/me"),
  });

  const collectorId = (meData?.data as any)?.userId;

  return useMutation({
    mutationFn: ({ materialId, ...dto }: { materialId: string; basePrice?: number; bulkPrice?: number; status?: string }) =>
      apiFetch(`/collectors/${collectorId}/pricing/${materialId}`, { method: "PUT", data: dto }),
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

export const useUpdateUserProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: { name?: string; phoneNumber?: string; licenseId?: string; dateOfBirth?: string }) =>
      apiFetch("/users/profile", { method: "PATCH", data: dto }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["auth", "me"] }),
  });
};

export const useUpdateAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ addressId, ...dto }: { addressId: string; line1: string; city: string; province: string; postalCode: string }) =>
      apiFetch(`/addresses/${addressId}`, { method: "PATCH", data: dto }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses", "default"] }),
    onError: () => toast.error("Failed to update address"),
  });
};