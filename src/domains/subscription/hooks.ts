import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { graphqlRequest } from "@/lib/graphql-client";
import {
  CREATE_PREMIUM_CHECKOUT_MUTATION,
  CANCEL_PREMIUM_SUBSCRIPTION_MUTATION,
  TOGGLE_PREMIUM_AUTO_RENEW_MUTATION,
  MY_SUBSCRIPTION_STATUS_QUERY,
  PAY_PREMIUM_WITH_WALLET_MUTATION,
} from "@/lib/graphql-queries";

export interface SubscriptionStatus {
  isPremium: boolean;
  premiumStartDate?: string;
  premiumEndDate?: string;
  autoRenew: boolean;
}

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

export interface CreateCheckoutInput {
  successUrl: string;
  cancelUrl: string;
}

/**
 * Get user's premium subscription status
 */
export function useSubscriptionStatus() {
  return useQuery<{ mySubscriptionStatus: SubscriptionStatus }>({
    queryKey: ["subscription-status"],
    queryFn: async () => {
      return graphqlRequest<{ mySubscriptionStatus: SubscriptionStatus }>(
        MY_SUBSCRIPTION_STATUS_QUERY
      );
    },
  });
}

/**
 * Create Stripe checkout session for premium subscription
 */
export function useCreateCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateCheckoutInput) => {
      const data = await graphqlRequest<{
        createPremiumCheckoutSession: CheckoutSession;
      }>(CREATE_PREMIUM_CHECKOUT_MUTATION, { input });

      return data.createPremiumCheckoutSession;
    },
    onSuccess: () => {
      // Invalidate subscription status to refresh after checkout
      void queryClient.invalidateQueries({ queryKey: ["subscription-status"] });
    },
  });
}

/**
 * Cancel premium subscription (effective at period end)
 */
export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const data = await graphqlRequest<{
        cancelPremiumSubscription: { message: string };
      }>(CANCEL_PREMIUM_SUBSCRIPTION_MUTATION);

      return data.cancelPremiumSubscription;
    },
    onSuccess: () => {
      // Invalidate subscription status to refresh after cancellation
      void queryClient.invalidateQueries({ queryKey: ["subscription-status"] });
    },
  });
}

/**
 * Toggle auto-renew for premium subscription
 */
export function useToggleAutoRenew() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enabled: boolean) => {
      const data = await graphqlRequest<{
        togglePremiumAutoRenew: { message: string };
      }>(TOGGLE_PREMIUM_AUTO_RENEW_MUTATION, { enabled });

      return data.togglePremiumAutoRenew;
    },
    onSuccess: () => {
      // Invalidate subscription status to refresh after toggle
      void queryClient.invalidateQueries({ queryKey: ["subscription-status"] });
    },
  });
}

/**
 * Pay for premium subscription using wallet balance
 */
export function usePayPremiumWithWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const data = await graphqlRequest<{
        payPremiumWithWallet: { message: string };
      }>(PAY_PREMIUM_WITH_WALLET_MUTATION);

      return data.payPremiumWithWallet;
    },
    onSuccess: () => {
      // Invalidate subscription status to refresh after payment
      void queryClient.invalidateQueries({ queryKey: ["subscription-status"] });
      // Invalidate wallet balance to reflect the payment deduction
      void queryClient.invalidateQueries({ queryKey: ["wallet-balance"] });
      void queryClient.invalidateQueries({ queryKey: ["wallet"] });
      void queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
    },
  });
}
