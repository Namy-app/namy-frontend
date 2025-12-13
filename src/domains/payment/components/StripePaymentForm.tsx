"use client";

import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";

import { useCreatePaymentIntent } from "../hooks";
import type { CreatePaymentIntentInput } from "../types";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentFormProps {
  amount: number;
  currency?: string;
  description?: string;
  onSuccess?: (_paymentIntentId: string) => void;
  onError?: (error: string) => void;
}

function PaymentForm({
  amount,
  description,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isReady, setIsReady] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe or Elements not loaded");
      setErrorMessage(
        "Payment system not ready. Please wait a moment and try again."
      );
      return;
    }

    setIsProcessing(true);
    setErrorMessage(undefined);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/wallet/success`,
        },
        redirect: "if_required",
      });

      if (error) {
        console.error("Payment error:", error);
        setErrorMessage(error.message);
        onError?.(error.message || "Payment failed");
        setIsProcessing(false);
      } else if (paymentIntent) {
        // Payment successful - webhook will credit wallet
        if (paymentIntent.status === "succeeded") {
          onSuccess?.(paymentIntent.id);
        } else if (paymentIntent.status === "processing") {
          // Payment is processing, show message
          setErrorMessage("Payment is being processed. Please wait...");
          setTimeout(() => {
            onSuccess?.(paymentIntent.id);
          }, 2000);
        } else if (paymentIntent.status === "requires_action") {
          setErrorMessage(
            "Additional authentication required. Please complete the verification."
          );
          setIsProcessing(false);
        } else {
          setErrorMessage(`Payment status: ${paymentIntent.status}`);
          setIsProcessing(false);
        }
      } else {
        console.error("No payment intent or error returned");
        setErrorMessage("Payment failed - no response received");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("Payment exception:", err);
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setErrorMessage(message);
      onError?.(message);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Details
          </label>
          <PaymentElement
            onReady={() => {
              setIsReady(true);
            }}
          />
        </div>
      </div>

      {errorMessage ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!stripe || !isReady || isProcessing}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {!isReady
          ? "Loading payment form..."
          : isProcessing
            ? "Processing..."
            : `Pay $${(amount / 100).toFixed(2)}MXN`}
      </button>

      {description ? (
        <p className="text-sm text-gray-500 text-center">{description}</p>
      ) : null}
    </form>
  );
}

export function StripePaymentForm({
  amount,
  currency = "MXN",
  description = "Wallet deposit",
  onSuccess,
  onError,
}: PaymentFormProps) {
  const createPaymentIntent = useCreatePaymentIntent();
  const [clientSecret, setClientSecret] = useState<string>();
  const [initError, setInitError] = useState<string>();

  useEffect(() => {
    // Only create payment intent once
    if (clientSecret || initError || createPaymentIntent.isPending) {
      return;
    }

    const handleCreatePaymentIntent = async () => {
      try {
        const input: CreatePaymentIntentInput = {
          amount,
          currency,
          description,
        };

        const paymentIntent = await createPaymentIntent.mutateAsync(input);
        setClientSecret(paymentIntent.clientSecret);
      } catch (err) {
        console.error("Failed to create payment intent:", err);
        const message =
          err instanceof Error
            ? err.message
            : "Failed to create payment intent";
        setInitError(message);
        onError?.(message);
      }
    };

    void handleCreatePaymentIntent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  if (createPaymentIntent.isPending && !clientSecret) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <p className="ml-3 text-sm text-gray-600">Initializing payment...</p>
      </div>
    );
  }

  if (createPaymentIntent.isError || initError) {
    console.error(
      "Payment intent error:",
      createPaymentIntent.error || initError
    );
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-sm text-red-800 mb-2">
          {initError || "Failed to initialize payment. Please try again."}
        </p>
        <button
          onClick={() => {
            setInitError(undefined);
            setClientSecret(undefined);
          }}
          className="mt-2 text-sm text-blue-600 hover:text-blue-700 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm
        amount={amount}
        description={description}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}
