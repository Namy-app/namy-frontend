import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { graphqlRequest } from "@/lib/graphql-client";
import { GET_PROMOTED_DISCOUNTS_QUERY } from "@/lib/graphql-queries";

export interface PromotedDiscountStore {
  id: string;
  name: string;
  imageUrl?: string | null;
}

export interface PromotedDiscount {
  id: string;
  storeId: string;
  title: string;
  type: string;
  value: number;
  customText?: string | null;
  imageUrl?: string | null;
  description?: string | null;
  excludedDaysOfWeek?: number[];
  availableDaysAndTimes?: {
    availableDays: Array<{
      dayIndex: number;
      timeRanges: Array<{ start: string; end: string }>;
    }>;
  } | null;
  store?: PromotedDiscountStore | null;
}

interface PromotedDiscountsResponse {
  discounts: {
    data: PromotedDiscount[];
    paginationInfo: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

const PROMOTED_DISCOUNT_FILTERS = {
  isPromoted: true,
  active: true,
} as const;

const PROMOTED_DISCOUNT_PAGINATION = {
  page: 1,
  first: 10,
} as const;

export function usePromotedDiscounts(): UseQueryResult<
  PromotedDiscount[],
  Error
> {
  return useQuery({
    queryKey: [
      "discounts",
      PROMOTED_DISCOUNT_FILTERS,
      PROMOTED_DISCOUNT_PAGINATION,
    ],
    queryFn: async () => {
      const data = await graphqlRequest<PromotedDiscountsResponse>(
        GET_PROMOTED_DISCOUNTS_QUERY,
        {
          filters: PROMOTED_DISCOUNT_FILTERS,
          pagination: PROMOTED_DISCOUNT_PAGINATION,
        }
      );

      return data.discounts?.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
