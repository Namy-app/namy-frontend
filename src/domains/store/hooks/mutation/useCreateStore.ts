import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";

import { type Store } from "@/lib/api-types";
import { graphqlRequest } from "@/lib/graphql-client";
import { CREATE_STORE_MUTATION } from "@/lib/graphql-queries";

interface CreateStoreInput {
  name: string;
  description?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  logo?: string;
  coverImage?: string;
  ownerId: string;
}

interface CreateStoreResponse {
  createStore: Store;
}

export function useCreateStore(): UseMutationResult<
  Store,
  Error,
  CreateStoreInput,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateStoreInput) => {
      const data = await graphqlRequest<CreateStoreResponse>(
        CREATE_STORE_MUTATION,
        input
      );
      return data.createStore;
    },
    onSuccess: () => {
      // Invalidate stores list
      void queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
}
