import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";

import type { PriceRange, StoreType } from "@/domains/admin";
import { type Store } from "@/lib/api-types";
import { graphqlRequest } from "@/lib/graphql-client";
import { CREATE_STORE_MUTATION } from "@/lib/graphql-queries";

type OpenDay = {
  day: string;
  closed: boolean;
  startTime: string;
  endTime: string;
};

interface CreateStoreInput {
  name: string;
  description?: string;
  address: string;
  categoryId: string;
  city: string;
  phoneNumber?: string;
  lat?: number;
  lng?: number;
  type: StoreType;
  price: PriceRange;
  subCategory?: string;
  tags?: string;
  url?: string;
  active?: boolean;
  additionalInfo?: object;
  openDays?: OpenDay[];
}

interface CreateStoreResponse {
  createStore: {
    store: Store;
    plainPin: string;
  };
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
      // Clean the input by removing empty strings and undefined values
      const cleanInput = Object.fromEntries(
        Object.entries(input).filter(([_, value]) => {
          // Keep the value if it's not empty string, undefined, or null
          return value !== "" && value !== undefined && value !== null;
        })
      ) as CreateStoreInput;

      const data = await graphqlRequest<CreateStoreResponse>(
        CREATE_STORE_MUTATION,
        { input: cleanInput }
      );
      return data.createStore.store;
    },
    onSuccess: () => {
      // Invalidate stores list
      void queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
}
