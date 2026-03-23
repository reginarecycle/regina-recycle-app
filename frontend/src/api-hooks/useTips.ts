import { useGetOne } from "@/lib/queryHelpers";

// ─── Type ─────────────────────────────────────────────────────────────────────

export interface Tip {
  tipId:     string;
  title?:    string;
  content:   string;
  active?:   boolean;
  startDate?: string;
  endDate?:   string;
}

// ─── Query keys ───────────────────────────────────────────────────────────────

export const tipKeys = {
  daily: () => ["tips", "daily"] as const,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/** Returns the tip of the day — same tip all day, deterministic from backend */
export const useGetTip = () =>
  useGetOne<Tip>(tipKeys.daily(), "/tips", {
    staleTime: 1000 * 60 * 60, // 1 hour — tip only changes daily
  });