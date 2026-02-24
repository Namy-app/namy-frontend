import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { graphqlRequest } from "@/lib/graphql-client";
import { GET_CATEGORIES_BY_STORE_TYPE_QUERY } from "@/lib/graphql-queries";

export interface Category {
  id: string;
  name: string;
  iconUrl?: string;
  storeType?: string;
  isActive: boolean;
}

type CategoriesResponse = {
  categories: {
    data: Category[];
    paginationInfo: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
};

export function useCategoriesByStoreType(
  storeType?: string,
  options?: { enabled?: boolean; name?: string }
): UseQueryResult<Category[], Error> {
  return useQuery({
    queryKey: ["categories-by-store-type", storeType, options?.name],
    queryFn: async () => {
      const data = await graphqlRequest<CategoriesResponse>(
        GET_CATEGORIES_BY_STORE_TYPE_QUERY,
        {
          storeType: storeType ?? null,
          name: options?.name ?? null,
          pagination: { page: 1, first: 50 },
        }
      );
      return data?.categories?.data ?? [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: (options?.enabled ?? true) && !!storeType,
  });
}
