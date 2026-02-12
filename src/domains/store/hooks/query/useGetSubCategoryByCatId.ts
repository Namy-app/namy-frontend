import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { graphqlRequest } from "@/lib/graphql-client";
import { GET_SUBCATEGORIES_BY_CATEGORY_QUERY } from "@/lib/graphql-queries";

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  iconUrl?: string;
  isActive: boolean;
}

type SubCategoriesResponse = {
  subcategories: { data: SubCategory[] };
};

export function useGetSubCategoryByCatId(
  categoryId?: string,
  exclude?: boolean
): UseQueryResult<SubCategory[], Error> {
  return useQuery({
    queryKey: ["subcategories-by-category", categoryId, exclude],
    queryFn: async () => {
      const data = await graphqlRequest<SubCategoriesResponse>(
        GET_SUBCATEGORIES_BY_CATEGORY_QUERY,
        { categoryId, exclude }
      );
      return data?.subcategories.data ?? [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!categoryId,
  });
}
