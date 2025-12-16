import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { GET_STORE_BY_ID } from "@/domains/admin/graphql";
import { type Store } from "@/lib/api-types";
import { graphqlRequest } from "@/lib/graphql-client";

type StoreResponse = {
  store: Store;
};

export function useStore(id?: string | null): UseQueryResult<Store, Error> {
  return useQuery({
    queryKey: ["store", id],
    queryFn: async () => {
      const data = await graphqlRequest<StoreResponse>(GET_STORE_BY_ID, {
        id,
      });
      return data?.store ?? {};
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
  });
}
