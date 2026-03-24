import { useGetOne, useUpdate } from "../lib/queryHelpers";

// Type
export interface Address {
  addressId: string;
  line1: string;
  line2?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  isPrimary?: boolean;
}

// Query keys
export const addressKeys = {
  default: () => ["address", "default"] as const,
  detail: (id: string) => ["address", "detail", id] as const,
};

// Hooks
export const useGetDefaultAddress = () =>
  useGetOne<Address>(addressKeys.default(), "/addresses/default");

export const useUpdateAddress = () =>
  useUpdate<Address, Partial<Address>>(
    (id) => `/addresses/${id}`,
    addressKeys.default(),
    addressKeys.detail
  );