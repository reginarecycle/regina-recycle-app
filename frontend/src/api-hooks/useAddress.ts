import { useCreate, useGetOne, useUpdate } from "../lib/queryHelpers";

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

export const addressKeys = {
  default: () => ["address", "default"] as const,
  detail: (id: string) => ["address", "detail", id] as const,
};

export const useGetDefaultAddress = () =>
  useGetOne<Address>(addressKeys.default(), "/addresses/default");

export const useUpdateAddress = () =>
  useUpdate<Address, Partial<Address>>(
    (id) => `/addresses/${id}`,
    addressKeys.default(),
    addressKeys.detail
  );

export interface CreateAddressDto {
  line1: string;
  city: string;
  province: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  isPrimary?: boolean;
}

export const useCreateAddress = () =>
  useCreate<Address, CreateAddressDto>("/addresses", addressKeys.default());