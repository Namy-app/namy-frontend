"use client";

import { useState } from "react";

import {
  useCreateSubscription,
  useSubscriptionsByWallet,
  useCancelSubscription,
  useProcessSubscriptionBilling,
  useSubscriptionBillingHistory,
} from "../hooks";
import type {
  CreateSubscriptionInput,
  SubscriptionInterval,
  Subscription,
  SubscriptionBillingHistory,
} from "../types";

interface SubscriptionManagerProps {
  walletId: string;
}

export function SubscriptionManager({
  walletId,
}: SubscriptionManagerProps): React.JSX.Element {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<
    string | null
  >(null);

  // Hooks
  const createSubscription = useCreateSubscription();
  const { data: subscriptions, isLoading } = useSubscriptionsByWallet(walletId);
  const cancelSubscription = useCancelSubscription();
  const processBilling = useProcessSubscriptionBilling();
  const { data: billingHistory } = useSubscriptionBillingHistory(
    selectedSubscriptionId || ""
  );

  // Form state
  const [formData, setFormData] = useState<CreateSubscriptionInput>({
    walletId,
    name: "",
    amount: 1000,
    currency: "MXN",
    interval: "monthly" as SubscriptionInterval,
    intervalCount: 1,
    description: "",
  });

  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSubscription.mutateAsync(formData);
      setShowCreateForm(false);
      // Reset form
      setFormData({
        walletId,
        name: "",
        amount: 1000,
        currency: "MXN",
        interval: "monthly" as SubscriptionInterval,
        intervalCount: 1,
        description: "",
      });
    } catch (error) {
      console.error("Failed to create subscription:", error);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!confirm("Are you sure you want to cancel this subscription?")) {
      return;
    }

    try {
      await cancelSubscription.mutateAsync({
        subscriptionId,
        reason: "User requested cancellation",
      });
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
    }
  };

  const handleProcessBilling = async (subscriptionId: string) => {
    if (!confirm("Process billing for this subscription now?")) {
      return;
    }

    try {
      await processBilling.mutateAsync(subscriptionId);
      alert("Billing processed successfully!");
    } catch (error) {
      console.error("Failed to process billing:", error);
      alert(`Billing failed: ${error}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          Subscription Manager
        </h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {showCreateForm ? "Cancel" : "New Subscription"}
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Create Subscription</h3>
          <form
            onSubmit={(e) => void handleCreateSubscription(e)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Netflix, Spotify"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (in cents)
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: Number(e.target.value) })
                }
                placeholder="1000 = $10.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                ${(formData.amount / 100).toFixed(2)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Interval
              </label>
              <select
                value={formData.interval}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    interval: e.target.value as SubscriptionInterval,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Additional details..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>

            <button
              type="submit"
              disabled={createSubscription.isPending}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {createSubscription.isPending
                ? "Creating..."
                : "Create Subscription"}
            </button>
          </form>
        </div>
      ) : null}

      {/* Subscriptions List */}
      <div className="space-y-4">
        {!subscriptions || subscriptions.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">
              No subscriptions yet. Create one to get started!
            </p>
          </div>
        ) : (
          subscriptions.map((subscription: Subscription) => (
            <div
              key={subscription.id}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {subscription.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {subscription.description}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    subscription.status === "active"
                      ? "bg-green-100 text-green-800"
                      : subscription.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : subscription.status === "paused"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {subscription.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${(subscription.amount / 100).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Interval</p>
                  <p className="text-sm text-gray-900 capitalize">
                    {subscription.interval}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Next Billing</p>
                  <p className="text-sm text-gray-900">
                    {new Date(
                      subscription.nextBillingDate
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm text-gray-900">
                    {new Date(subscription.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => void handleProcessBilling(subscription.id)}
                  disabled={
                    processBilling.isPending || subscription.status !== "active"
                  }
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm"
                >
                  Process Billing Now
                </button>
                <button
                  onClick={() => setSelectedSubscriptionId(subscription.id)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  View History
                </button>
                <button
                  onClick={() => void handleCancelSubscription(subscription.id)}
                  disabled={
                    cancelSubscription.isPending ||
                    subscription.status === "cancelled"
                  }
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Billing History Modal */}
      {selectedSubscriptionId && billingHistory ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Billing History</h3>
              <button
                onClick={() => setSelectedSubscriptionId(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {billingHistory.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No billing history yet
              </p>
            ) : (
              <div className="space-y-3">
                {billingHistory.map((record: SubscriptionBillingHistory) => (
                  <div
                    key={record.id}
                    className="border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">
                        ${(record.amount / 100).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(record.billingDate).toLocaleString()}
                      </p>
                      {record.failureReason ? (
                        <p className="text-xs text-red-600 mt-1">
                          {record.failureReason}
                        </p>
                      ) : null}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        record.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : record.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {record.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
