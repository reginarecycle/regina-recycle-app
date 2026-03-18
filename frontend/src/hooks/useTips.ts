import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";

export interface Tip {
  tipId: string;
  content: string;
  startDate?: string;
  endDate?: string;
  active?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export const tipKeys = {
  all:    ()           => ["tips"]               as const,
  lists:  ()           => ["tips", "list"]        as const,
  detail: (id: string) => ["tips", "detail", id]  as const,
};

export const useGetTip = () =>
  useQuery({
    queryKey: tipKeys.lists(),
    queryFn: async () => {
      const res = await apiFetch<ApiResponse<Tip>>("/tips");
      console.log("full res:", JSON.stringify(res));
      return res.data;
    },
  });

export const useGetTips = () =>
  useQuery({
    queryKey: tipKeys.all(),
    queryFn: async () => {
      const res = await apiFetch<ApiResponse<Tip[]>>("/tips/all");
      return res.data;
    },
  });