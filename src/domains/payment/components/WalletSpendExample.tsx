"use client";

import { ShoppingCart, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { useToast } from "@/hooks/use-toast";

import { useWallet, useWalletBalance, useSpendFromWallet } from "../hooks";

interface WalletSpendExampleProps {
  userId: string;
}

/**
 * Example component demonstrating how to use the wallet spend functionality
 * This component shows:
 * - Balance checking
 * - Spend validation
 * - Transaction processing
 * - Error handling
 * - UI feedback
 */
export function WalletSpendExample({ userId }: WalletSpendExampleProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState<number>(1000); // Default: 10.00 MXN
  const [description, setDescription] = useState<string>("");
  const [referenceId, setReferenceId] = useState<string>("");

  // Fetch wallet data
  const { data: wallet, isLoading: walletLoading } = useWallet({ userId });
  const { data: balance, isLoading: balanceLoading } = useWalletBalance(
    wallet?.id || ""
  );

  // Spend mutation
  const spendFromWallet = useSpendFromWallet();

  const availableBalance = balance?.availableBalance || 0;
  const hasEnoughBalance = availableBalance >= amount;

  const formatAmount = (cents: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: wallet?.currency || "MXN",
    }).format(cents / 100);
  };

  const handleSpend = async () => {
    if (!wallet) {
      toast({
        title: "Error",
        description: "Wallet not found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!hasEnoughBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You need ${formatAmount(amount)} but only have ${formatAmount(availableBalance)} available.`,
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await spendFromWallet.mutateAsync({
        walletId: wallet.id,
        amount,
        description: description || "Wallet spending",
        referenceId: referenceId || undefined,
        referenceType: referenceId ? "ORDER" : undefined,
        metadata: {
          source: "wallet-spend-example",
          timestamp: new Date().toISOString(),
        },
      });

      toast({
        title: "✅ Payment Successful",
        description: `${formatAmount(amount)} has been deducted from your wallet. New balance: ${formatAmount(result.balanceAfter)}`,
      });

      // Reset form
      setAmount(1000);
      setDescription("");
      setReferenceId("");
    } catch (error: unknown) {
      toast({
        title: "Payment Failed",
        description:
          (error instanceof Error ? error.message : null) ||
          "Unable to process payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (walletLoading || balanceLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">
          No Wallet Found
        </h3>
        <p className="text-yellow-700">
          You need to create a wallet first to make payments.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-lg">
        <h2 className="text-lg font-semibold opacity-90 mb-2">
          Available Balance
        </h2>
        <p className="text-4xl font-bold">{formatAmount(availableBalance)}</p>
      </div>

      {/* Spend Form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Make a Payment
            </h3>
            <p className="text-sm text-gray-600">
              Spend funds from your wallet
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (in cents)
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={1}
                step={100}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1000 = 10.00 MXN"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                {formatAmount(amount)}
              </span>
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Order #12345"
            />
          </div>

          {/* Reference ID Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference ID (optional)
            </label>
            <input
              type="text"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., ORDER-123, COUPON-456"
            />
            <p className="text-xs text-gray-500 mt-1">
              Used to prevent duplicate transactions
            </p>
          </div>

          {/* Balance Warning */}
          {!hasEnoughBalance ? (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">
                  Insufficient Balance
                </p>
                <p className="text-xs text-red-700 mt-1">
                  You need {formatAmount(amount - availableBalance)} more to
                  complete this transaction.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">
                  Sufficient Balance
                </p>
                <p className="text-xs text-green-700 mt-1">
                  New balance after payment:{" "}
                  {formatAmount(availableBalance - amount)}
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={() => void handleSpend()}
            disabled={!hasEnoughBalance || spendFromWallet.isPending}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl text-lg"
          >
            {spendFromWallet.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              <>Pay {formatAmount(amount)}</>
            )}
          </button>
        </div>
      </div>

      {/* Integration Notes */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">
          💡 Integration Notes
        </h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>
              <strong>Amount:</strong> Always in cents (e.g., 1000 = 10.00 MXN)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>
              <strong>Reference ID:</strong> Prevents duplicate transactions
              (e.g., order ID, coupon ID)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>
              <strong>Metadata:</strong> Store additional context (JSON object)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>
              <strong>Atomic:</strong> Transaction is DB-level atomic, ensuring
              balance consistency
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>
              <strong>Validation:</strong> Automatic balance checking and
              duplicate prevention
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
