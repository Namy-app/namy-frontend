"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Crown, Check, X, Zap, Gift } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { StripePaymentForm } from "@/domains/payment/components";
import {
  useSubscriptionStatus,
  useCancelSubscription,
  useToggleAutoRenew,
} from "@/domains/subscription/hooks";
import { useToast } from "@/hooks/use-toast";
import { BasicLayout } from "@/layouts/BasicLayout";
import { extractErrorMessage } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

const PREMIUM_PRICE_ID = "price_1SRJIhC26wcdh5DNWUT2Sqfs";
const PREMIUM_AMOUNT = 9900; // $99 MXN in cents

function getStripeReturnUrl(): string {
  if (typeof window === "undefined") {
    return "https://namyapp.com/subscription?success=true";
  }
  return `${window.location.origin}/subscription?success=true`;
}

function SubscriptionContent(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, updateUser } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showStripeForm, setShowStripeForm] = useState(false);

  const { data: subscriptionData, isLoading: subscriptionLoading } =
    useSubscriptionStatus();
  const cancelSubscription = useCancelSubscription();
  const toggleAutoRenew = useToggleAutoRenew();

  const subscriptionStatus = subscriptionData?.mySubscriptionStatus;
  const hasActiveSubscription = subscriptionStatus?.isPremium || false;
  const subscriptionEndDate = subscriptionStatus?.premiumEndDate || null;
  const autoRenewEnabled = subscriptionStatus?.autoRenew ?? true;

  // Sync subscription status with auth store
  useEffect(() => {
    if (subscriptionStatus && user) {
      if (
        user.isPremium !== subscriptionStatus.isPremium ||
        user.premiumEndDate !== subscriptionStatus.premiumEndDate
      ) {
        updateUser({
          isPremium: subscriptionStatus.isPremium,
          premiumEndDate: subscriptionStatus.premiumEndDate,
          premiumStartDate: subscriptionStatus.premiumStartDate,
        });
      }
    }
  }, [subscriptionStatus, user, updateUser]);

  // Handle success/cancel query parameters from Stripe 3DS redirect
  useEffect(() => {
    const success = searchParams?.get("success");
    const canceled = searchParams?.get("canceled");

    if (success === "true") {
      toast({
        title: "🎉 ¡Bienvenido a Premium!",
        description:
          "Tu suscripción está activa. ¡Disfruta de generación instantánea de cupones y descuentos máximos!",
        duration: 5000,
      });

      setTimeout(() => {
        void queryClient.invalidateQueries({
          queryKey: ["subscription-status"],
        });
        router.replace("/subscription");
      }, 2000);
    } else if (canceled === "true") {
      toast({
        title: "Pago cancelado",
        description:
          "Puedes suscribirte en cualquier momento para desbloquear beneficios premium.",
        variant: "default",
      });
      router.replace("/subscription");
    }
  }, [searchParams, router, toast, queryClient]);

  const handleStripePaymentSuccess = (_paymentIntentId: string) => {
    setShowStripeForm(false);
    const premiumStartDate = new Date().toISOString();
    const premiumEndDate = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString();
    updateUser({ isPremium: true, premiumStartDate, premiumEndDate });
    toast({
      title: "🎉 ¡Bienvenido a Premium!",
      description:
        "Tu suscripción está activa. ¡Disfruta de generación instantánea de cupones y descuentos máximos!",
      duration: 5000,
    });
    void queryClient.invalidateQueries({ queryKey: ["subscription-status"] });
  };

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        "Tu suscripción permanecerá activa hasta el final del período de facturación actual. ¿Continuar?"
      )
    ) {
      return;
    }

    try {
      await cancelSubscription.mutateAsync();
      toast({
        title: "Suscripción cancelada",
        description: "Tu suscripción terminará al final del período actual.",
      });
    } catch (_error) {
      toast({
        title: "Error",
        description:
          extractErrorMessage(_error) ??
          "No se pudo cancelar la suscripción. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleToggleAutoRenew = async () => {
    try {
      const newEnabled = !autoRenewEnabled;
      await toggleAutoRenew.mutateAsync(newEnabled);
      toast({
        title: newEnabled
          ? "Renovación automática activada"
          : "Renovación automática desactivada",
        description: newEnabled
          ? "Tu suscripción se renovará automáticamente."
          : "Tu suscripción no se renovará automáticamente.",
      });
    } catch (_error) {
      toast({
        title: "Error",
        description:
          extractErrorMessage(_error) ??
          "No se pudo actualizar la configuración. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <ProtectedRoute>
      <BasicLayout className="pb-20">
        <div className="pt-14 pb-16 bg-gradient-hero p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Ñamy Premium
              </h1>
              <p className="text-muted-foreground">
                Desbloquea descuentos instantáneos y máximos ahorros
              </p>
            </div>

            {/* Active subscription management */}
            {hasActiveSubscription ? (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      <h2 className="text-xl font-semibold text-gray-900">
                        Suscripción activa
                      </h2>
                    </div>
                    <p className="text-sm text-gray-600">
                      Próxima fecha de facturación:{" "}
                      {subscriptionEndDate
                        ? new Date(subscriptionEndDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">$ 99 MXN</p>
                    <p className="text-sm text-gray-600">por mes</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="auto-renew"
                      checked={autoRenewEnabled}
                      onChange={() => void handleToggleAutoRenew()}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="auto-renew"
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      Renovar suscripción automáticamente
                    </label>
                  </div>

                  <button
                    onClick={() => void handleCancelSubscription()}
                    className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    Cancelar suscripción
                  </button>
                </div>
              </div>
            ) : null}

            {/* Pricing Card */}
            <div className="bg-white rounded-lg shadow-xl p-8 mb-6 border-2 border-yellow-400 relative">
              {subscriptionLoading ? (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-600 font-medium">
                      Cargando detalles de suscripción...
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="text-center mb-6">
                <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  ⚡ MEJOR VALOR
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                  $ 99 MXN
                  <span className="text-xl font-normal text-gray-600">
                    /mes
                  </span>
                </h2>
                <p className="text-gray-600">Cancela cuando quieras</p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      <Zap className="w-4 h-4 inline mr-1 text-yellow-500" />
                      Sin anuncios
                    </p>
                    <p className="text-sm text-gray-600">
                      Disfruta Ñamy sin interrupciones.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      <Gift className="w-4 h-4 inline mr-1 text-orange-500" />
                      Descuentos máximos
                    </p>
                    <p className="text-sm text-gray-600">
                      Obtén siempre el descuento más alto disponible.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Multiplicador de puntos (x1.25)
                    </p>
                    <p className="text-sm text-gray-600">
                      Gana puntos más rápido y sube en el leaderboard.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Restaurantes exclusivos
                    </p>
                    <p className="text-sm text-gray-600">
                      Acceso a promociones solo para miembros Premium.
                    </p>
                  </div>
                </div>
              </div>

              {/* Free plan limitations */}
              <div className="border-t border-gray-200 pt-6 mb-8">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Limitaciones del plan gratuito:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <X className="w-4 h-4 text-red-500" />
                    <span>
                      Generación limitada de cupones (períodos de espera)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <X className="w-4 h-4 text-red-500" />
                    <span>Niveles de descuento más bajos</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              {!hasActiveSubscription ? (
                <div className="space-y-3">
                  <button
                    onClick={() => setShowStripeForm(true)}
                    className="w-full py-4 bg-linear-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all shadow-lg text-lg"
                  >
                    <Crown className="w-5 h-5 inline mr-2" />
                    Activar Premium — $99 MXN
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    Pago seguro con Stripe. Cancela cuando quieras.
                  </p>
                </div>
              ) : (
                <div className="text-center py-4 bg-green-50 rounded-lg">
                  <p className="text-green-700 font-semibold">
                    ✓ ¡Eres miembro Premium!
                  </p>
                </div>
              )}
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Preguntas frecuentes
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    ¿Puedo cancelar en cualquier momento?
                  </p>
                  <p className="text-sm text-gray-600">
                    ¡Sí! Puedes cancelar tu suscripción en cualquier momento. Tu
                    acceso premium continuará hasta el final de tu período de
                    facturación actual.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    ¿Qué métodos de pago aceptan?
                  </p>
                  <p className="text-sm text-gray-600">
                    Aceptamos todas las tarjetas de crédito y débito principales
                    a través de nuestro socio de pagos seguro, Stripe.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    ¿Cómo funciona la generación instantánea de cupones?
                  </p>
                  <p className="text-sm text-gray-600">
                    Con Premium, puedes generar cupones al instante en cualquier
                    restaurante sin períodos de espera ni límites diarios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stripe Payment Modal */}
        {showStripeForm ? (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Activar Ñamy Premium
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">$99 MXN / mes</p>
                </div>
                <button
                  onClick={() => setShowStripeForm(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <StripePaymentForm
                  amount={PREMIUM_AMOUNT}
                  currency="MXN"
                  description="Ñamy Premium — 1 mes"
                  metadata={{
                    priceId: PREMIUM_PRICE_ID,
                    type: "premium_subscription",
                    userId: user?.id ?? "",
                  }}
                  returnUrl={getStripeReturnUrl()}
                  onSuccess={handleStripePaymentSuccess}
                  onError={(error) => {
                    toast({
                      title: "Pago fallido",
                      description: error,
                      variant: "destructive",
                    });
                  }}
                />
              </div>
            </div>
          </div>
        ) : null}
      </BasicLayout>
    </ProtectedRoute>
  );
}

export default function SubscriptionPage(): React.JSX.Element {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SubscriptionContent />
    </Suspense>
  );
}
