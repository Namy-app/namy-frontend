import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { graphqlRequest } from "@/lib/graphql-client";
import { GET_ALL_STORES_QUERY } from "@/lib/graphql-queries";

import type {
  PaginationInput,
  StoreFilters,
  StoresResponse,
  UseStoresResult,
} from "../../type";

export function useStores(
  filters?: StoreFilters,
  pagination?: PaginationInput,
  enabled: boolean = true
): UseQueryResult<UseStoresResult, Error> {
  const paginationParams = {
    page: pagination?.page ?? 1,
    first: pagination?.first ?? 100,
  };

  return useQuery({
    queryKey: ["stores", filters, paginationParams],
    queryFn: async () => {
      // Only include filters with actual values
      const cleanedFilters = filters
        ? Object.fromEntries(
            Object.entries(filters).filter(
              ([, value]) =>
                value !== undefined && value !== null && value !== ""
            )
          )
        : {};

      const data = await graphqlRequest<StoresResponse>(GET_ALL_STORES_QUERY, {
        pagination: paginationParams,
        filters: cleanedFilters,
      });
      return {
        data: data.stores?.data ?? [],
        paginationInfo: data.stores?.paginationInfo ?? {
          total: 0,
          page: 1,
          pageSize: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled,
  });
}
