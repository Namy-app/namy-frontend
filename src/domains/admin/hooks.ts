import * as Sentry from "@sentry/nextjs";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import { useMemo } from "react";

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
  GET_STORE_COUPONS,
  GET_USERS,
  GET_ADMIN_USER_PROFILE_SUMMARY,
  GET_ADMIN_USER_COUPONS,
  GET_ADMIN_USER_REDEMPTIONS,
  GET_ADMIN_USER_REFERRALS,
  GET_USER_DETAILS_WITH_ACTIVITY,
  GET_USER_DETAILS_WITH_ACTIVITY_ULTRA_LEGACY,
  CREATE_CATALOG,
  UPDATE_CATALOG,
  GET_STORE_CATALOGS,
  GET_CATEGORIES_BY_NAME_QUERY,
  GET_CHALLENGES_QUERY,
  CREATE_CHALLENGE_MUTATION,
  UPDATE_CHALLENGE_MUTATION,
  DELETE_CHALLENGE_MUTATION,
  GET_MURAL_MODERATION_QUEUE,
  MODERATE_MURAL_POST_MUTATION,
  GET_ADMIN_REVIEWS,
  ADMIN_DELETE_REVIEW_MUTATION,
  GET_CATEGORIES_BY_STORE_TYPE_QUERY,
  GET_CATEGORIES_QUERY,
  GET_CATEGORY_BY_ID_QUERY,
  CREATE_CATEGORY_MUTATION,
  UPDATE_CATEGORY_MUTATION,
  DELETE_CATEGORY_MUTATION,
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
  type AdminUserProfileSummary,
  type AdminUserCouponsResponse,
  type AdminUserRedemptionsResponse,
  type AdminUserReferralsResponse,
  type AdminUserDetailPageData,
  type AdminUserDetailDataSource,
  type UserDetailsWithActivity,
  type UserDetailsWithActivityUltraLegacy,
  type UserDetailsActivityFilters,
  type ActivityDateRange,
  type Challenge,
  type CreateChallengeInput,
  type UpdateChallengeInput,
  type EntityType,
  type MuralModerationQueueResponse,
  type ModerateMuralPostInput,
  type MuralPostStatus,
  type AdminReviewsResponse,
  type Category,
  type CategoriesResponse,
  type CategoryFiltersInput,
  type CreateCategoryInput,
  type UpdateCategoryInput,
  type StoreType,
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
      void queryClient.invalidateQueries({ queryKey: ["stores"] });
      void queryClient.invalidateQueries({ queryKey: ["store-statistics"] });
    },
    onError: (error, variables) => {
      Sentry.captureException(error, {
        tags: { domain: "store", action: "create_store" },
        extra: { storeName: variables.name, city: variables.city },
      });
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
      void queryClient.invalidateQueries({ queryKey: ["stores"] });
      void queryClient.invalidateQueries({ queryKey: ["store", variables.id] });
      void queryClient.invalidateQueries({
        queryKey: ["store-pin", variables.id],
      });
      void queryClient.invalidateQueries({ queryKey: ["store-statistics"] });
    },
    onError: (error, variables) => {
      Sentry.captureException(error, {
        tags: { domain: "store", action: "update_store" },
        extra: { storeId: variables.id },
      });
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
    onError: (error, variables) => {
      Sentry.captureException(error, {
        tags: { domain: "discount", action: "create_discount" },
        extra: { storeId: variables.storeId, title: variables.title },
      });
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
    onError: (error, variables) => {
      Sentry.captureException(error, {
        tags: { domain: "discount", action: "update_discount" },
        extra: { discountId: variables.id },
      });
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
  pagination?: PaginationInput,
  options?: { enabled?: boolean }
) {
  return useQuery<CouponsResponse>({
    queryKey: ["store-coupons", filters, pagination],
    queryFn: async () => {
      const data = await graphqlClient.request<{ coupons: CouponsResponse }>(
        GET_STORE_COUPONS,
        { filters, pagination }
      );
      return data.coupons;
    },
    enabled:
      options?.enabled !== false &&
      (!!filters?.storeId ||
        !!filters?.storeIds?.length ||
        options?.enabled === true),
  });
}

export function useStoreCouponCounts(storeIds: string[]) {
  const totalQuery = useQuery<CouponsResponse>({
    queryKey: ["store-coupon-counts-total", storeIds],
    queryFn: async () => {
      const data = await graphqlClient.request<{ coupons: CouponsResponse }>(
        GET_STORE_COUPONS,
        {
          filters: { storeIds, includeExpired: true },
          pagination: { page: 1, first: 1000 },
        }
      );
      return data.coupons;
    },
    enabled: storeIds.length > 0,
  });

  const redeemedQuery = useQuery<CouponsResponse>({
    queryKey: ["store-coupon-counts-redeemed", storeIds],
    queryFn: async () => {
      const data = await graphqlClient.request<{ coupons: CouponsResponse }>(
        GET_STORE_COUPONS,
        {
          filters: { storeIds, used: true, includeExpired: true },
          pagination: { page: 1, first: 1000 },
        }
      );
      return data.coupons;
    },
    enabled: storeIds.length > 0,
  });

  const totalByStore = new Map<string, number>();
  const redeemedByStore = new Map<string, number>();

  for (const coupon of totalQuery.data?.data ?? []) {
    totalByStore.set(
      coupon.storeId,
      (totalByStore.get(coupon.storeId) ?? 0) + 1
    );
  }
  for (const coupon of redeemedQuery.data?.data ?? []) {
    redeemedByStore.set(
      coupon.storeId,
      (redeemedByStore.get(coupon.storeId) ?? 0) + 1
    );
  }

  return {
    totalByStore,
    redeemedByStore,
    isLoading: totalQuery.isLoading || redeemedQuery.isLoading,
  };
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
    onError: (error, variables) => {
      Sentry.captureException(error, {
        tags: { domain: "catalog", action: "create_catalog" },
        extra: { storeId: variables.storeId, name: variables.name },
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
    onError: (error, variables) => {
      Sentry.captureException(error, {
        tags: { domain: "catalog", action: "update_catalog" },
        extra: { catalogId: variables.id },
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

const defaultAdminActivityPagination: PaginationInput = { page: 1, first: 100 };

/** Optional `enabled` for list hooks so the admin page can load profile first, then lists */
export type AdminUserListQueryOptions = {
  enabled?: boolean;
};

/** Collect GraphQL error lines from `response.errors` and from `Error.message` (graphql-request `ClientError` embeds the body in `message` when `errors` is missing). */
function graphqlErrorMessages(error: unknown): string[] {
  const out: string[] = [];
  if (error instanceof Error && error.message) {
    out.push(error.message);
  }
  if (error && typeof error === "object" && "response" in error) {
    const res = (
      error as {
        response?: { errors?: Array<{ message?: string }> };
      }
    ).response;
    for (const m of (res?.errors ?? [])
      .map((e) => e.message ?? "")
      .filter((m): m is string => Boolean(m))) {
      out.push(m);
    }
  }
  if (out.length === 0 && typeof error === "string") {
    out.push(error);
  }
  return [...new Set(out)].filter(Boolean);
}

/**
 * True when the API schema predates the split admin user queries.
 * Older servers may reject the whole document first (e.g. unknown
 * `ActivityDateRangeInput`) before reporting missing `adminUser*` fields.
 */
function isAdminSplitQueriesUnsupportedError(error: unknown): boolean {
  return graphqlErrorMessages(error).some(
    (m) =>
      /Cannot query field ["']adminUser/i.test(m) ||
      (/Unknown type/i.test(m) && /ActivityDateRangeInput/i.test(m))
  );
}

/** Monolith `userDetailsWithActivity` predates activity filter args + referral fields */
function isUltraLegacyUserDetailsMonolithError(error: unknown): boolean {
  return graphqlErrorMessages(error).some(
    (m) =>
      m.includes("UserDetailsActivityFiltersInput") ||
      (m.includes("Unknown argument") && m.includes("activityFilters")) ||
      m.includes('Cannot query field "totalReferrals"') ||
      m.includes('Cannot query field "referrals"')
  );
}

function inDateRange(iso: string, range: ActivityDateRange): boolean {
  const t = new Date(iso).getTime();
  const from = range.from ? new Date(range.from).getTime() : -Infinity;
  const to = range.to ? new Date(range.to).getTime() : Infinity;
  return t >= from && t <= to;
}

function legacyListPaginationInfo(rowCount: number): PaginationInfo {
  const total = Math.max(0, rowCount);
  return {
    total,
    page: 1,
    pageSize: total === 0 ? 1 : total,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };
}

function mapLegacyUserDetailsToPageData(
  raw: UserDetailsWithActivity
): AdminUserDetailPageData {
  const referrals = raw.referrals ?? [];
  return {
    dataSource: "legacy",
    profile: {
      id: raw.id,
      email: raw.email,
      phone: raw.phone,
      displayName: raw.displayName,
      avatarUrl: raw.avatarUrl,
      role: raw.role,
      city: raw.city,
      country: raw.country,
      verified: raw.verified,
      active: raw.active,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      lastSeen: raw.lastSeen,
      referralCode: raw.referralCode,
      level: raw.level,
      monthlyUsageCount: raw.monthlyUsageCount,
      totalCouponUsageCount: raw.totalCouponUsageCount,
      totalCoupons: raw.totalCoupons,
      totalRedemptions: raw.totalRedemptions,
      totalReferrals: raw.totalReferrals ?? referrals.length,
    },
    coupons: {
      data: raw.coupons,
      paginationInfo: legacyListPaginationInfo(raw.coupons.length),
    },
    redemptions: {
      data: raw.redemptions,
      paginationInfo: legacyListPaginationInfo(raw.redemptions.length),
    },
    referrals: {
      data: referrals,
      paginationInfo: legacyListPaginationInfo(referrals.length),
    },
  };
}

function mapUltraLegacyUserDetailsToPageData(
  raw: UserDetailsWithActivityUltraLegacy,
  activityFilters?: UserDetailsActivityFilters
): AdminUserDetailPageData {
  let coupons = raw.coupons;
  let redemptions = raw.redemptions;
  if (activityFilters?.coupons) {
    coupons = coupons.filter((c) =>
      inDateRange(c.createdAt, activityFilters.coupons!)
    );
  }
  if (activityFilters?.redemptions) {
    redemptions = redemptions.filter((r) =>
      inDateRange(r.redeemedAt, activityFilters.redemptions!)
    );
  }
  return {
    dataSource: "legacy-compat",
    profile: {
      id: raw.id,
      email: raw.email,
      phone: raw.phone,
      displayName: raw.displayName,
      avatarUrl: raw.avatarUrl,
      role: raw.role,
      city: raw.city,
      country: raw.country,
      verified: raw.verified,
      active: raw.active,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      lastSeen: raw.lastSeen,
      referralCode: raw.referralCode,
      level: raw.level,
      monthlyUsageCount: raw.monthlyUsageCount,
      totalCouponUsageCount: raw.totalCouponUsageCount,
      totalCoupons: raw.totalCoupons,
      totalRedemptions: raw.totalRedemptions,
      totalReferrals: 0,
    },
    coupons: {
      data: coupons,
      paginationInfo: legacyListPaginationInfo(coupons.length),
    },
    redemptions: {
      data: redemptions,
      paginationInfo: legacyListPaginationInfo(redemptions.length),
    },
    referrals: {
      data: [],
      paginationInfo: legacyListPaginationInfo(0),
    },
  };
}

function adminUserDetailFilterKey(
  userId: string,
  activityFilters?: UserDetailsActivityFilters | null
): string {
  return `${userId}:${JSON.stringify(activityFilters ?? null)}`;
}

/** Set when split queries succeed; `fetchLegacyAdminUserDetailBundleDeduped` sets legacy / legacy-compat */
const resolvedAdminUserDetailDataSource = new Map<
  string,
  AdminUserDetailDataSource
>();

const inFlightLegacyBundles = new Map<
  string,
  Promise<AdminUserDetailPageData>
>();

async function fetchLegacyAdminUserDetailBundleDeduped(
  userId: string,
  activityFilters?: UserDetailsActivityFilters | null
): Promise<AdminUserDetailPageData> {
  const filters = activityFilters ?? undefined;
  const key = adminUserDetailFilterKey(userId, activityFilters);
  const existing = inFlightLegacyBundles.get(key);
  if (existing) {
    return existing;
  }
  const bundlePromise = (async (): Promise<AdminUserDetailPageData> => {
    const variables: {
      userId: string;
      activityFilters?: UserDetailsActivityFilters;
    } = { userId };
    if (filters) {
      variables.activityFilters = filters;
    }
    let bundle: AdminUserDetailPageData;
    try {
      const legacy = await graphqlClient.request<{
        userDetailsWithActivity: UserDetailsWithActivity;
      }>(GET_USER_DETAILS_WITH_ACTIVITY, variables);
      bundle = mapLegacyUserDetailsToPageData(legacy.userDetailsWithActivity);
    } catch (legacyMonolithError) {
      if (!isUltraLegacyUserDetailsMonolithError(legacyMonolithError)) {
        throw legacyMonolithError;
      }
      const ultra = await graphqlClient.request<{
        userDetailsWithActivity: UserDetailsWithActivityUltraLegacy;
      }>(GET_USER_DETAILS_WITH_ACTIVITY_ULTRA_LEGACY, { userId });
      bundle = mapUltraLegacyUserDetailsToPageData(
        ultra.userDetailsWithActivity,
        filters
      );
    }
    resolvedAdminUserDetailDataSource.set(key, bundle.dataSource);
    return bundle;
  })();

  inFlightLegacyBundles.set(key, bundlePromise);
  void bundlePromise.finally(() => {
    inFlightLegacyBundles.delete(key);
  });

  return bundlePromise;
}

/** Parallel admin profile query; shares one deduped legacy HTTP round-trip with the list hooks when split APIs are missing */
export function useAdminUserProfileSummary(
  userId: string,
  activityFilters?: UserDetailsActivityFilters | null
) {
  const filters = activityFilters ?? undefined;
  const sourceKey = adminUserDetailFilterKey(userId, activityFilters);
  return useQuery<AdminUserProfileSummary>({
    queryKey: ["admin-user-profile-summary", userId, filters ?? null],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        const data = await graphqlClient.request<{
          adminUserProfileSummary: AdminUserProfileSummary;
        }>(GET_ADMIN_USER_PROFILE_SUMMARY, { userId });
        resolvedAdminUserDetailDataSource.set(sourceKey, "split");
        return data.adminUserProfileSummary;
      } catch (error) {
        if (!isAdminSplitQueriesUnsupportedError(error)) {
          throw error;
        }
        const bundle = await fetchLegacyAdminUserDetailBundleDeduped(
          userId,
          filters
        );
        return bundle.profile;
      }
    },
    enabled: !!userId,
  });
}

export function useAdminUserCoupons(
  userId: string,
  activityFilters?: UserDetailsActivityFilters | null,
  options?: AdminUserListQueryOptions
) {
  const filters = activityFilters ?? undefined;
  const pagination = defaultAdminActivityPagination;
  const sourceKey = adminUserDetailFilterKey(userId, activityFilters);
  return useQuery<AdminUserCouponsResponse>({
    queryKey: ["admin-user-coupons", userId, filters ?? null],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        const data = await graphqlClient.request<{
          adminUserCoupons: AdminUserCouponsResponse;
        }>(GET_ADMIN_USER_COUPONS, {
          userId,
          createdAtRange: filters?.coupons,
          pagination,
        });
        resolvedAdminUserDetailDataSource.set(sourceKey, "split");
        return data.adminUserCoupons;
      } catch (error) {
        if (!isAdminSplitQueriesUnsupportedError(error)) {
          throw error;
        }
        const bundle = await fetchLegacyAdminUserDetailBundleDeduped(
          userId,
          filters
        );
        return bundle.coupons;
      }
    },
    enabled: !!userId && (options?.enabled ?? true),
  });
}

export function useAdminUserRedemptions(
  userId: string,
  activityFilters?: UserDetailsActivityFilters | null,
  options?: AdminUserListQueryOptions
) {
  const filters = activityFilters ?? undefined;
  const pagination = defaultAdminActivityPagination;
  const sourceKey = adminUserDetailFilterKey(userId, activityFilters);
  return useQuery<AdminUserRedemptionsResponse>({
    queryKey: ["admin-user-redemptions", userId, filters ?? null],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        const data = await graphqlClient.request<{
          adminUserRedemptions: AdminUserRedemptionsResponse;
        }>(GET_ADMIN_USER_REDEMPTIONS, {
          userId,
          redeemedAtRange: filters?.redemptions,
          pagination,
        });
        resolvedAdminUserDetailDataSource.set(sourceKey, "split");
        return data.adminUserRedemptions;
      } catch (error) {
        if (!isAdminSplitQueriesUnsupportedError(error)) {
          throw error;
        }
        const bundle = await fetchLegacyAdminUserDetailBundleDeduped(
          userId,
          filters
        );
        return bundle.redemptions;
      }
    },
    enabled: !!userId && (options?.enabled ?? true),
  });
}

export function useAdminUserReferrals(
  userId: string,
  activityFilters?: UserDetailsActivityFilters | null,
  options?: AdminUserListQueryOptions
) {
  const filters = activityFilters ?? undefined;
  const pagination = defaultAdminActivityPagination;
  const sourceKey = adminUserDetailFilterKey(userId, activityFilters);
  return useQuery<AdminUserReferralsResponse>({
    queryKey: ["admin-user-referrals", userId, filters ?? null],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        const data = await graphqlClient.request<{
          adminUserReferrals: AdminUserReferralsResponse;
        }>(GET_ADMIN_USER_REFERRALS, {
          userId,
          createdAtRange: filters?.referrals,
          pagination,
        });
        resolvedAdminUserDetailDataSource.set(sourceKey, "split");
        return data.adminUserReferrals;
      } catch (error) {
        if (!isAdminSplitQueriesUnsupportedError(error)) {
          throw error;
        }
        const bundle = await fetchLegacyAdminUserDetailBundleDeduped(
          userId,
          filters
        );
        return bundle.referrals;
      }
    },
    enabled: !!userId && (options?.enabled ?? true),
  });
}

/** Resolved after profile succeeds — `split` vs monolith paths for activity-filter UI copy */
export function useAdminUserDetailDataSource(
  profileQuery: Pick<
    UseQueryResult<AdminUserProfileSummary>,
    "isSuccess" | "data"
  >,
  userId: string,
  activityFilters?: UserDetailsActivityFilters | null
): AdminUserDetailDataSource | undefined {
  const key = adminUserDetailFilterKey(userId, activityFilters);
  return useMemo(() => {
    if (!profileQuery.isSuccess || !profileQuery.data) {
      return undefined;
    }
    return resolvedAdminUserDetailDataSource.get(key) ?? "split";
  }, [profileQuery.isSuccess, profileQuery.data, key]);
}

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

// ==================== Category Queries & Mutations (Admin CRUD) ====================

export function useCategories(
  filters?: CategoryFiltersInput,
  pagination?: PaginationInput
) {
  return useQuery<CategoriesResponse>({
    queryKey: ["categories", filters, pagination],
    queryFn: async () => {
      const data = await graphqlClient.request<{
        categories: CategoriesResponse;
      }>(GET_CATEGORIES_QUERY, { filters, pagination });
      return data.categories;
    },
  });
}

export function useCategory(id: string) {
  return useQuery<Category>({
    queryKey: ["category", id],
    queryFn: async () => {
      const data = await graphqlClient.request<{ category: Category }>(
        GET_CATEGORY_BY_ID_QUERY,
        { id }
      );
      return data.category;
    },
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, CreateCategoryInput>({
    mutationFn: async (input: CreateCategoryInput) => {
      const data = await graphqlClient.request<{
        createCategory: Category;
      }>(CREATE_CATEGORY_MUTATION, { input });
      return data.createCategory;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      void queryClient.invalidateQueries({ queryKey: ["categories-by-name"] });
      void queryClient.invalidateQueries({
        queryKey: ["categories-by-store-type"],
      });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation<
    Category,
    Error,
    { id: string; input: UpdateCategoryInput }
  >({
    mutationFn: async ({ id, input }) => {
      const data = await graphqlClient.request<{
        updateCategory: Category;
      }>(UPDATE_CATEGORY_MUTATION, { id, input });
      return data.updateCategory;
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      void queryClient.invalidateQueries({
        queryKey: ["category", variables.id],
      });
      void queryClient.invalidateQueries({ queryKey: ["categories-by-name"] });
      void queryClient.invalidateQueries({
        queryKey: ["categories-by-store-type"],
      });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: async (id: string) => {
      const data = await graphqlClient.request<{
        deleteCategory: boolean;
      }>(DELETE_CATEGORY_MUTATION, { id });
      return data.deleteCategory;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      void queryClient.invalidateQueries({ queryKey: ["categories-by-name"] });
      void queryClient.invalidateQueries({
        queryKey: ["categories-by-store-type"],
      });
    },
  });
}

// ==================== Category Queries (by name / store type) ====================

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

export function useGetCategoriesByStoreType({
  storeType,
  name,
  enabled = true,
  pagination = { page: 1, first: 50 },
}: {
  storeType?: StoreType | string;
  name?: string;
  enabled?: boolean;
  pagination?: PaginationInput;
}) {
  return useQuery<CategoriesResponse, Error>({
    queryKey: ["categories-by-store-type", storeType, name, pagination],
    queryFn: async () => {
      const data = await graphqlClient.request<{
        categories: CategoriesResponse;
      }>(GET_CATEGORIES_BY_STORE_TYPE_QUERY, {
        storeType: storeType ?? null,
        name: name ?? null,
        pagination,
      });
      return data.categories;
    },
    enabled,
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
    onError: (error, variables) => {
      Sentry.captureException(error, {
        tags: { domain: "review", action: "delete_review" },
        extra: { reviewId: variables.id },
      });
    },
  });
}
