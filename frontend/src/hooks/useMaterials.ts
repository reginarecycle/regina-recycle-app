import { useGetList } from "@/lib/queryHelpers";

export interface Material {
  id: number;
  name: string;
  type: string;
  photoUrl?: string;
  co2Saved?: number;
  waterSaved?: number;
}

// Maps API `type` string to your Category type
export const materialKeys = {
  all:   () => ["materials"]        as const,
  lists: () => ["materials", "list"] as const,
};

export const useGetMaterials = () =>
  useGetList<Material>(materialKeys.lists(), "/materials");