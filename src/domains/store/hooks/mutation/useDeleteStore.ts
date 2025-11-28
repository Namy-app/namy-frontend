import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";

import { type Store } from "@/lib/api-types";
import { graphqlRequest } from "@/lib/graphql-client";
import { DELETE_STORE_MUTATION } from "@/lib/graphql-queries";

interface DeleteStoreInput {
  id: string;
}

interface DeleteStoreResponse {
  deleteStore: Store;
}

export function useDeleteStore(): UseMutationResult<
  Store,
  Error,
  DeleteStoreInput,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DeleteStoreInput) => {
      const data = await graphqlRequest<DeleteStoreResponse>(
        DELETE_STORE_MUTATION,
        input
      );
      return data.deleteStore;
    },
    onSuccess: (data) => {
      // Invalidate stores list and remove the specific store from cache
      void queryClient.invalidateQueries({ queryKey: ["stores"] });
      queryClient.removeQueries({ queryKey: ["store", data.id] });
    },
  });
}
