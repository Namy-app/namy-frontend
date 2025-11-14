import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlRequest } from "@/lib/graphql-client";
import { CREATE_STORE_MUTATION } from "@/lib/graphql-queries";
import { Store } from "@/lib/api-types";

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

export function useCreateStore() {
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
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
}
