import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { graphqlClient } from "@/lib/graphql-client";

import {
  CREATE_STORE_MUTATION,
  UPDATE_STORE_MUTATION,
  DELETE_STORE_MUTATION,
  TOGGLE_STORE_ACTIVE_MUTATION,
  GET_STORE_STATISTICS,
  GET_ALL_STORES,
  GET_STORE_BY_ID,
  CREATE_DISCOUNT,
  UPDATE_DISCOUNT,
  DELETE_DISCOUNT,
  GET_STORE_DISCOUNTS,
  GET_USERS,
  GET_USER_DETAILS_WITH_ACTIVITY,
} from "./graphql";
import {
  type CreateStoreInput,
  type UpdateStoreInput,
  type StoreCreationResponse,
  type StoreUpdateResponse,
  type StoreStatistics,
  type StoresResponse,
  type Store,
  type StoreFiltersInput,
  type PaginationInput,
  type Discount,
  type DiscountsResponse,
  type CreateDiscountInput,
  type UpdateDiscountInput,
  type DiscountFiltersInput,
  type CouponsResponse,
  type CouponFiltersInput,
  type Catalog,
  type CatalogItem,
  type CreateCatalogInput,
  type CreateCatalogItemInput,
  type UsersResponse,
  type UserDetailsWithActivity,
} from "./types";

// ==================== Store Mutations ====================

export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation<StoreCreationResponse, Error, CreateStoreInput>({
    mutationFn: async (input: CreateStoreInput) => {
      const data = await graphqlClient.request<{
        createStore: StoreCreationResponse;
      }>(CREATE_STORE_MUTATION, { input });
      return data.createStore;
    },
    onSuccess: () => {
      // Invalidate store queries
      void queryClient.invalidateQueries({ queryKey: ["stores"] });
      void queryClient.invalidateQueries({ queryKey: ["store-statistics"] });
    },
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation<
    StoreUpdateResponse,
    Error,
    { id: string; input: UpdateStoreInput }
  >({
    mutationFn: async ({ id, input }) => {
      const data = await graphqlClient.request<{
        updateStore: StoreUpdateResponse;
      }>(UPDATE_STORE_MUTATION, { id, input });
      return data.updateStore;
    },
    onSuccess: (_, variables) => {
      // Invalidate store queries
      void queryClient.invalidateQueries({ queryKey: ["stores"] });
      void queryClient.invalidateQueries({ queryKey: ["store", variables.id] });
      void queryClient.invalidateQueries({ queryKey: ["store-statistics"] });
    },
  });
}

export function useDeleteStore() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: async (id: string) => {
      const data = await graphqlClient.request<{ deleteStore: boolean }>(
        DELETE_STORE_MUTATION,
        { id }
      );
      return data.deleteStore;
    },
    onSuccess: () => {
      // Invalidate store queries
      void queryClient.invalidateQueries({ queryKey: ["stores"] });
      void queryClient.invalidateQueries({ queryKey: ["store-statistics"] });
    },
  });
}

export function useToggleStoreActive() {
  const queryClient = useQueryClient();

  return useMutation<Store, Error, string>({
    mutationFn: async (id: string) => {
      const data = await graphqlClient.request<{ toggleStoreActive: Store }>(
        TOGGLE_STORE_ACTIVE_MUTATION,
        { id }
      );
      return data.toggleStoreActive;
    },
    onSuccess: (_, id) => {
      // Invalidate store queries
      void queryClient.invalidateQueries({ queryKey: ["stores"] });
      void queryClient.invalidateQueries({ queryKey: ["store", id] });
      void queryClient.invalidateQueries({ queryKey: ["store-statistics"] });
    },
  });
}

// ==================== Store Queries ====================

export function useStoreStatistics(filters?: StoreFiltersInput) {
  return useQuery<StoreStatistics>({
    queryKey: ["store-statistics", filters],
    queryFn: async () => {
      const data = await graphqlClient.request<{
        storeStatistics: StoreStatistics;
      }>(GET_STORE_STATISTICS, { filters });
      return data.storeStatistics;
    },
  });
}

export function useStores(
  filters?: StoreFiltersInput,
  pagination?: PaginationInput
) {
  return useQuery<StoresResponse>({
    queryKey: ["stores", filters, pagination],
    queryFn: async () => {
      const data = await graphqlClient.request<{ stores: StoresResponse }>(
        GET_ALL_STORES,
        { filters, pagination }
      );
      return data.stores;
    },
  });
}

export function useStore(id: string) {
  return useQuery<Store>({
    queryKey: ["store", id],
    queryFn: async () => {
      const data = await graphqlClient.request<{ store: Store }>(
        GET_STORE_BY_ID,
        {
          id,
        }
      );
      return data.store;
    },
    enabled: !!id,
  });
}

// ==================== Discount Hooks ====================

export function useStoreDiscounts(
  filters?: DiscountFiltersInput,
  pagination?: PaginationInput
) {
  return useQuery<DiscountsResponse>({
    queryKey: ["discounts", filters, pagination],
    queryFn: async () => {
      const data = await graphqlClient.request<{
        discounts: DiscountsResponse;
      }>(GET_STORE_DISCOUNTS, { filters, pagination });
      return data.discounts;
    },
  });
}

export function useCreateDiscount() {
  const queryClient = useQueryClient();

  return useMutation<Discount, Error, CreateDiscountInput>({
    mutationFn: async (input: CreateDiscountInput) => {
      const data = await graphqlClient.request<{ createDiscount: Discount }>(
        CREATE_DISCOUNT,
        { input }
      );
      return data.createDiscount;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
}

export function useUpdateDiscount() {
  const queryClient = useQueryClient();

  return useMutation<
    Discount,
    Error,
    { id: string; input: UpdateDiscountInput }
  >({
    mutationFn: async ({ id, input }) => {
      const data = await graphqlClient.request<{ updateDiscount: Discount }>(
        UPDATE_DISCOUNT,
        { id, input }
      );
      return data.updateDiscount;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
}

export function useDeleteDiscount() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: async (id: string) => {
      const data = await graphqlClient.request<{ deleteDiscount: boolean }>(
        DELETE_DISCOUNT,
        { id }
      );
      return data.deleteDiscount;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });
}

// ==================== Coupon Hooks ====================

export function useStoreCoupons(
  filters?: CouponFiltersInput,
  pagination?: PaginationInput
) {
  return useQuery<CouponsResponse>({
    queryKey: ["coupons", filters, pagination],
    queryFn: async () => {
      // TODO: Admin coupon listing not implemented in backend yet
      // The API only has myCoupons (for current user) and individual coupon queries
      // const data = await graphqlClient.request<{ coupons: CouponsResponse }>(
      //   GET_STORE_COUPONS,
      //   { filters, pagination }
      // );
      // return data.coupons;
      return {
        data: [],
        paginationInfo: {
          total: 0,
          page: 1,
          pageSize: 20,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    },
    enabled: false, // Disabled until backend implements admin coupon listing
  });
}

// ==================== Catalog Hooks ====================

export function useStoreCatalogs(storeId: string) {
  return useQuery<Catalog[]>({
    queryKey: ["catalogs", storeId],
    queryFn: async () => {
      // TODO: Catalog feature not implemented in backend yet
      // const data = await graphqlClient.request<{ storeCatalogs: Catalog[] }>(
      //   GET_STORE_CATALOGS,
      //   { storeId }
      // );
      // return data.storeCatalogs;
      return [];
    },
    enabled: false, // Disabled until backend implements catalog feature
  });
}

export function useCatalogItems(catalogId: string) {
  return useQuery<CatalogItem[]>({
    queryKey: ["catalog-items", catalogId],
    queryFn: async () => {
      // TODO: Catalog feature not implemented in backend yet
      // const data = await graphqlClient.request<{ catalogItems: CatalogItem[] }>(
      //   GET_CATALOG_ITEMS,
      //   { catalogId }
      // );
      // return data.catalogItems;
      return [];
    },
    enabled: false, // Disabled until backend implements catalog feature
  });
}

export function useCreateCatalog() {
  const queryClient = useQueryClient();

  return useMutation<Catalog, Error, CreateCatalogInput>({
    mutationFn: async (_input: CreateCatalogInput) => {
      // TODO: Catalog feature not implemented in backend yet
      throw new Error("Catalog feature is not yet implemented in the backend");
      // const data = await graphqlClient.request<{ createCatalog: Catalog }>(
      //   CREATE_CATALOG,
      //   { input }
      // );
      // return data.createCatalog;
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["catalogs", variables.storeId],
      });
    },
  });
}

export function useCreateCatalogItem() {
  const queryClient = useQueryClient();

  return useMutation<CatalogItem, Error, CreateCatalogItemInput>({
    mutationFn: async () => {
      // TODO: Catalog feature not implemented in backend yet
      throw new Error("Catalog feature is not yet implemented in the backend");
      // const data = await graphqlClient.request<{ createCatalogItem: CatalogItem }>(
      //   CREATE_CATALOG_ITEM,
      //   { input }
      // );
      // return data.createCatalogItem;
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["catalog-items", variables.catalogId],
      });
    },
  });
}

// ==================== User Management Hooks ====================

export function useUsers(
  page?: number,
  first?: number,
  includeDisabled?: boolean,
  search?: string
) {
  return useQuery<UsersResponse>({
    queryKey: ["users", page, first, includeDisabled, search],
    queryFn: async () => {
      const data = await graphqlClient.request<{ users: UsersResponse }>(
        GET_USERS,
        { page, first, includeDisabled, search }
      );
      return data.users;
    },
  });
}

export function useUserDetailsWithActivity(userId: string) {
  return useQuery<UserDetailsWithActivity>({
    queryKey: ["user-details", userId],
    queryFn: async () => {
      const data = await graphqlClient.request<{
        userDetailsWithActivity: UserDetailsWithActivity;
      }>(GET_USER_DETAILS_WITH_ACTIVITY, { userId });
      return data.userDetailsWithActivity;
    },
    enabled: !!userId,
  });
}
