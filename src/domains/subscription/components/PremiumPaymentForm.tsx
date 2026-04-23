"use client";

import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";

import { extractErrorMessage } from "@/lib/utils";

import { useCreatePremiumPaymentIntent } from "../hooks";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const RETURN_URL = "https://namyapp.com/subscription?success=true";

function getReturnUrl(): string {
  if (typeof window === "undefined") {return RETURN_URL;}
  return `${window.location.origin}/subscription?success=true`;
}

interface PremiumFormProps {
  onSuccess: () => void;
  onError: (msg: string) => void;
}

function PaymentForm({ onSuccess, onError }: PremiumFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {return;}

    setIsProcessing(true);
    setErrorMessage(undefined);

    try {
      if (Capacitor.isNativePlatform()) {
        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: { return_url: getReturnUrl() },
          redirect: "always",
        });

        if (error) {
          if (error.type === "validation_error") {
            setErrorMessage(error.message);
            setIsProcessing(false);
            return;
          }
          const redirectUrl =
            error.payment_intent?.next_action?.redirect_to_url?.url;
          if (redirectUrl) {
            await Browser.open({ url: redirectUrl });
            setIsProcessing(false);
            return;
          }
          setErrorMessage(error.message ?? "Payment failed");
          onError(error.message ?? "Payment failed");
          setIsProcessing(false);
        }
      } else {
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: { return_url: getReturnUrl() },
          redirect: "if_required",
        });

        if (error) {
          setErrorMessage(error.message);
          onError(error.message ?? "Payment failed");
          setIsProcessing(false);
        } else if (paymentIntent?.status === "succeeded") {
          onSuccess();
        } else if (paymentIntent?.status === "processing") {
          setTimeout(() => onSuccess(), 2000);
        } else if (paymentIntent?.status === "requires_action") {
          const { error: actionError, paymentIntent: confirmed } =
            await stripe.handleNextAction({
              clientSecret: paymentIntent.client_secret!,
            });
          if (actionError) {
            setErrorMessage(actionError.message ?? "Authentication failed");
            onError(actionError.message ?? "Authentication failed");
            setIsProcessing(false);
          } else if (confirmed?.status === "succeeded") {
            onSuccess();
          } else {
            setErrorMessage(
              `Payment status: ${confirmed?.status ?? "unknown"}`
            );
            setIsProcessing(false);
          }
        } else {
          setErrorMessage(
            `Payment status: ${paymentIntent?.status ?? "unknown"}`
          );
          setIsProcessing(false);
        }
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setErrorMessage(msg);
      onError(msg);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
      <PaymentElement onReady={() => setIsReady(true)} />

      {errorMessage ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!stripe || !isReady || isProcessing}
        className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg text-base"
      >
        {!isReady
          ? "Cargando..."
          : isProcessing
            ? "Procesando..."
            : "Pagar $99 MXN/mes"}
      </button>
    </form>
  );
}

export function PremiumPaymentForm({ onSuccess, onError }: PremiumFormProps) {
  const createIntent = useCreatePremiumPaymentIntent();
  const [clientSecret, setClientSecret] = useState<string>();
  const [initError, setInitError] = useState<string>();

  useEffect(() => {
    if (clientSecret || initError || createIntent.isPending) {return;}

    createIntent
      .mutateAsync()
      .then((data) => setClientSecret(data.clientSecret))
      .catch((err) => {
        const msg = extractErrorMessage(err) ?? "No se pudo iniciar el pago";
        setInitError(msg);
        onError(msg);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (createIntent.isPending && !clientSecret) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500" />
        <p className="ml-3 text-sm text-gray-600">Inicializando pago...</p>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-sm text-red-800 mb-2">{initError}</p>
        <button
          onClick={() => {
            setInitError(undefined);
            setClientSecret(undefined);
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500" />
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance: { theme: "stripe" } }}
    >
      <PaymentForm onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}
