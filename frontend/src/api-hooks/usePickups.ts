import { useGetOne } from "@/lib/queryHelpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiFetch";

export type PickupStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "ACCEPTED" | "CANCELLED";

export interface TimeSlot {
    id: string;
    label: string;
}

export interface AvailableSlotsResponse {
    [date: string]: TimeSlot[];
}

export interface PickupAddressPayload {
    line1: string;
    line2?: string;
    city: string;
    province: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
}

export interface CreatePickupItemPayload {
    materialId: string;
    quantity: number;
}

export interface CreatePickupPayload {
    address: PickupAddressPayload;
    scheduledAt: string;
    estimatedCost?: number;
    note?: string;
    items: CreatePickupItemPayload[];
}

export interface Pickup {
    pickupId: string;
    status: string;
    scheduledAt: string;
    estimatedCost?: number;
    note?: string;
}

export interface CustomerPickupsQuery {
  search?: string;
  status?: PickupStatus;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface CustomerPaginatedPickups {
  data: Pickup[];
  total: number;
  page: number;
  limit: number;
}

export const useGetAvailableSlots = (month: number, year: number) =>
    useGetOne<AvailableSlotsResponse>(
        ["pickups", "available-slots", month, year],
        `/pickups/available-slots?month=${month}&year=${year}`,
        { enabled: Boolean(month && year) }
    );

export const useCreatePickup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await apiClient.post("/pickups", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pickups"] });
        },
    });
};

export const useGetCustomerPickups = (query?: CustomerPickupsQuery) => {
  const params = new URLSearchParams();

  if (query?.page) params.append("page", String(query.page));
  if (query?.limit) params.append("limit", String(query.limit));
  if (query?.search) params.append("search", query.search);
  if (query?.status) params.append("status", query.status);
  if (query?.startDate) params.append("startDate", query.startDate);
  if (query?.endDate) params.append("endDate", query.endDate);

  const queryString = params.toString();
  const endpoint = queryString ? `/pickups?${queryString}` : "/pickups";

  return useGetOne<CustomerPaginatedPickups>(
    ["pickups", "customer", query ?? {}],
    endpoint
  );
};