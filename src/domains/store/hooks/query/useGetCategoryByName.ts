import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { graphqlRequest } from "@/lib/graphql-client";
import { GET_CATEGORY_BY_NAME_QUERY } from "@/lib/graphql-queries";

export interface Category {
  id: string;
  name: string;
  iconUrl?: string;
  isActive: boolean;
}

type CategoryResponse = {
  categoryByName: Category;
};

export function useGetCategoryByName(
  name: string
): UseQueryResult<Category | null, Error> {
  return useQuery({
    queryKey: ["category-by-name", name],
    queryFn: async () => {
      const data = await graphqlRequest<CategoryResponse>(
        GET_CATEGORY_BY_NAME_QUERY,
        { name }
      );
      return data?.categoryByName ?? null;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!name,
  });
}
