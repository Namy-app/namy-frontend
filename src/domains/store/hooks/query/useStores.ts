import { useQuery } from "@tanstack/react-query";
import { graphqlRequest } from "@/lib/graphql-client";
import { GET_ALL_STORES_QUERY } from "@/lib/graphql-queries";
import { Store } from "@/lib/api-types";

interface StoresResponse {
  stores: Store[];
}

export function useStores() {
  return useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const data = await graphqlRequest<StoresResponse>(GET_ALL_STORES_QUERY);
      return data.stores;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
