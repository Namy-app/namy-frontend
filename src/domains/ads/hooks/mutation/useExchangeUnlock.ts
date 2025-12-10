import { useMutation } from "@tanstack/react-query";

import { graphqlRequest } from "@/lib/graphql-client";
import { EXCHANGE_UNLOCK_MUTATION } from "@/lib/graphql-queries";

export function useExchangeUnlock() {
  return useMutation({
    mutationFn: async (input: { token: string; discountId: string }) => {
      const res = await graphqlRequest<{
        exchangeUnlock: Record<string, unknown>;
      }>(EXCHANGE_UNLOCK_MUTATION, { input });
      return res.exchangeUnlock;
    },
  });
}
