import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { type Store } from "@/lib/api-types";
import { graphqlRequest } from "@/lib/graphql-client";
import { GET_ALL_STORES_QUERY } from "@/lib/graphql-queries";

interface StoresResponse {
  stores: {
    data: Store[];
    paginationInfo: unknown;
  };
}

export function useStores(): UseQueryResult<Store[], Error> {
  return useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const data = await graphqlRequest<StoresResponse>(GET_ALL_STORES_QUERY);
      return data.stores?.data ?? [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
