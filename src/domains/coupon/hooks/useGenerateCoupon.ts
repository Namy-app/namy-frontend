import { useMutation, useQueryClient } from "@tanstack/react-query";

import { graphqlRequest } from "@/lib/graphql-client";
import { GENERATE_COUPON_MUTATION } from "@/lib/graphql-queries";

export interface GenerateCouponInput {
  storeId: string;
  discountId: string;
}

export interface GeneratedCoupon {
  code: string;
  qrCode: string;
  url: string;
  discount: {
    id: string;
    title: string;
    description: string;
    type: string;
    value: number;
    minPurchaseAmount?: number;
    maxDiscountAmount?: number;
  };
  store: {
    id: string;
    name: string;
    address: string;
    city: string;
    phoneNumber?: string;
    averageRating?: number;
    reviewCounter?: number;
  };
}

/**
 * Hook to generate a coupon for a discount at a store
 * Throws error if user is on cooldown (non-premium users have 1 hour cooldown)
 */
export function useGenerateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: GenerateCouponInput) => {
      const data = await graphqlRequest<{ generateCoupon: GeneratedCoupon }>(
        GENERATE_COUPON_MUTATION,
        { input }
      );

      return data.generateCoupon;
    },
    onSuccess: () => {
      // Invalidate coupons query to refresh the list
      void queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });
}
