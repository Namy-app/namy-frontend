"use client";

import { useState } from "react";

import { useWallet, useWalletBalance, useWalletTransactions } from "../hooks";
import { TransactionStatus } from "../types";
import type { GetWalletInput, GetTransactionsInput } from "../types";

interface WalletDashboardProps {
  userId: string;
}

export function WalletDashboard({ userId }: WalletDashboardProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const walletInput: GetWalletInput = { userId };
  const { data: wallet, isLoading: walletLoading } = useWallet(walletInput);

  const { data: balance, isLoading: balanceLoading } = useWalletBalance(
    wallet?.id || ""
  );

  const transactionsInput: GetTransactionsInput = {
    walletId: wallet?.id || "",
    limit: pageSize,
    offset: (page - 1) * pageSize,
  };

  const { data: transactions, isLoading: transactionsLoading } =
    useWalletTransactions(transactionsInput);

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
          You don&apos;t have a wallet yet. Create one to get started.
        </p>
      </div>
    );
  }

  const formatAmount = (amount: number, currency: string) => {
    const value = (amount / 100).toFixed(2);
    return `$${value}${currency.toUpperCase()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isCredit = (type: string) => {
    const creditTypes = [
      "deposit",
      "refund",
      "reward",
      "bonus",
      "transfer_in",
      "commission",
    ];
    return creditTypes.includes(type.toLowerCase());
  };

  const getTransactionIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      deposit: "➕",
      purchase: "🛒",
      refund: "↩️",
      reward: "🎁",
      bonus: "✨",
      transfer_in: "📥",
      transfer_out: "📤",
      commission: "💰",
      payment: "💳",
    };
    return iconMap[type.toLowerCase()] || "📝";
  };

  const getStatusBadge = (status: TransactionStatus) => {
    const styles = {
      [TransactionStatus.COMPLETED]: "bg-green-100 text-green-800",
      [TransactionStatus.PENDING]: "bg-yellow-100 text-yellow-800",
      [TransactionStatus.FAILED]: "bg-red-100 text-red-800",
      [TransactionStatus.CANCELLED]: "bg-gray-100 text-gray-800",
      [TransactionStatus.REVERSED]: "bg-orange-100 text-orange-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold opacity-90">Wallet Balance</h2>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              wallet.isActive
                ? "bg-green-500 bg-opacity-30"
                : "bg-red-500 bg-opacity-30"
            }`}
          >
            {wallet.isActive ? "Active" : "Inactive"}
          </div>
        </div>

        <div className="space-y-1">
          <div>
            <p className="text-4xl font-bold">
              {formatAmount(
                balance?.availableBalance || wallet.balance,
                wallet.currency
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Transaction History
          </h3>
        </div>

        {transactionsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : !transactions?.data.length ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No transactions yet</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {transactions.data.map((transaction) => (
                <div
                  key={transaction.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex items-start gap-3">
                      <div className="text-2xl mt-1">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900 capitalize">
                            {transaction.type.replace(/_/g, " ")}
                          </p>
                          {getStatusBadge(transaction.status)}
                        </div>
                        {transaction.description ? (
                          <p className="text-sm text-gray-600">
                            {transaction.description}
                          </p>
                        ) : null}
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-semibold ${
                          isCredit(transaction.type)
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {isCredit(transaction.type) ? "+" : "-"}
                        {formatAmount(transaction.amount, transaction.currency)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {transactions.paginationInfo.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!transactions.paginationInfo.hasPreviousPage}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {transactions.paginationInfo.page} of{" "}
                  {transactions.paginationInfo.totalPages}
                </span>
                <button
                  onClick={() =>
                    setPage((p) =>
                      Math.min(transactions.paginationInfo.totalPages, p + 1)
                    )
                  }
                  disabled={!transactions.paginationInfo.hasNextPage}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
