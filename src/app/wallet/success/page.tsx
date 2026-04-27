"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { BasicLayout } from "@/layouts/BasicLayout";

function PaymentSuccessContent(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentIntent = searchParams?.get("payment_intent");
  const queryClient = useQueryClient();

  useEffect(() => {
    void queryClient.invalidateQueries({ queryKey: ["wallet"] });
    void queryClient.invalidateQueries({ queryKey: ["walletBalance"] });
    void queryClient.invalidateQueries({ queryKey: ["walletTransactions"] });

    const timer = setTimeout(() => {
      router.push("/wallet");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, queryClient]);

  return (
    <ProtectedRoute>
      <BasicLayout className="pb-20">
        <div className="pt-14 pb-16 bg-gradient-hero flex items-center justify-center p-6 min-h-screen">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Pago Exitoso!
            </h1>
            <p className="text-gray-600 mb-6">
              Tu pago fue procesado correctamente y tu billetera ha sido
              acreditada.
            </p>

            {paymentIntent ? (
              <div className="bg-gray-50 rounded-md p-3 mb-6">
                <p className="text-xs text-gray-500 mb-1">ID de Pago</p>
                <p className="text-sm font-mono text-gray-700 break-all">
                  {paymentIntent}
                </p>
              </div>
            ) : null}

            <div className="space-y-3">
              <button
                onClick={() => router.push("/wallet")}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver Billetera
              </button>
              <p className="text-sm text-gray-500">
                Redirigiendo en 3 segundos...
              </p>
            </div>
          </div>
        </div>
      </BasicLayout>
    </ProtectedRoute>
  );
}

export default function PaymentSuccessPage(): React.JSX.Element {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
