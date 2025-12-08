"use client";

import { useState } from "react";

import { useToast } from "@/hooks/use-toast";

import { StripePaymentForm } from "./StripePaymentForm";

interface DepositFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PRESET_AMOUNTS = [1000, 2500, 5000, 10000]; // in cents

export function DepositForm({ onSuccess, onCancel }: DepositFormProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState<number>(5000); // Default $50.00
  const [customAmount, setCustomAmount] = useState<string>("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handlePresetClick = (preset: number) => {
    setAmount(preset);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const cents = Math.round(parseFloat(value || "0") * 100);
    if (!isNaN(cents) && cents > 0) {
      setAmount(cents);
    }
  };

  const handleContinue = () => {
    if (amount < 100) {
      toast({
        title: "Invalid Amount",
        description: "Minimum deposit amount is $1.00",
        variant: "destructive",
      });
      return;
    }
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = (_paymentIntentId: string) => {
    toast({
      title: "Payment Successful!",
      description: "Your wallet will be credited shortly.",
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

  if (showPaymentForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Complete Payment
          </h3>
          <button
            onClick={() => setShowPaymentForm(false)}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Back
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Amount:</span> $
            {(amount / 100).toFixed(2)}
          </p>
        </div>

        <StripePaymentForm
          amount={amount}
          description="Wallet deposit"
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

        <div className="grid grid-cols-2 gap-3 mb-4">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset}
              onClick={() => handlePresetClick(preset)}
              className={`py-3 px-4 rounded-lg border-2 transition-all ${
                amount === preset && !customAmount
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              <span className="text-lg font-semibold">
                ${(preset / 100).toFixed(2)}
              </span>
            </button>
          ))}
        </div>

        <div>
          <label
            htmlFor="custom-amount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Or enter custom amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              id="custom-amount"
              type="number"
              min="1"
              step="0.01"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Minimum deposit: $1.00</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Deposit amount</span>
          <span className="text-lg font-semibold text-gray-900">
            ${(amount / 100).toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Processing fee</span>
          <span className="text-gray-900">$0.00</span>
        </div>
        <div className="border-t border-gray-200 mt-3 pt-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-blue-600">
              ${(amount / 100).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {onCancel ? (
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        ) : null}
        <button
          onClick={handleContinue}
          disabled={amount < 100}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
