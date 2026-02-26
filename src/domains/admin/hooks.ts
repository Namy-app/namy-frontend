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
  GET_STORE_PIN,
  RESEND_STORE_PIN_EMAIL,
  CREATE_DISCOUNT,
  UPDATE_DISCOUNT,
  DELETE_DISCOUNT,
  GET_STORE_DISCOUNTS,
  GET_USERS,
  GET_USER_DETAILS_WITH_ACTIVITY,
  CREATE_CATALOG,
  UPDATE_CATALOG,
  GET_STORE_CATALOGS,
  GET_CATEGORIES_BY_NAME_QUERY,
  GET_SUBCATEGORIES_BY_CATEGORY_QUERY,
  GET_CHALLENGES_QUERY,
  CREATE_CHALLENGE_MUTATION,
  UPDATE_CHALLENGE_MUTATION,
  DELETE_CHALLENGE_MUTATION,
  GET_MURAL_MODERATION_QUEUE,
  MODERATE_MURAL_POST_MUTATION,
  GET_ADMIN_REVIEWS,
  ADMIN_DELETE_REVIEW_MUTATION,
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
  type PaginationInfo,
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
  type UpdateCatalogInput,
  type CreateCatalogItemInput,
  type UsersResponse,
  type UserDetailsWithActivity,
  type Challenge,
  type CreateChallengeInput,
  type UpdateChallengeInput,
  type EntityType,
  type MuralModerationQueueResponse,
  type ModerateMuralPostInput,
  type MuralPostStatus,
  type AdminReviewsResponse,
} from "./types";

// ==================== Store Mutations ====================

export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation<StoreCreationResponse, Error, CreateStoreInput>({
    mutationFn: async (input: CreateStoreInput) => {
      // Clean the input by removing empty strings and undefined values
      const cleanInput = Object.fromEntries(
        Object.entries(input).filter(([_, value]) => {
          // Keep the value if it's not empty string, undefined, or null
          return value !== "" && value !== undefined && value !== null;
        })
      ) as CreateStoreInput;

      const data = await graphqlClient.request<{
        createStore: StoreCreationResponse;
      }>(CREATE_STORE_MUTATION, { input: cleanInput });
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
      void queryClient.invalidateQueries({
        queryKey: ["store-pin", variables.id],
      });
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

export function useStorePin(id: string, enabled = false) {
  return useQuery<string>({
    queryKey: ["store-pin", id],
    queryFn: async () => {
      const data = await graphqlClient.request<{ storePin: string }>(
        GET_STORE_PIN,
        { id }
      );
      return data.storePin;
    },
    enabled: enabled && !!id,
  });
}

// ==================== Discount Hooks ====================

export function useStoreDiscounts(
  filters?: DiscountFiltersInput,
  pagination?: PaginationInput,
  options?: { enabled?: boolean }
) {
  return useQuery<DiscountsResponse>({
    queryKey: ["discounts", filters, pagination],
    queryFn: async () => {
      const data = await graphqlClient.request<{
        discounts: DiscountsResponse;
      }>(GET_STORE_DISCOUNTS, { filters, pagination });
      return data.discounts;
    },
    enabled: options?.enabled !== false,
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
      const data = await graphqlClient.request<{
        storeCatalogs: { data: Catalog[] };
      }>(GET_STORE_CATALOGS, { storeId });
      return data.storeCatalogs.data;
    },
    enabled: !!storeId,
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
    mutationFn: async (input: CreateCatalogInput) => {
      const data = await graphqlClient.request<{ createCatalog: Catalog }>(
        CREATE_CATALOG,
        { input }
      );
      return data.createCatalog;
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["catalogs", variables.storeId],
      });
    },
  });
}

export function useUpdateCatalog() {
  const queryClient = useQueryClient();

  return useMutation<Catalog, Error, UpdateCatalogInput>({
    mutationFn: async (input: UpdateCatalogInput) => {
      const data = await graphqlClient.request<{ updateCatalog: Catalog }>(
        UPDATE_CATALOG,
        { input }
      );
      return data.updateCatalog;
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: ["catalogs", data.storeId],
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

export function useResendStorePinEmail() {
  return useMutation<
    { resendStorePinEmail: boolean },
    Error,
    { id: string; email: string }
  >({
    mutationFn: async (variables) => {
      return graphqlClient.request<{ resendStorePinEmail: boolean }>(
        RESEND_STORE_PIN_EMAIL,
        variables
      );
    },
  });
}

// ==================== Category Queries ====================

interface Category {
  id: string;
  name: string;
  isActive: boolean;
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  isActive: boolean;
}
export function useGetCategoriesByName({
  query = "",
  enabled = true,
  pagination,
}: {
  query: string;
  enabled?: boolean;
  pagination?: PaginationInput;
}) {
  return useQuery<{ data: Category[]; paginationInfo: PaginationInfo }, Error>({
    queryKey: ["categories-by-name", query, pagination],
    queryFn: async () => {
      if (!query.trim()) {
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
      }
      const data = await graphqlClient.request<{
        categories: { data: Category[]; paginationInfo: PaginationInfo };
      }>(GET_CATEGORIES_BY_NAME_QUERY, { name: query, pagination });
      return data.categories;
    },
    enabled: enabled && query.trim().length > 0,
  });
}

export function useGetSubcategoriesByCategory({
  categoryId,
  name,
  enabled = true,
  pagination,
}: {
  categoryId?: string;
  name?: string;
  enabled?: boolean;
  pagination?: PaginationInput;
}) {
  return useQuery<
    { data: Subcategory[]; paginationInfo: PaginationInfo },
    Error
  >({
    queryKey: ["subcategories-by-category", categoryId, name, pagination],
    queryFn: async () => {
      const queryParams: {
        categoryId?: string;
        name?: string;
        pagination?: PaginationInput;
      } = {};
      if (categoryId) {
        queryParams.categoryId = categoryId;
      }
      if (name) {
        queryParams.name = name;
      }
      if (pagination) {
        queryParams.pagination = pagination;
      }

      const data = await graphqlClient.request<{
        subcategories: { data: Subcategory[]; paginationInfo: PaginationInfo };
      }>(GET_SUBCATEGORIES_BY_CATEGORY_QUERY, queryParams);
      return data.subcategories;
    },
    enabled: enabled,
  });
}

// ==================== Challenge Hooks ====================

export function useChallenges(params?: {
  isActive?: boolean;
  entityType?: EntityType;
}) {
  return useQuery<Challenge[]>({
    queryKey: ["challenges", params],
    queryFn: async () => {
      const data = await graphqlClient.request<{ challenges: Challenge[] }>(
        GET_CHALLENGES_QUERY,
        params
      );
      return data.challenges;
    },
  });
}

export function useCreateChallenge() {
  const queryClient = useQueryClient();

  return useMutation<Challenge, Error, CreateChallengeInput>({
    mutationFn: async (input) => {
      const data = await graphqlClient.request<{
        createChallenge: Challenge;
      }>(CREATE_CHALLENGE_MUTATION, { input });
      return data.createChallenge;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
}

export function useUpdateChallenge() {
  const queryClient = useQueryClient();

  return useMutation<
    Challenge,
    Error,
    { id: string; input: UpdateChallengeInput }
  >({
    mutationFn: async ({ id, input }) => {
      const data = await graphqlClient.request<{
        updateChallenge: Challenge;
      }>(UPDATE_CHALLENGE_MUTATION, { id, input });
      return data.updateChallenge;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
}

export function useDeleteChallenge() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: async (id) => {
      const data = await graphqlClient.request<{
        deleteChallenge: { message: string };
      }>(DELETE_CHALLENGE_MUTATION, { id });
      return data.deleteChallenge;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
}

// ==================== Mural Moderation ====================

export function useMuralModerationQueue(params: {
  status?: MuralPostStatus;
  page?: number;
  pageSize?: number;
}) {
  return useQuery<MuralModerationQueueResponse>({
    queryKey: ["muralModerationQueue", params],
    queryFn: async () => {
      const data = await graphqlClient.request<{
        muralModerationQueue: MuralModerationQueueResponse;
      }>(GET_MURAL_MODERATION_QUEUE, { input: params });
      return data.muralModerationQueue;
    },
    staleTime: 30 * 1000,
  });
}

export function useModerateMuralPost() {
  const queryClient = useQueryClient();

  return useMutation<
    { id: string; status: MuralPostStatus; rejectionNote?: string },
    Error,
    { id: string; input: ModerateMuralPostInput }
  >({
    mutationFn: async ({ id, input }) => {
      const data = await graphqlClient.request<{
        moderateMuralPost: {
          id: string;
          status: MuralPostStatus;
          rejectionNote?: string;
        };
      }>(MODERATE_MURAL_POST_MUTATION, { id, input });
      return data.moderateMuralPost;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["muralModerationQueue"],
      });
    },
  });
}

// ==================== Reviews ====================

export function useAdminReviews(params: {
  storeId?: string;
  userId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  return useQuery<AdminReviewsResponse>({
    queryKey: ["adminReviews", params],
    queryFn: async () => {
      const filters: Record<string, unknown> = {};
      if (params.storeId) {
        filters.storeId = params.storeId;
      }
      if (params.userId) {
        filters.userId = params.userId;
      }

      const data = await graphqlClient.request<{
        reviews: AdminReviewsResponse;
      }>(GET_ADMIN_REVIEWS, {
        filters: Object.keys(filters).length ? filters : undefined,
        pagination: {
          page: params.page ?? 1,
          first: params.pageSize ?? 20,
        },
      });
      return data.reviews;
    },
    staleTime: 30 * 1000,
  });
}

export function useAdminDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      const data = await graphqlClient.request<{ adminDeleteReview: boolean }>(
        ADMIN_DELETE_REVIEW_MUTATION,
        { id }
      );
      return data.adminDeleteReview;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
    },
  });
}
