import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { Store } from "@/lib/api-types";
import { graphqlRequest } from "@/lib/graphql-client";
import { GET_ALL_STORES_QUERY } from "@/lib/graphql-queries";
import { getUserLocationSafe } from "@/lib/utils";

import type { PaginationInput, StoreFilters, StoresResponse } from "../../type";

export interface StoreWithDistance extends Store {
  distance: number; // Distance in kilometers
}

export interface UseClosestStoresResult {
  data: StoreWithDistance[];
  paginationInfo: StoresResponse["stores"]["paginationInfo"];
  userLocation: { latitude: number; longitude: number } | null;
}

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param lat1 - First latitude
 * @param lng1 - First longitude
 * @param lat2 - Second latitude
 * @param lng2 - Second longitude
 * @returns Distance in kilometers
 */
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function useClosestStores(
  filters?: Omit<StoreFilters, "lat" | "lng">,
  pagination?: PaginationInput
): UseQueryResult<UseClosestStoresResult, Error> {
  const paginationParams = {
    page: pagination?.page ?? 1,
    first: pagination?.first ?? 3,
  };

  return useQuery({
    queryKey: ["closest-stores", filters, paginationParams],
    queryFn: async () => {
      // Get user location
      const userLocation = await getUserLocationSafe();

      if (!userLocation) {
        // If we can't get user location, return empty result
        return {
          data: [],
          paginationInfo: {
            total: 0,
            page: 1,
            pageSize: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
          userLocation: null,
        };
      }

      // Fetch stores with user location
      const storesData = await graphqlRequest<StoresResponse>(
        GET_ALL_STORES_QUERY,
        {
          pagination: paginationParams,
          filters: {
            ...filters,
            lat: userLocation.latitude,
            lng: userLocation.longitude,
          },
        }
      );

      // Calculate distance for each store and add to response
      const storesWithDistance: StoreWithDistance[] = (
        storesData.stores?.data ?? []
      )
        .map((store) => {
          // Calculate distance if store has coordinates
          let distance = 0;
          if (store.lat && store.lng) {
            distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              store.lat,
              store.lng
            );
          }

          return {
            ...store,
            distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
          };
        })
        .sort((a, b) => a.distance - b.distance); // Sort by closest first

      return {
        data: storesWithDistance,
        paginationInfo: storesData.stores?.paginationInfo ?? {
          total: 0,
          page: 1,
          pageSize: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        userLocation,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Only run the query if we're in the browser (geolocation API availability)
    enabled: typeof navigator !== "undefined" && !!navigator.geolocation,
  });
}
