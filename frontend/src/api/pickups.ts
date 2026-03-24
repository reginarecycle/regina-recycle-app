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

