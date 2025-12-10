import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { graphqlClient } from "@/lib/graphql-client";

import {
  GET_WALLET,
  GET_WALLET_BALANCE,
  GET_WALLET_TRANSACTIONS,
  CREATE_WALLET,
  CREATE_PAYMENT_INTENT,
  CREATE_CHECKOUT_SESSION,
  DEPOSIT_TO_WALLET,
  WITHDRAW_FROM_WALLET,
  SPEND_FROM_WALLET,
  GET_PAYMENT_INTENT,
  CANCEL_PAYMENT_INTENT,
  GET_SUBSCRIPTION,
  GET_SUBSCRIPTIONS_BY_WALLET,
  GET_ACTIVE_SUBSCRIPTIONS_BY_WALLET,
  GET_SUBSCRIPTION_BILLING_HISTORY,
  CREATE_SUBSCRIPTION,
  CANCEL_SUBSCRIPTION,
  PAUSE_SUBSCRIPTION,
  RESUME_SUBSCRIPTION,
  PROCESS_SUBSCRIPTION_BILLING,
} from "./graphql";
import type {
  Wallet,
  WalletBalance,
  PaginatedTransactions,
  PaymentIntent,
  CheckoutSession,
  GetWalletInput,
  GetTransactionsInput,
  CreateWalletInput,
  CreatePaymentIntentInput,
  CreateCheckoutSessionInput,
  DepositToWalletInput,
  WithdrawFromWalletInput,
  SpendFromWalletInput,
  WalletTransaction,
  Subscription,
  SubscriptionBillingHistory,
  CreateSubscriptionInput,
  CancelSubscriptionInput,
} from "./types";

// ==================== Wallet Queries ====================

export function useWallet(input: GetWalletInput) {
  return useQuery<Wallet>({
    queryKey: ["wallet", input],
    queryFn: async () => {
      const data = await graphqlClient.request<{ wallet: Wallet }>(GET_WALLET, {
        input,
      });
      return data.wallet;
    },
    enabled: !!(input.id || input.userId),
  });
}

export function useWalletBalance(walletId: string) {
  return useQuery<WalletBalance>({
    queryKey: ["walletBalance", walletId],
    queryFn: async () => {
      const data = await graphqlClient.request<{
        walletBalance: WalletBalance;
      }>(GET_WALLET_BALANCE, { walletId });
      return data.walletBalance;
    },
    enabled: !!walletId,
  });
}

export function useWalletTransactions(input: GetTransactionsInput) {
  return useQuery<PaginatedTransactions>({
    queryKey: ["walletTransactions", input],
    queryFn: async () => {
      const data = await graphqlClient.request<{
        walletTransactions: PaginatedTransactions;
      }>(GET_WALLET_TRANSACTIONS, { input });
      return data.walletTransactions;
    },
    enabled: !!input.walletId,
  });
}

// ==================== Wallet Mutations ====================

export function useCreateWallet() {
  const queryClient = useQueryClient();

  return useMutation<Wallet, Error, CreateWalletInput>({
    mutationFn: async (input) => {
      const data = await graphqlClient.request<{ createWallet: Wallet }>(
        CREATE_WALLET,
        { input }
      );
      return data.createWallet;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}

export function useDepositToWallet() {
  const queryClient = useQueryClient();

  return useMutation<WalletTransaction, Error, DepositToWalletInput>({
    mutationFn: async (input) => {
      const data = await graphqlClient.request<{
        depositToWallet: WalletTransaction;
      }>(DEPOSIT_TO_WALLET, input);
      return data.depositToWallet;
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["wallet", { id: variables.walletId }],
      });
      void queryClient.invalidateQueries({
        queryKey: ["walletBalance", variables.walletId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["walletTransactions", { walletId: variables.walletId }],
      });
    },
  });
}

export function useWithdrawFromWallet() {
  const queryClient = useQueryClient();

  return useMutation<WalletTransaction, Error, WithdrawFromWalletInput>({
    mutationFn: async (input) => {
      const data = await graphqlClient.request<{
        withdrawFromWallet: WalletTransaction;
      }>(WITHDRAW_FROM_WALLET, input);
      return data.withdrawFromWallet;
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["wallet", { id: variables.walletId }],
      });
      void queryClient.invalidateQueries({
        queryKey: ["walletBalance", variables.walletId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["walletTransactions", { walletId: variables.walletId }],
      });
    },
  });
}

export function useSpendFromWallet() {
  const queryClient = useQueryClient();

  return useMutation<WalletTransaction, Error, SpendFromWalletInput>({
    mutationFn: async (input) => {
      const data = await graphqlClient.request<{
        spendFromWallet: WalletTransaction;
      }>(SPEND_FROM_WALLET, { input });
      return data.spendFromWallet;
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["wallet", { id: variables.walletId }],
      });
      void queryClient.invalidateQueries({
        queryKey: ["walletBalance", variables.walletId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["walletTransactions", { walletId: variables.walletId }],
      });
    },
  });
}

// ==================== Payment Mutations ====================

export function useCreatePaymentIntent() {
  return useMutation<PaymentIntent, Error, CreatePaymentIntentInput>({
    mutationFn: async (input) => {
      const data = await graphqlClient.request<{
        createPaymentIntent: PaymentIntent;
      }>(CREATE_PAYMENT_INTENT, { input });
      return data.createPaymentIntent;
    },
  });
}

export function useCreateCheckoutSession() {
  return useMutation<CheckoutSession, Error, CreateCheckoutSessionInput>({
    mutationFn: async (input) => {
      const data = await graphqlClient.request<{
        createCheckoutSession: CheckoutSession;
      }>(CREATE_CHECKOUT_SESSION, { input });
      return data.createCheckoutSession;
    },
  });
}

export function usePaymentIntent(paymentIntentId: string) {
  return useQuery<PaymentIntent>({
    queryKey: ["paymentIntent", paymentIntentId],
    queryFn: async () => {
      const data = await graphqlClient.request<{
        paymentIntent: PaymentIntent;
      }>(GET_PAYMENT_INTENT, { paymentIntentId });
      return data.paymentIntent;
    },
    enabled: !!paymentIntentId,
  });
}

export function useCancelPaymentIntent() {
  const queryClient = useQueryClient();

  return useMutation<PaymentIntent, Error, string>({
    mutationFn: async (paymentIntentId) => {
      const data = await graphqlClient.request<{
        cancelPaymentIntent: PaymentIntent;
      }>(CANCEL_PAYMENT_INTENT, { paymentIntentId });
      return data.cancelPaymentIntent;
    },
    onSuccess: (_, paymentIntentId) => {
      void queryClient.invalidateQueries({
        queryKey: ["paymentIntent", paymentIntentId],
      });
    },
  });
}

// ==================== Subscription Queries ====================

export function useSubscription(subscriptionId: string) {
  return useQuery<Subscription>({
    queryKey: ["subscription", subscriptionId],
    queryFn: async () => {
      const data = await graphqlClient.request<{ subscription: Subscription }>(
        GET_SUBSCRIPTION,
        { id: subscriptionId }
      );
      return data.subscription;
    },
    enabled: !!subscriptionId,
  });
}

export function useSubscriptionsByWallet(walletId: string) {
  return useQuery<Subscription[]>({
    queryKey: ["subscriptions", { walletId }],
    queryFn: async () => {
      const data = await graphqlClient.request<{
        subscriptionsByWallet: Subscription[];
      }>(GET_SUBSCRIPTIONS_BY_WALLET, { walletId });
      return data.subscriptionsByWallet;
    },
    enabled: !!walletId,
  });
}

export function useActiveSubscriptionsByWallet(walletId: string) {
  return useQuery<Subscription[]>({
    queryKey: ["activeSubscriptions", { walletId }],
    queryFn: async () => {
      const data = await graphqlClient.request<{
        activeSubscriptionsByWallet: Subscription[];
      }>(GET_ACTIVE_SUBSCRIPTIONS_BY_WALLET, { walletId });
      return data.activeSubscriptionsByWallet;
    },
    enabled: !!walletId,
  });
}

export function useSubscriptionBillingHistory(subscriptionId: string) {
  return useQuery<SubscriptionBillingHistory[]>({
    queryKey: ["subscriptionBillingHistory", subscriptionId],
    queryFn: async () => {
      const data = await graphqlClient.request<{
        subscriptionBillingHistory: SubscriptionBillingHistory[];
      }>(GET_SUBSCRIPTION_BILLING_HISTORY, { subscriptionId });
      return data.subscriptionBillingHistory;
    },
    enabled: !!subscriptionId,
  });
}

// ==================== Subscription Mutations ====================

export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation<Subscription, Error, CreateSubscriptionInput>({
    mutationFn: async (input) => {
      const data = await graphqlClient.request<{
        createSubscription: Subscription;
      }>(CREATE_SUBSCRIPTION, { input });
      return data.createSubscription;
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: ["subscriptions", { walletId: data.walletId }],
      });
      void queryClient.invalidateQueries({
        queryKey: ["activeSubscriptions", { walletId: data.walletId }],
      });
      void queryClient.invalidateQueries({
        queryKey: ["wallet", { id: data.walletId }],
      });
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation<Subscription, Error, CancelSubscriptionInput>({
    mutationFn: async (input) => {
      const data = await graphqlClient.request<{
        cancelSubscription: Subscription;
      }>(CANCEL_SUBSCRIPTION, { input });
      return data.cancelSubscription;
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: ["subscription", data.id],
      });
      void queryClient.invalidateQueries({
        queryKey: ["subscriptions", { walletId: data.walletId }],
      });
      void queryClient.invalidateQueries({
        queryKey: ["activeSubscriptions", { walletId: data.walletId }],
      });
    },
  });
}

export function usePauseSubscription() {
  const queryClient = useQueryClient();

  return useMutation<Subscription, Error, string>({
    mutationFn: async (subscriptionId) => {
      const data = await graphqlClient.request<{
        pauseSubscription: Subscription;
      }>(PAUSE_SUBSCRIPTION, { subscriptionId });
      return data.pauseSubscription;
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: ["subscription", data.id],
      });
      void queryClient.invalidateQueries({
        queryKey: ["subscriptions", { walletId: data.walletId }],
      });
      void queryClient.invalidateQueries({
        queryKey: ["activeSubscriptions", { walletId: data.walletId }],
      });
    },
  });
}

export function useResumeSubscription() {
  const queryClient = useQueryClient();

  return useMutation<Subscription, Error, string>({
    mutationFn: async (subscriptionId) => {
      const data = await graphqlClient.request<{
        resumeSubscription: Subscription;
      }>(RESUME_SUBSCRIPTION, { subscriptionId });
      return data.resumeSubscription;
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: ["subscription", data.id],
      });
      void queryClient.invalidateQueries({
        queryKey: ["subscriptions", { walletId: data.walletId }],
      });
      void queryClient.invalidateQueries({
        queryKey: ["activeSubscriptions", { walletId: data.walletId }],
      });
    },
  });
}

export function useProcessSubscriptionBilling() {
  const queryClient = useQueryClient();

  return useMutation<SubscriptionBillingHistory, Error, string>({
    mutationFn: async (subscriptionId) => {
      const data = await graphqlClient.request<{
        processSubscriptionBilling: SubscriptionBillingHistory;
      }>(PROCESS_SUBSCRIPTION_BILLING, { subscriptionId });
      return data.processSubscriptionBilling;
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: ["subscription", data.subscriptionId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["subscriptionBillingHistory", data.subscriptionId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["walletTransactions"],
      });
    },
  });
}
