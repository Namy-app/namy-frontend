import type { StoreType } from "@/domains/admin/types";
import type { Store } from "@/lib/api-types";

export interface ParsedStore {
  id: string;
  name: string;
  categoryIds: string[];
  /** Display label for category (e.g. "Restaurant") when names are not resolved */
  categoryLabel?: string;
  emoji: string;
  rating: number;
  reviewCount: number;
  isAdPartner: boolean;
  discount: {
    id?: string;
    percentage: number;
    points: number;
  };
  hours: string;
  hoursStructured?: Array<{ day: string; hours: string }>;
  location: {
    address: string;
    city: string;
    lat?: number;
    lng?: number;
    placeId?: string;
  };
  phone: string;
  images: string[];
  menuItems: Array<{ id: string; name: string; image: string }>;
  reviews: Array<{
    id: string;
    name: string;
    avatar: string;
    rating: number;
    comment: string;
  }>;
  amenities: string[];
}

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  categoryIds: string[];
  /** Display label for category when names are not resolved */
  categoryLabel?: string;
  rating: number;
  image: string;
  discount: number;
  distance: string;
  availabilityStatus: "available" | "soon" | "unavailable";
  availabilityText?: string;
}

export interface StoresResponse {
  stores: {
    data: Store[];
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

// GraphQL enum values must be uppercase to match backend
export type StoreSortBy = "NEWEST" | "DISTANCE";

export interface StoreFilters {
  search?: string;
  categoryIds?: string[];
  city?: string;
  active?: boolean;
  isRestaurant?: boolean;
  /** Filter by store type (e.g. RESTAURANT, SERVICE). Maps to GraphQL StoreFiltersInput.type */
  type?: StoreType;
  lat?: number;
  lng?: number;
  id?: string;
  availabilityStatus?: "available" | "soon" | "unavailable";
  sortBy?: StoreSortBy;
}

export interface PaginationInput {
  page?: number;
  first?: number;
}

export interface UseStoresResult {
  data: Store[];
  paginationInfo: StoresResponse["stores"]["paginationInfo"];
}
