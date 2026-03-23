import { api } from "./client";

export const getWalletBalance = async () => {
  const response = await api.get("/wallet/balance");
  return response.data;
};