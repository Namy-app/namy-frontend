import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { useMemo } from "react";

import {
  MY_ACTIVE_COUPONS_QUERY,
  MY_DISCOUNTS_QUERY,
  MY_INVOICES_QUERY,
  MY_OWNER_BILLING_QUERY,
  MY_OWNER_INVOICES_QUERY,
  MY_STORES_BALANCE_QUERY,
  MY_PAYMENT_METHOD_QUERY,
  MY_REDEMPTIONS_QUERY,
  MY_STORES_QUERY,
  CREATE_SETUP_INTENT_MUTATION,
  PORTAL_CHANGE_PASSWORD_MUTATION,
  PORTAL_LOGIN_MUTATION,
  PORTAL_SWITCH_STORE_MUTATION,
  PORTAL_VERIFY_PIN_MUTATION,
  SET_DEFAULT_PAYMENT_METHOD_MUTATION,
  UPDATE_STORE_HOURS_MUTATION,
  UPDATE_STORE_INFO_MUTATION,
} from "@/domains/portal/graphql";
import { usePortalAuthStore } from "@/domains/portal/store/portalAuthStore";
import { usePortalSelectedStoreStore } from "@/domains/portal/store/portalSelectedStoreStore";
import type {
  PortalActiveCoupon,
  PortalDiscount,
  PortalInvoice,
  PortalLoginResponse as PortalLoginPayload,
  PortalOpenDays,
  PortalOwnerBilling,
  PortalOwnerInvoice,
  PortalPaymentMethod,
  PortalRedemption,
  PortalStore,
  PortalStoreBalance,
  PortalSwitchResponse,
  PortalVerifyResponse,
  UpdatePortalStoreInfoInput,
} from "@/domains/portal/types";
import { portalGraphqlRequest } from "@/lib/portalGraphqlClient";

interface PortalLoginGqlResponse {
  portalLogin: PortalLoginPayload;
}

interface PortalVerifyPinGqlResponse {
  portalVerifyPin: PortalVerifyResponse;
}

interface PortalSwitchStoreGqlResponse {
  portalSwitchStore: PortalSwitchResponse;
}

interface PortalChangePasswordResponse {
  portalChangePassword: boolean;
}

interface MyStoresResponse {
  myStores: PortalStore[];
}

interface MyInvoicesResponse {
  myInvoices: PortalInvoice[];
}

interface MyOwnerBillingResponse {
  myOwnerBilling: PortalOwnerBilling;
}

interface MyOwnerInvoicesResponse {
  myOwnerInvoices: PortalOwnerInvoice[];
}

interface MyStoresBalanceResponse {
  myStoresBalance: PortalStoreBalance[];
}

interface MyRedemptionsResponse {
  myRedemptions: PortalRedemption[];
}

interface MyActiveCouponsResponse {
  myActiveCoupons: PortalActiveCoupon[];
}

interface MyDiscountsResponse {
  myDiscounts: PortalDiscount[];
}

interface UpdateStoreInfoResponse {
  updateStoreInfo: PortalStore;
}

interface UpdateStoreHoursResponse {
  updateStoreHours: PortalStore;
}

interface MyPaymentMethodResponse {
  myPaymentMethod: PortalPaymentMethod | null;
}

interface CreateSetupIntentResponse {
  createSetupIntent: string;
}

interface SetDefaultPaymentMethodResponse {
  setDefaultPaymentMethod: boolean;
}

export const PORTAL_STORES_QUERY_KEY = ["portal", "myStores"] as const;
export const PORTAL_PAYMENT_METHOD_QUERY_KEY = [
  "portal",
  "myPaymentMethod",
] as const;
export const PORTAL_OWNER_BILLING_QUERY_KEY = [
  "portal",
  "myOwnerBilling",
] as const;
export const PORTAL_OWNER_INVOICES_QUERY_KEY = [
  "portal",
  "myOwnerInvoices",
] as const;
export const PORTAL_STORES_BALANCE_QUERY_KEY = [
  "portal",
  "myStoresBalance",
] as const;

const PORTAL_QUERY_DEFAULTS = {
  staleTime: 30_000,
  refetchOnWindowFocus: false,
} as const;

export function portalPaymentMethodQueryKey() {
  return PORTAL_PAYMENT_METHOD_QUERY_KEY;
}

export function usePortalLogin(): UseMutationResult<
  PortalLoginPayload,
  Error,
  { email: string; password: string }
> {
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const data = await portalGraphqlRequest<PortalLoginGqlResponse>(
        PORTAL_LOGIN_MUTATION,
        { email, password }
      );
      return data.portalLogin;
    },
  });
}

export function usePortalVerifyPin(): UseMutationResult<
  PortalVerifyResponse,
  Error,
  { tempToken: string; storeId: string; pin: string }
> {
  return useMutation({
    mutationFn: async ({ tempToken, storeId, pin }) => {
      const data = await portalGraphqlRequest<PortalVerifyPinGqlResponse>(
        PORTAL_VERIFY_PIN_MUTATION,
        { tempToken, storeId, pin }
      );
      return data.portalVerifyPin;
    },
  });
}

export function usePortalSwitchStore(): UseMutationResult<
  PortalSwitchResponse,
  Error,
  { storeId: string }
> {
  return useMutation({
    mutationFn: async ({ storeId }) => {
      const data = await portalGraphqlRequest<PortalSwitchStoreGqlResponse>(
        PORTAL_SWITCH_STORE_MUTATION,
        { storeId }
      );
      return data.portalSwitchStore;
    },
  });
}

export function usePortalChangePassword(): UseMutationResult<
  boolean,
  Error,
  { currentPassword: string; newPassword: string }
> {
  return useMutation({
    mutationFn: async ({ currentPassword, newPassword }) => {
      const data = await portalGraphqlRequest<PortalChangePasswordResponse>(
        PORTAL_CHANGE_PASSWORD_MUTATION,
        { currentPassword, newPassword }
      );
      return data.portalChangePassword;
    },
  });
}

export function useMyStores(): UseQueryResult<PortalStore[], Error> {
  const isAuthenticated = usePortalAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: PORTAL_STORES_QUERY_KEY,
    queryFn: async () => {
      const data =
        await portalGraphqlRequest<MyStoresResponse>(MY_STORES_QUERY);
      return data.myStores;
    },
    enabled: isAuthenticated,
    ...PORTAL_QUERY_DEFAULTS,
  });
}

export function useMyInvoices(
  storeId: string | null
): UseQueryResult<PortalInvoice[], Error> {
  const isAuthenticated = usePortalAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["portal", "myInvoices", storeId],
    queryFn: async () => {
      const data = await portalGraphqlRequest<MyInvoicesResponse>(
        MY_INVOICES_QUERY,
        { storeId }
      );
      return data.myInvoices;
    },
    enabled: isAuthenticated && Boolean(storeId),
    ...PORTAL_QUERY_DEFAULTS,
  });
}

export function useMyOwnerBilling(): UseQueryResult<PortalOwnerBilling, Error> {
  const isAuthenticated = usePortalAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: PORTAL_OWNER_BILLING_QUERY_KEY,
    queryFn: async () => {
      const data = await portalGraphqlRequest<MyOwnerBillingResponse>(
        MY_OWNER_BILLING_QUERY
      );
      return data.myOwnerBilling;
    },
    enabled: isAuthenticated,
    ...PORTAL_QUERY_DEFAULTS,
  });
}

export function useMyOwnerInvoices(): UseQueryResult<
  PortalOwnerInvoice[],
  Error
> {
  const isAuthenticated = usePortalAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: PORTAL_OWNER_INVOICES_QUERY_KEY,
    queryFn: async () => {
      const data = await portalGraphqlRequest<MyOwnerInvoicesResponse>(
        MY_OWNER_INVOICES_QUERY
      );
      return data.myOwnerInvoices;
    },
    enabled: isAuthenticated,
    ...PORTAL_QUERY_DEFAULTS,
  });
}

export function useMyStoresBalance(): UseQueryResult<
  PortalStoreBalance[],
  Error
> {
  const isAuthenticated = usePortalAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: PORTAL_STORES_BALANCE_QUERY_KEY,
    queryFn: async () => {
      const data = await portalGraphqlRequest<MyStoresBalanceResponse>(
        MY_STORES_BALANCE_QUERY
      );
      return data.myStoresBalance;
    },
    enabled: isAuthenticated,
    ...PORTAL_QUERY_DEFAULTS,
  });
}

export function useMyRedemptions(
  storeId: string | null,
  month?: string
): UseQueryResult<PortalRedemption[], Error> {
  const isAuthenticated = usePortalAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["portal", "myRedemptions", storeId, month ?? null],
    queryFn: async () => {
      const data = await portalGraphqlRequest<MyRedemptionsResponse>(
        MY_REDEMPTIONS_QUERY,
        { storeId, month }
      );
      return data.myRedemptions;
    },
    enabled: isAuthenticated && Boolean(storeId),
    ...PORTAL_QUERY_DEFAULTS,
  });
}

export function useMyActiveCoupons(
  storeId: string | null
): UseQueryResult<PortalActiveCoupon[], Error> {
  const isAuthenticated = usePortalAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["portal", "myActiveCoupons", storeId],
    queryFn: async () => {
      const data = await portalGraphqlRequest<MyActiveCouponsResponse>(
        MY_ACTIVE_COUPONS_QUERY,
        { storeId }
      );
      return data.myActiveCoupons;
    },
    enabled: isAuthenticated && Boolean(storeId),
    ...PORTAL_QUERY_DEFAULTS,
  });
}

export function useMyDiscounts(
  storeId: string | null
): UseQueryResult<PortalDiscount[], Error> {
  const isAuthenticated = usePortalAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["portal", "myDiscounts", storeId],
    queryFn: async () => {
      const data = await portalGraphqlRequest<MyDiscountsResponse>(
        MY_DISCOUNTS_QUERY,
        { storeId }
      );
      return data.myDiscounts;
    },
    enabled: isAuthenticated && Boolean(storeId),
    ...PORTAL_QUERY_DEFAULTS,
  });
}

export function useUpdateStoreInfo(): UseMutationResult<
  PortalStore,
  Error,
  UpdatePortalStoreInfoInput
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input) => {
      const data = await portalGraphqlRequest<UpdateStoreInfoResponse>(
        UPDATE_STORE_INFO_MUTATION,
        { ...input }
      );
      return data.updateStoreInfo;
    },
    onSuccess: (updatedStore) => {
      queryClient.setQueryData<PortalStore[]>(PORTAL_STORES_QUERY_KEY, (old) =>
        old?.map((store) =>
          store.id === updatedStore.id ? { ...store, ...updatedStore } : store
        )
      );
      void queryClient.invalidateQueries({ queryKey: PORTAL_STORES_QUERY_KEY });
    },
  });
}

export function useUpdateStoreHours(): UseMutationResult<
  PortalStore,
  Error,
  { storeId: string; openDays: PortalOpenDays }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ storeId, openDays }) => {
      const data = await portalGraphqlRequest<UpdateStoreHoursResponse>(
        UPDATE_STORE_HOURS_MUTATION,
        { storeId, openDays }
      );
      return data.updateStoreHours;
    },
    onSuccess: (updatedStore) => {
      queryClient.setQueryData<PortalStore[]>(PORTAL_STORES_QUERY_KEY, (old) =>
        old?.map((store) =>
          store.id === updatedStore.id ? { ...store, ...updatedStore } : store
        )
      );
      void queryClient.invalidateQueries({ queryKey: PORTAL_STORES_QUERY_KEY });
    },
  });
}

export function useMyPaymentMethod(): UseQueryResult<
  PortalPaymentMethod | null,
  Error
> {
  const isAuthenticated = usePortalAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: PORTAL_PAYMENT_METHOD_QUERY_KEY,
    queryFn: async () => {
      const data = await portalGraphqlRequest<MyPaymentMethodResponse>(
        MY_PAYMENT_METHOD_QUERY
      );
      return data.myPaymentMethod;
    },
    enabled: isAuthenticated,
    ...PORTAL_QUERY_DEFAULTS,
  });
}

export function useCreateSetupIntent(): UseMutationResult<string, Error, void> {
  return useMutation({
    mutationFn: async () => {
      const data = await portalGraphqlRequest<CreateSetupIntentResponse>(
        CREATE_SETUP_INTENT_MUTATION
      );
      return data.createSetupIntent;
    },
  });
}

export function useSetDefaultPaymentMethod(): UseMutationResult<
  boolean,
  Error,
  { paymentMethodId: string }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ paymentMethodId }) => {
      const data = await portalGraphqlRequest<SetDefaultPaymentMethodResponse>(
        SET_DEFAULT_PAYMENT_METHOD_MUTATION,
        { paymentMethodId }
      );
      return data.setDefaultPaymentMethod;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: PORTAL_PAYMENT_METHOD_QUERY_KEY,
      });
      void queryClient.invalidateQueries({
        queryKey: PORTAL_OWNER_BILLING_QUERY_KEY,
      });
    },
  });
}

export interface SelectedPortalStoreResult {
  stores: PortalStore[];
  selectedStore: PortalStore | null;
  selectedStoreId: string | null;
  setSelectedStoreId: (storeId: string) => void;
  isLoading: boolean;
  isSwitchingStore: boolean;
  isError: boolean;
  error: Error | null;
}

export function useSelectedPortalStore(): SelectedPortalStoreResult {
  const storesQuery = useMyStores();
  const defaultStoreId = usePortalAuthStore((state) => state.defaultStoreId);
  const selectedStoreId = usePortalSelectedStoreStore(
    (state) => state.selectedStoreId
  );
  const isSwitchingStore = usePortalSelectedStoreStore(
    (state) => state.isSwitchingStore
  );
  const setSelectedStoreId = usePortalSelectedStoreStore(
    (state) => state.setSelectedStoreId
  );

  const stores = useMemo(() => storesQuery.data ?? [], [storesQuery.data]);
  const activeStoreId = selectedStoreId ?? defaultStoreId;

  const selectedStore =
    stores.find((store) => store.id === activeStoreId) ?? stores[0] ?? null;

  return {
    stores,
    selectedStore,
    selectedStoreId: selectedStore?.id ?? null,
    setSelectedStoreId,
    isLoading: storesQuery.isLoading,
    isSwitchingStore,
    isError: storesQuery.isError,
    error: storesQuery.error,
  };
}
