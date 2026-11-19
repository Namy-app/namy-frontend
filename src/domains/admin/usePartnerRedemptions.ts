import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";

import { graphqlClient } from "@/lib/graphql-client";

import type { ReportingPartner } from "./partnerReporting";
import type {
  CouponFiltersInput,
  CouponsResponse,
  PaginationInput,
} from "./types";

/** Separate from legacy coupon queries so other admin screens stay compatible. */
export const ADMIN_PARTNER_REDEMPTIONS_QUERY = gql`
  query AdminPartnerRedemptions(
    $filters: CouponFiltersInput
    $pagination: PaginationInput
  ) {
    adminCouponPartners {
      id
      name
      slug
      active
    }
    coupons(filters: $filters, pagination: $pagination) {
      data {
        id
        usedAt
        partnerId
        partner {
          id
          name
          slug
          active
        }
        user {
          displayName
        }
        store {
          id
          name
          city
        }
      }
      paginationInfo {
        total
        page
        pageSize
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export interface PartnerRedemptionsResponse {
  adminCouponPartners: ReportingPartner[];
  coupons: Omit<CouponsResponse, "data"> & {
    data: (Pick<
      CouponsResponse["data"][number],
      "id" | "usedAt" | "user" | "store"
    > & {
      partnerId: string | null;
      partner: ReportingPartner | null;
    })[];
  };
}

export function usePartnerRedemptions(
  filters: CouponFiltersInput,
  pagination: PaginationInput
) {
  return useQuery({
    queryKey: ["admin-partner-redemptions", filters, pagination],
    queryFn: () =>
      graphqlClient.request<PartnerRedemptionsResponse>(
        ADMIN_PARTNER_REDEMPTIONS_QUERY,
        { filters, pagination }
      ),
  });
}
