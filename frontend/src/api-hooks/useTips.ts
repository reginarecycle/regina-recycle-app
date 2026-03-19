import { useGetList, useGetOne } from "@/lib/queryHelpers";

export interface Tip {
  tipId: string;
  content: string;
  startDate?: string;
  endDate?: string;
  active?: boolean;
}

export const useGetTip = () =>
  useGetOne<Tip>(["tips", "list"], "/tips");

export const useGetTips = () =>
  useGetList<Tip>(["tips"], "/tips/all");

export const useGetTipById = (id: string) =>
  useGetOne<Tip>(["tips", "detail", id], `/tips/${id}`, { enabled: Boolean(id) });