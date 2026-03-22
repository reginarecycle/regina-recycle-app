import { useGetOne } from "@/lib/queryHelpers";

export interface Material {
  materialId: string;
  name: string;
  type: string;
  photoUrl?: string;
  description?: string;
  co2Saved?: number;
  waterSaved?: number;
}

export interface MaterialQuery {
  search?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedMaterials {
  data: Material[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const useGetMaterials = (query?: MaterialQuery) => {
  const params = new URLSearchParams();
  if (query?.search) params.append("search", query.search);
  if (query?.type) params.append("type", query.type);
  if (query?.page) params.append("page", String(query.page));
  if (query?.limit) params.append("limit", String(query.limit));

  const queryString = params.toString();
  const endpoint = queryString ? `/materials?${queryString}` : "/materials";

  return useGetOne<PaginatedMaterials>(["materials", "list", query ?? {}], endpoint);
};

export const useGetMaterialById = (id: string) =>
  useGetOne<Material>(["materials", "detail", id], `/materials/${id}`, {
    enabled: Boolean(id),
  });