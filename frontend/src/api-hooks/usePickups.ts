import { useGetOne } from "@/lib/queryHelpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiFetch";

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
  type?: string;
  page?: number;
  limit?: number;
}

export interface CollectorPickupsQuery {
  search?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export interface CustomerPaginatedPickups {
  search?: string;
  status?: string;    
  startDate?: string;   
  endDate?: string;  
  page?: number;
  limit?: number;
}

export interface CollectorPaginatedPickups {
  search?: string;
  status?: string;   
  startDate?: string;    
  endDate?: string;     
  page?: number;
  limit?: number;
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
