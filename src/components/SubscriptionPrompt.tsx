"use client";

import { Crown, X, Zap, Gift } from "lucide-react";
import { useRouter } from "next/navigation";

interface SubscriptionPromptProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: "coupon_generation" | "max_discount" | "general";
  waitTimeMinutes?: number;
}

export function SubscriptionPrompt({
  isOpen,
  onClose,
  trigger = "general",
  waitTimeMinutes,
}: SubscriptionPromptProps): React.JSX.Element | null {
  const router = useRouter();

  if (!isOpen) {
    return null;
  }

  const getTriggerMessage = () => {
    switch (trigger) {
      case "coupon_generation":
        return {
          title: "Cooldown Period Active",
          description: waitTimeMinutes
            ? `You need to wait ${waitTimeMinutes} minutes before generating another coupon. Upgrade to Premium to generate coupons instantly without any waiting!`
            : "Upgrade to Premium to generate coupons instantly without waiting periods or daily limits.",
          icon: <Zap className="w-6 h-6" />,
        };
      case "max_discount":
        return {
          title: "Maximum Discount Available",
          description:
            "Premium members get access to the highest discount tiers at all restaurants.",
          icon: <Gift className="w-6 h-6" />,
        };
      default:
        return {
          title: "Unlock Premium Features",
          description:
            "Get instant coupon generation and maximum discounts for just $ 99 MXN/month.",
          icon: <Crown className="w-6 h-6" />,
        };
    }
  };

  const message = getTriggerMessage();

  const handleUpgrade = () => {
    onClose();
    router.push("/subscription");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl animate-slide-up">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-t-xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              {message.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold">{message.title}</h2>
              <p className="text-sm text-white/90">Ñamy Premium</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-6">{message.description}</p>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-gray-700">
                Instant coupon generation (no waiting!)
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Gift className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-gray-700">
                Maximum discounts at all restaurants
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Crown className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-gray-700">
                Priority support & early access
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
            <p className="text-3xl font-bold text-gray-900">
              $ 99 MXN
              <span className="text-lg font-normal text-gray-600">/month</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Cancel anytime • No commitments
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleUpgrade}
              className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
            >
              <Crown className="w-5 h-5 inline mr-2" />
              Upgrade to Premium
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Maybe Later
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
