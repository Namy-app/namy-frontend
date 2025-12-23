import type { Store } from "@/lib/api-types";

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
