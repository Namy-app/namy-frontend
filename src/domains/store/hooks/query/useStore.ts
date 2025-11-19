import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { type Store } from "@/lib/api-types";
import { graphqlRequest } from "@/lib/graphql-client";
import { GET_STORE_BY_ID_QUERY } from "@/lib/graphql-queries";

interface StoreResponse {
  store: Store;
}

export function useStore(id: string): UseQueryResult<Store, Error> {
  return useQuery({
    queryKey: ["store", id],
    queryFn: async () => {
      const data = await graphqlRequest<StoreResponse>(GET_STORE_BY_ID_QUERY, {
        id,
      });
      return data.store;
    },
    enabled: !!id,
  });
}
