import { useGetOne, useUpdate } from "../lib/queryHelpers";

// Type
export interface Address {
  id: string;
  address: string;
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