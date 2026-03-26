import { useGetOne, useUpdate, useRemove } from "@/lib/queryHelpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PickupStatus = "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED";

export interface PickupAddress {
  line1:      string;
  line2?:     string;
  city:       string;
  province:   string;
  postalCode: string;
  latitude?:  number;
  longitude?: number;
}

export interface PickupItem {
  materialId: string;
  quantity:   number;
  material?:  { name: string; type: string };
}

export interface Pickup {
  pickupId:        string;
  status:          PickupStatus;
  scheduledAt:     string;
  estimatedCost?:  number;
  note?:           string;
  photoUrl?:       string;
  address?:        PickupAddress;
  items?:          PickupItem[];
  requester?: {
    userId:      string;
    name:        string;
    email:       string;
    phoneNumber: string | null;
  };
}

export interface PaginatedPickups {
  data: Pickup[];
  meta: { total: number; page: number; limit: number; hasNextPage: boolean };
}

export interface PickupQuery {
  status?:    PickupStatus;
  search?:    string;
  startDate?: string;
  endDate?:   string;
  page?:      number;
  limit?:     number;
}

export interface TimeSlot {
  id:    string;
  label: string;
}

export interface AvailableSlotsResponse {
  [date: string]: TimeSlot[];
}

export interface CreatePickupItemPayload {
  materialId: string;
  quantity:   number;
}

export interface CreatePickupPayload {
  address:        PickupAddress;
  scheduledAt:    string;
  estimatedCost?: number;
  note?:          string;
  items:          CreatePickupItemPayload[];
}

export interface UpdatePickupPayload {
  scheduledAt?:   string;
  estimatedCost?: number;
  note?:          string;
}

export interface CustomerPickupsQuery {
  search?:    string;
  status?:    PickupStatus;
  page?:      number;
  limit?:     number;
  startDate?: string;
  endDate?:   string;
}

export interface CustomerPaginatedPickups {
  data:  Pickup[];
  total: number;
  page:  number;
  limit: number;
}

// ─── Query keys ───────────────────────────────────────────────────────────────

export const pickupKeys = {
  all:            ()                                  => ["pickups"]                                  as const,
  list:           (query?: object)                    => ["pickups", "list", query ?? {}]             as const,
  requests:       (query?: object)                    => ["pickups", "requests", query ?? {}]         as const,
  detail:         (id: string)                        => ["pickups", "detail", id]                    as const,
  availableSlots: (month: number, year: number)       => ["pickups", "available-slots", month, year]  as const,
};

// ─── Customer hooks ───────────────────────────────────────────────────────────

export const useGetUserPickups = (query?: PickupQuery) => {
  const params = new URLSearchParams();
  if (query?.status)    params.append("status",    query.status);
  if (query?.search)    params.append("search",    query.search);
  if (query?.startDate) params.append("startDate", query.startDate);
  if (query?.endDate)   params.append("endDate",   query.endDate);
  if (query?.page)      params.append("page",      String(query.page));
  if (query?.limit)     params.append("limit",     String(query.limit));
  const qs = params.toString();
  return useGetOne<PaginatedPickups>(
    pickupKeys.list(query),
    `/pickups${qs ? `?${qs}` : ""}`,
  );
};

/** Returns the next upcoming PENDING or ACCEPTED pickup */
export const useNextPickup = () => {
  const query = useGetOne<PaginatedPickups>(pickupKeys.list(), "/pickups");

  const nextPickup = query.data?.data?.data
    ?.filter((p) =>
      ["PENDING", "ACCEPTED"].includes(p.status) &&
      new Date(p.scheduledAt) >= new Date()
    )
    .sort((a, b) =>
      new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    )[0] ?? null;

  return { ...query, nextPickup };
};

export const useGetPickupById = (id: string) =>
  useGetOne<Pickup>(pickupKeys.detail(id), `/pickups/${id}`, {
    enabled: Boolean(id),
  });

export const useGetAvailableSlots = (month: number, year: number) =>
  useGetOne<AvailableSlotsResponse>(
    pickupKeys.availableSlots(month, year),
    `/pickups/available-slots?month=${month}&year=${year}`,
    { enabled: Boolean(month && year) },
  );

export const useCreatePickup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiFetch<Pickup>("/pickups", {
        method: "POST",
        data:   formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pickupKeys.all() });
    },
  });
};

export const useUpdatePickup = () =>
  useUpdate<Pickup, UpdatePickupPayload>(
    (id) => `/pickups/${id}`,
    pickupKeys.all(),
    pickupKeys.detail,
  );

export const useCancelPickup = () =>
  useRemove(
    (id) => `/pickups/${id}/cancel`,
    pickupKeys.all(),
    pickupKeys.detail,
  );

export const useGetCustomerPickups = (query?: CustomerPickupsQuery, enabled = true) => {
  const params = new URLSearchParams();
  if (query?.page)      params.append("page",      String(query.page));
  if (query?.limit)     params.append("limit",     String(query.limit));
  if (query?.search)    params.append("search",    query.search);
  if (query?.status)    params.append("status",    query.status);
  if (query?.startDate) params.append("startDate", query.startDate);
  if (query?.endDate)   params.append("endDate",   query.endDate);

  const queryString = params.toString();
  const endpoint    = queryString ? `/pickups?${queryString}` : "/pickups";

  return useGetOne<CustomerPaginatedPickups>(
    ["pickups", "customer", query ?? {}],
    endpoint,
    { enabled }
  );
};

// ─── Collector hooks ──────────────────────────────────────────────────────────

export const useGetPickupRequests = (query?: PickupQuery) => {
  const params = new URLSearchParams();
  if (query?.status) params.append("status", query.status);
  if (query?.page)   params.append("page",   String(query.page));
  if (query?.limit)  params.append("limit",  String(query.limit));
  const qs = params.toString();
  return useGetOne<PaginatedPickups>(
    pickupKeys.requests(query),
    `/pickups/requests${qs ? `?${qs}` : ""}`,
  );
};
