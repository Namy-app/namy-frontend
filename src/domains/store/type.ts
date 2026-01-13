import type { Store } from "@/lib/api-types";

export interface ParsedStore {
  id: string;
  name: string;
  category: string;
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

export interface StoreFilters {
  search?: string;
  categoryId?: string;
  subCategory?: string;
  city?: string;
  active?: boolean;
  noRestaurants?: boolean;
  lat?: number;
  lng?: number;
}

export interface PaginationInput {
  page?: number;
  first?: number;
}

export interface UseStoresResult {
  data: Store[];
  paginationInfo: StoresResponse["stores"]["paginationInfo"];
}
