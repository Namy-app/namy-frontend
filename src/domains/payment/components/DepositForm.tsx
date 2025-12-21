"use client";

import { useState } from "react";

import { useToast } from "@/hooks/use-toast";

import { StripePaymentForm } from "./StripePaymentForm";

interface DepositFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface TierOption {
  userPays: number; // in cents
  walletCredit: number; // in cents
  bonusPercentage: number;
  description: string;
  isPopular?: boolean;
}

// TODO: Fetch these from backend configuration API
// These tiers define deposit bonuses (e.g., 10% bonus on $100 deposit)
const TIER_OPTIONS: TierOption[] = [
  {
    userPays: 5000, // $50 MXN
    walletCredit: 5000,
    bonusPercentage: 0,
    description: "Start with the basics",
  },
  {
    userPays: 10000, // $100 MXN
    walletCredit: 11000,
    bonusPercentage: 10,
    description: "Receive an extra 10%",
  },
  {
    userPays: 20000, // $200 MXN
    walletCredit: 24000,
    bonusPercentage: 20,
    description: "Earn 20% more!",
    isPopular: true,
  },
  {
    userPays: 50000, // $500 MXN
    walletCredit: 65000,
    bonusPercentage: 30,
    description: "Earn 30% more!",
  },
];

export function DepositForm({ onSuccess, onCancel }: DepositFormProps) {
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState<TierOption>(
    TIER_OPTIONS[0]!
  );
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const currentAmount = isCustom
    ? Math.round(parseFloat(customAmount || "0") * 100)
    : selectedTier?.userPays || 0;

  const currentCredit = isCustom
    ? currentAmount
    : selectedTier?.walletCredit || 0;

  const bonusAmount = currentCredit - currentAmount;

  const handleTierClick = (tier: TierOption) => {
    setSelectedTier(tier);
    setCustomAmount("");
    setIsCustom(false);
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const cents = Math.round(parseFloat(value || "0") * 100);
    if (!isNaN(cents) && cents >= 5000) {
      setIsCustom(true);
    } else {
      setIsCustom(false);
    }
  };

  const handleContinue = () => {
    if (currentAmount < 5000) {
      toast({
        title: "Invalid Amount",
        description: "Minimum deposit amount is $50 MXN",
        variant: "destructive",
      });
      return;
    }
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = (_paymentIntentId: string) => {
    toast({
      title: "Payment Successful!",
      description: `Your wallet has been credited with ${formatAmount(currentCredit)} MXN`,
    });
    setShowPaymentForm(false);
    onSuccess?.();
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
    setShowPaymentForm(false);
  };

  const formatAmount = (amount: number) => {
    return `$${(amount / 100).toFixed(0)}MXN`;
  };

  if (showPaymentForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Pago completo</h3>
          <button
            onClick={() => setShowPaymentForm(false)}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Atrás
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">You Pay:</span>{" "}
            {formatAmount(currentAmount)}
          </p>
          {bonusAmount > 0 && (
            <p className="text-sm text-green-800 mt-2">
              <span className="font-semibold">Bono:</span>{" "}
              {formatAmount(currentCredit)} (+{formatAmount(bonusAmount)}
              bono)
            </p>
          )}
        </div>

        <StripePaymentForm
          amount={currentAmount}
          description={`Wallet deposit - ${formatAmount(currentCredit)} credit`}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Choose Amount
        </h3>

        <div className="space-y-3 mb-6">
          {TIER_OPTIONS.map((tier, idx) => (
            <div key={idx} className="relative">
              {tier.isPopular ? (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Most popular 💥
                </div>
              ) : null}
              <button
                onClick={() => handleTierClick(tier)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedTier === tier && !isCustom
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {formatAmount(tier.userPays)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {tier.description}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-bold text-green-600">
                      {formatAmount(tier.walletCredit)}
                    </p>
                    {tier.bonusPercentage > 0 && (
                      <p className="text-xs text-green-600 font-semibold">
                        +{tier.bonusPercentage}% bonus
                      </p>
                    )}
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-300 pt-6 mt-6">
          <h4 className="font-semibold text-gray-900 mb-3">
            Or enter custom amount
          </h4>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
              $
            </span>
            <input
              type="number"
              min="50"
              step="1"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              placeholder="Minimum 50 MXN"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
              MXN
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Minimum custom amount: $50 MXN
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-linear-to-br from-green-50 to-blue-50 rounded-lg p-6 border-2 border-green-200">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">You Pay</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatAmount(currentAmount)}
            </span>
          </div>

          {bonusAmount > 0 && (
            <div className="bg-white rounded-lg p-3 border border-green-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-green-700">
                  💰 Bonus Points
                </span>
                <span className="text-lg font-bold text-green-600">
                  +{formatAmount(bonusAmount)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-linear-to-r from-green-500 to-green-400 h-2 rounded-full"
                  style={{
                    width: `${((bonusAmount / currentCredit) * 100).toFixed(0)}%`,
                  }}
                />
              </div>
            </div>
          )}

          <div className="border-t border-green-200 pt-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Crédito Total</span>
              <span className="text-3xl font-bold bg-linear-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                {formatAmount(currentCredit)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {onCancel ? (
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        ) : null}
        <button
          onClick={handleContinue}
          disabled={currentAmount < 5000}
          className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Continuar al Pago
        </button>
      </div>
    </div>
  );
}
