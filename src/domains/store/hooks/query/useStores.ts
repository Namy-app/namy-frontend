import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { type Store } from "@/lib/api-types";
import { graphqlRequest } from "@/lib/graphql-client";
import { GET_ALL_STORES_QUERY } from "@/lib/graphql-queries";

interface StoresResponse {
  stores: {
    data: Store[];
    paginationInfo: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface StoreFilters {
  search?: string;
  categoryId?: string;
  subCategory?: string;
  city?: string;
  active?: boolean;
}

export interface PaginationInput {
  page?: number;
  first?: number;
}

export interface UseStoresResult {
  data: Store[];
  paginationInfo: StoresResponse["stores"]["paginationInfo"];
}

export function useStores(
  filters?: StoreFilters,
  pagination?: PaginationInput
): UseQueryResult<UseStoresResult, Error> {
  const paginationParams = {
    page: pagination?.page ?? 1,
    first: pagination?.first ?? 100,
  };

  return useQuery({
    queryKey: ["stores", filters, paginationParams],
    queryFn: async () => {
      const data = await graphqlRequest<StoresResponse>(GET_ALL_STORES_QUERY, {
        pagination: paginationParams,
        filters: filters ?? {},
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
  });
}
