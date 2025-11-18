import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlRequest } from "@/lib/graphql-client";
import { UPDATE_STORE_MUTATION } from "@/lib/graphql-queries";
import { Store } from "@/lib/api-types";

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

export function useUpdateStore() {
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
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      queryClient.invalidateQueries({ queryKey: ["store", data.id] });
    },
  });
}
