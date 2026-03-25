import { api } from "./client";

export const getCollectorPickups = async (
  status?: string,
  limit = 10,
  offset = 0,
) => {
  const response = await api.get("/collectors/pickups", {
    params: { status, limit, offset },
  });

  return response.data;
};

export const getCollectorPricing = async (
  limit = 0,
  offset = 0,
  search?: string,
  status?: string,
) => {
  const response = await api.get("/collectors/me/pricing", {
    params: { limit, offset, search, status },
  });

  return response.data;
};

export const getCollectorStats = async () => {
  const response = await api.get("/collectors/stats");
  return response.data;
};