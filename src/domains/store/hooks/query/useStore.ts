import { useQuery } from "@tanstack/react-query";
import { graphqlRequest } from "@/lib/graphql-client";
import { GET_STORE_BY_ID_QUERY } from "@/lib/graphql-queries";
import { Store } from "@/lib/api-types";

interface StoreResponse {
  store: Store;
}

export function useStore(id: string) {
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
