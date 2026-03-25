import { api } from "./client";

export const getPickupById = async (pickupId: string) => {
  const response = await api.get(`/pickups/${pickupId}`);
  return response.data;
};

export const acceptPickup = async (pickupId: string) => {
  const response = await api.patch(`/pickups/${pickupId}/accept`);
  return response.data;
};

export const cancelPickup = async (pickupId: string) => {
  const response = await api.delete(`/pickups/${pickupId}`);
  return response.data;
};

export const completePickup = async (
 pickupId: string,
 payload: {
   items: { materialId: string; quantity: number }[];
   note?: string;
 },
) => {
 const response = await api.patch(`/pickups/${pickupId}/complete-v2`, payload);
 return response.data;
};


export const cancelPickupV2 = async (
 pickupId: string,
 payload: {
   reason: string;
   comment?: string;
 },
) => {
 const response = await api.patch(`/pickups/${pickupId}/cancel-v2`, payload);
 return response.data;
};


