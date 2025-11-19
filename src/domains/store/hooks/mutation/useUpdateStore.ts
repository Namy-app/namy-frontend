import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";

import { type Store } from "@/lib/api-types";
import { graphqlRequest } from "@/lib/graphql-client";
import { UPDATE_STORE_MUTATION } from "@/lib/graphql-queries";

interface UpdateStoreInput {
  id: string;
  name?: string;
  description?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  logo?: string;
  coverImage?: string;
  isActive?: boolean;
}

interface UpdateStoreResponse {
  updateStore: Store;
}

export function useUpdateStore(): UseMutationResult<
  Store,
  Error,
  UpdateStoreInput,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateStoreInput) => {
      const data = await graphqlRequest<UpdateStoreResponse>(
        UPDATE_STORE_MUTATION,
        input
      );
      return data.updateStore;
    },
    onSuccess: (data) => {
      // Invalidate stores list and specific store
      void queryClient.invalidateQueries({ queryKey: ["stores"] });
      void queryClient.invalidateQueries({ queryKey: ["store", data.id] });
    },
  });
}
