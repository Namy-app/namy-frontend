"use client";

import { useState } from "react";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { WalletDashboard, DepositForm } from "@/domains/payment/components";
import { useCreateWallet, useWallet } from "@/domains/payment/hooks";
import { BasicLayout } from "@/layouts/BasicLayout";
import { useAuthStore } from "@/store/useAuthStore";


export default function PaymentPage(): React.JSX.Element {
  const { user } = useAuthStore();
  const [showDepositForm, setShowDepositForm] = useState(false);
  const createWallet = useCreateWallet();

  // Check if user has a wallet
  const {
    data: wallet,
    isLoading: walletLoading,
    refetch: refetchWallet,
  } = useWallet({
    userId: user?.id || "",
  });

  const handleCreateWallet = async () => {
    if (!user?.id) {
      return;
    }

    try {
      await createWallet.mutateAsync({
        userId: user.id,
        currency: "MXN",
      });
      // Refetch wallet after creation
      await refetchWallet();
    } catch (error) {
      console.error("Failed to create wallet:", error);
    }
  };

  const handleDepositSuccess = async () => {
    setShowDepositForm(false);
    // Refetch wallet data to show updated balance
    await refetchWallet();
  };

  return (
    <ProtectedRoute>
      <BasicLayout className="pb-20">
        {/* Main Content - with padding for fixed header and bottom nav */}
        <div className="pt-14 pb-16 bg-gradient-hero p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">
                Wallet & Payments
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your wallet balance and view transaction history
              </p>
            </div>

            {/* Main Content */}
            {!user?.id ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-800">Unable to load user information</p>
              </div>
            ) : walletLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
              </div>
            ) : !wallet ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Wallet Found
                </h3>
                <p className="text-gray-600 mb-4">
                  You don&apos;t have a wallet yet. Create one to get started.
                </p>
                <button
                  onClick={() => void handleCreateWallet()}
                  disabled={createWallet.isPending}
                  className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
                >
                  {createWallet.isPending ? "Creating..." : "Create Wallet"}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Deposit Form (shown as modal/card) */}
                {showDepositForm ? (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <DepositForm
                      onSuccess={() => void handleDepositSuccess()}
                      onCancel={() => setShowDepositForm(false)}
                    />
                  </div>
                ) : (
                  <>
                    {/* Deposit Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => setShowDepositForm(true)}
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                      >
                        Add Funds
                      </button>
                    </div>

                    {/* Wallet Dashboard */}
                    <WalletDashboard userId={user.id} />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </BasicLayout>
    </ProtectedRoute>
  );
}
