"use client";

import { Crown, Check, X, Zap, Gift, Wallet } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

import { ExploreHeader } from "@/app/explore/components/ExploreHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useWallet, useWalletBalance } from "@/domains/payment/hooks";
import {
  useSubscriptionStatus,
  useCreateCheckout,
  useCancelSubscription,
  useToggleAutoRenew,
  usePayPremiumWithWallet,
} from "@/domains/subscription/hooks";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";

function SubscriptionContent(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, updateUser } = useAuthStore();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "wallet">(
    "stripe"
  );

  // Fetch subscription status
  const { data: subscriptionData, isLoading: _statusLoading } =
    useSubscriptionStatus();
  const createCheckout = useCreateCheckout();
  const cancelSubscription = useCancelSubscription();
  const toggleAutoRenew = useToggleAutoRenew();
  const payWithWallet = usePayPremiumWithWallet();

  // Fetch wallet data
  const { data: wallet } = useWallet({ userId: user?.id || "" });
  const { data: balance } = useWalletBalance(wallet?.id || "");

  const subscriptionStatus = subscriptionData?.mySubscriptionStatus;
  const hasActiveSubscription = subscriptionStatus?.isPremium || false;
  const subscriptionEndDate = subscriptionStatus?.premiumEndDate || null;
  const autoRenewEnabled = subscriptionStatus?.autoRenew ?? true;

  const walletBalance = balance?.availableBalance || 0;
  const premiumCost = 9900; // 99 MXN in cents
  const hasEnoughBalance = walletBalance >= premiumCost;

  const formatAmount = (amount: number, currency: string = "MXN") => {
    const value = (amount / 100).toFixed(2);
    return `$${value}${currency.toUpperCase()}`;
  };

  // Sync subscription status with auth store
  useEffect(() => {
    if (subscriptionStatus && user) {
      // Update the user in auth store with latest premium status
      if (
        user.isPremium !== subscriptionStatus.isPremium ||
        user.premiumEndDate !== subscriptionStatus.premiumEndDate
      ) {
        updateUser({
          isPremium: subscriptionStatus.isPremium,
          premiumEndDate: subscriptionStatus.premiumEndDate,
          premiumStartDate: subscriptionStatus.premiumStartDate,
        });
      }
    }
  }, [subscriptionStatus, user, updateUser]);

  // Handle success/cancel query parameters from Stripe redirect
  useEffect(() => {
    const success = searchParams?.get("success");
    const canceled = searchParams?.get("canceled");

    if (success === "true") {
      toast({
        title: "🎉 Welcome to Premium!",
        description:
          "Your subscription is now active. Enjoy instant coupon generation and maximum discounts!",
        duration: 5000,
      });

      // Wait a moment for webhook to process, then reload to fetch updated data
      setTimeout(() => {
        window.location.href = "/subscription";
      }, 2000);
    } else if (canceled === "true") {
      toast({
        title: "Subscription Canceled",
        description: "You can subscribe anytime to unlock premium benefits.",
        variant: "default",
      });
      // Remove query params from URL
      router.replace("/subscription");
    }
  }, [searchParams, router, toast]);

  const handleSubscribe = async () => {
    setIsProcessing(true);
    try {
      const baseUrl = window.location.origin;
      const successUrl = `${baseUrl}/subscription?success=true`;
      const cancelUrl = `${baseUrl}/subscription?canceled=true`;

      const checkoutSession = await createCheckout.mutateAsync({
        successUrl,
        cancelUrl,
      });

      toast({
        title: "Redirecting to checkout...",
        description: "You'll be redirected to complete your subscription.",
      });

      // Redirect to Stripe checkout
      window.location.href = checkoutSession.url;
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to start subscription process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        "Your subscription will remain active until the end of the current billing period. Continue?"
      )
    ) {
      return;
    }

    try {
      await cancelSubscription.mutateAsync();
      toast({
        title: "Subscription Cancelled",
        description:
          "Your subscription will end at the end of the current period.",
      });
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleAutoRenew = async () => {
    try {
      const newEnabled = !autoRenewEnabled;
      await toggleAutoRenew.mutateAsync(newEnabled);
      toast({
        title: newEnabled ? "Auto-renew Enabled" : "Auto-renew Disabled",
        description: newEnabled
          ? "Your subscription will renew automatically."
          : "Your subscription will not renew automatically.",
      });
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to update auto-renew setting. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleWalletPayment = async () => {
    if (!hasEnoughBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You need ${formatAmount(premiumCost)} in your wallet. Current balance: ${formatAmount(walletBalance)}`,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await payWithWallet.mutateAsync();

      // Calculate premium dates
      const premiumStartDate = new Date().toISOString();
      const premiumEndDate = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString();

      // Update auth store immediately with premium status
      updateUser({
        isPremium: true,
        premiumStartDate,
        premiumEndDate,
      });

      toast({
        title: "🎉 Welcome to Premium!",
        description: result.message,
        duration: 5000,
      });

      // Reload to fetch updated data and ensure all components reflect the change
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: unknown) {
      toast({
        title: "Payment Failed",
        description:
          (error instanceof Error ? error.message : null) ||
          "Failed to process wallet payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20">
        {/* Top Navigation */}
        <ExploreHeader isAuthenticated={isAuthenticated} />

        {/* Main Content */}
        <div className="pt-14 pb-16 bg-gradient-hero p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Ñamy Premium
              </h1>
              <p className="text-muted-foreground">
                Unlock instant discounts and maximum savings
              </p>
            </div>

            {/* Current Subscription Status */}
            {hasActiveSubscription ? (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      <h2 className="text-xl font-semibold text-gray-900">
                        Active Subscription
                      </h2>
                    </div>
                    <p className="text-sm text-gray-600">
                      Next billing date:{" "}
                      {subscriptionEndDate
                        ? new Date(subscriptionEndDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">$ 99 MXN</p>
                    <p className="text-sm text-gray-600">per month</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="auto-renew"
                      checked={autoRenewEnabled}
                      onChange={() => void handleToggleAutoRenew()}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="auto-renew"
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      Auto-renew subscription
                    </label>
                  </div>

                  <button
                    onClick={() => void handleCancelSubscription()}
                    className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    Cancel Subscription
                  </button>
                </div>
              </div>
            ) : null}

            {/* Pricing Card */}
            <div className="bg-white rounded-lg shadow-xl p-8 mb-6 border-2 border-yellow-400">
              <div className="text-center mb-6">
                <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  ⚡ BEST VALUE
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                  $ 99 MXN
                  <span className="text-xl font-normal text-gray-600">
                    /month
                  </span>
                </h2>
                <p className="text-gray-600">Cancel anytime</p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      <Zap className="w-4 h-4 inline mr-1 text-yellow-500" />
                      Instant Coupon Generation
                    </p>
                    <p className="text-sm text-gray-600">
                      Generate coupons instantly without waiting or limitations
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      <Gift className="w-4 h-4 inline mr-1 text-orange-500" />
                      Maximum Discounts Available
                    </p>
                    <p className="text-sm text-gray-600">
                      Access to the highest discount tier at all participating
                      restaurants
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Priority Support
                    </p>
                    <p className="text-sm text-gray-600">
                      Get help faster with dedicated premium support
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Early Access to New Features
                    </p>
                    <p className="text-sm text-gray-600">
                      Be the first to try new restaurants and features
                    </p>
                  </div>
                </div>
              </div>

              {/* Free Features Comparison */}
              <div className="border-t border-gray-200 pt-6 mb-8">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Free Plan Limitations:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <X className="w-4 h-4 text-red-500" />
                    <span>Limited coupon generation (cooldown periods)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <X className="w-4 h-4 text-red-500" />
                    <span>Lower discount tiers</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection & CTA */}
              {!hasActiveSubscription ? (
                <div className="space-y-4">
                  {/* Wallet Balance Display */}
                  {wallet ? (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-5 h-5 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">
                            Wallet Balance
                          </span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">
                          {formatAmount(walletBalance)}
                        </span>
                      </div>
                      {!hasEnoughBalance ? (
                        <p className="text-xs text-red-600 mt-2">
                          Insufficient balance. Need {formatAmount(premiumCost)}{" "}
                          to pay with wallet.
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  {/* Payment Method Tabs */}
                  <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setPaymentMethod("stripe")}
                      className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all ${
                        paymentMethod === "stripe"
                          ? "bg-white text-gray-900 shadow"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      💳 Card Payment
                    </button>
                    <button
                      onClick={() => setPaymentMethod("wallet")}
                      disabled={
                        !wallet || !hasEnoughBalance || hasActiveSubscription
                      }
                      className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all ${
                        paymentMethod === "wallet"
                          ? "bg-white text-gray-900 shadow"
                          : "text-gray-600 hover:text-gray-900"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      💰 Wallet Payment
                    </button>
                  </div>

                  {/* Payment Button */}
                  {paymentMethod === "stripe" ? (
                    <button
                      onClick={() => void handleSubscribe()}
                      disabled={isProcessing}
                      className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl text-lg"
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <>
                          <Crown className="w-5 h-5 inline mr-2" />
                          Pay with Card - {formatAmount(premiumCost)}
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => void handleWalletPayment()}
                      disabled={isProcessing || !hasEnoughBalance}
                      className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl text-lg"
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <>
                          <Wallet className="w-5 h-5 inline mr-2" />
                          Pay from Wallet - {formatAmount(premiumCost)}
                        </>
                      )}
                    </button>
                  )}

                  <p className="text-xs text-gray-500 text-center">
                    {paymentMethod === "stripe"
                      ? "Secure payment powered by Stripe. Cancel anytime."
                      : "Instant activation. No auto-renewal for wallet payments."}
                  </p>
                </div>
              ) : (
                <div className="text-center py-4 bg-green-50 rounded-lg">
                  <p className="text-green-700 font-semibold">
                    ✓ You&apos;re a Premium Member!
                  </p>
                </div>
              )}
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    Can I cancel anytime?
                  </p>
                  <p className="text-sm text-gray-600">
                    Yes! You can cancel your subscription at any time. Your
                    premium access will continue until the end of your current
                    billing period.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    What payment methods do you accept?
                  </p>
                  <p className="text-sm text-gray-600">
                    We accept all major credit and debit cards through our
                    secure payment partner, Stripe.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    How does instant coupon generation work?
                  </p>
                  <p className="text-sm text-gray-600">
                    With Premium, you can generate coupons instantly at any
                    restaurant without waiting periods or daily limits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
    </ProtectedRoute>
  );
}

export default function SubscriptionPage(): React.JSX.Element {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SubscriptionContent />
    </Suspense>
  );
}
