import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { graphqlRequest } from "@/lib/graphql-client";
import { GET_STORE_REVIEWS_QUERY } from "@/lib/graphql-queries";

export interface StoreReview {
  id: string;
  storeId: string;
  userId: string;
  title: string;
  description?: string;
  rating: number;
  createdAt: string;
}

interface PaginatedReviewsResponse {
  data: StoreReview[];
  paginationInfo: {
    total: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

interface StoreReviewsResponse {
  storeReviews: PaginatedReviewsResponse;
}

export function useStoreReviews(
  storeId?: string | null,
  pagination?: { page?: number; first?: number }
): UseQueryResult<PaginatedReviewsResponse, Error> {
  return useQuery({
    queryKey: ["storeReviews", storeId, pagination],
    queryFn: async () => {
      const data = await graphqlRequest<StoreReviewsResponse>(
        GET_STORE_REVIEWS_QUERY,
        { storeId, pagination }
      );
      return (
        data?.storeReviews ?? {
          data: [],
          paginationInfo: {
            total: 0,
            page: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        }
      );
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!storeId,
  });
}
