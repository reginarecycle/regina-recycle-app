import { api } from "./client";

export const getCollectorWallet = async () => {
 const response = await api.get("/wallet/collector");
 return response.data;
};
