"use client";

import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { AlertCircle, Info, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { PortalCardBrandIcon } from "@/domains/portal/components/PortalCardBrandIcon";
import {
  useCreateSetupIntent,
  useMyOwnerBilling,
  useMyPaymentMethod,
  useSetDefaultPaymentMethod,
} from "@/domains/portal/hooks";
import type { PortalPaymentMethod, PortalStore } from "@/domains/portal/types";
import {
  BILLING_THRESHOLD_MXN,
  formatCardBrand,
  formatMxn,
  getStoreBalance,
} from "@/domains/portal/utils";
import { useToast } from "@/hooks/use-toast";
import { extractErrorMessage } from "@/lib/utils";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: true,
  disabled: false,
  style: {
    base: {
      fontSize: "16px",
      color: "hsl(var(--foreground))",
      fontFamily: "Poppins, system-ui, sans-serif",
      "::placeholder": {
        color: "hsl(var(--muted-foreground))",
      },
    },
    invalid: {
      color: "hsl(var(--destructive))",
    },
  },
};

interface PortalPaymentMethodCardProps {
  store: PortalStore;
  storeCount: number;
}

export function PortalPaymentMethodCard({
  store,
  storeCount,
}: PortalPaymentMethodCardProps): React.JSX.Element {
  const { toast } = useToast();
  const paymentMethodQuery = useMyPaymentMethod();
  const ownerBillingQuery = useMyOwnerBilling();
  const [isUpdating, setIsUpdating] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [cardStoreId, setCardStoreId] = useState(store.id);
  if (store.id !== cardStoreId) {
    setCardStoreId(store.id);
    setIsUpdating(false);
    setJustSaved(false);
  }
  const balance =
    ownerBillingQuery.data?.accumulatedBalance ?? getStoreBalance(store);
  const estimatedCharge = balance >= BILLING_THRESHOLD_MXN ? balance : 0;
  const isMultiStore = storeCount > 1;

  const paymentMethod = paymentMethodQuery.data ?? null;
  const showForm = (!paymentMethod || isUpdating) && !justSaved;

  const handleSaved = (): void => {
    setIsUpdating(false);
    setJustSaved(true);
    void paymentMethodQuery.refetch();
    toast({
      title: "Método de pago guardado correctamente",
    });
  };

  if (paymentMethodQuery.isLoading) {
    return <PortalPaymentMethodCardSkeleton />;
  }

  if (paymentMethodQuery.isError) {
    return (
      <Card className="p-8 bg-card border-none shadow-card">
        <p className="text-destructive">
          {paymentMethodQuery.error?.message ||
            "No se pudo cargar el método de pago."}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-none shadow-card">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              ¿Para qué sirve el método de pago?
            </h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Namy cobra automáticamente al final de cada mes cuando el balance
              combinado de tu cuenta supera $100 MXN. Guarda tu tarjeta para que
              el cobro se procese sin interrupciones.
            </p>
            {isMultiStore ? (
              <p className="text-sm font-medium text-foreground mt-3">
                Este método de pago aplica para todas tus ubicaciones
              </p>
            ) : null}
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card border-none shadow-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Resumen de cobro
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Balance actual</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {formatMxn(balance)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Estimado próximo cobro
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {formatMxn(estimatedCharge)} a fin de mes
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-8 bg-card border-none shadow-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Tarjeta guardada
        </h2>

        {paymentMethod ? (
          <CurrentCardDisplay paymentMethod={paymentMethod} />
        ) : (
          <div className="flex items-start gap-2 rounded-xl bg-orange-500/10 px-4 py-3 mb-6">
            <AlertCircle className="w-5 h-5 text-orange-700 shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-orange-800">
              Sin método de pago — agrega una tarjeta para evitar interrupciones
            </p>
          </div>
        )}

        {paymentMethod && !isUpdating ? (
          <Button
            type="button"
            variant="outline"
            className="mt-6 h-12 px-8 rounded-full font-bold"
            onClick={() => {
              setJustSaved(false);
              setIsUpdating(true);
            }}
          >
            Actualizar tarjeta
          </Button>
        ) : null}

        {showForm ? (
          <div
            className={paymentMethod ? "mt-6 pt-6 border-t border-border" : ""}
          >
            <PortalCardSetupForm
              onSaved={handleSaved}
              onCancel={paymentMethod ? () => setIsUpdating(false) : undefined}
              onError={(message) => {
                toast({
                  variant: "destructive",
                  title: "No se pudo guardar la tarjeta",
                  description: message,
                });
              }}
            />
          </div>
        ) : null}
      </Card>
    </div>
  );
}

export function PortalPaymentMethodCardSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-none shadow-card h-28 animate-pulse" />
      <Card className="p-6 bg-card border-none shadow-card h-28 animate-pulse" />
      <Card className="p-6 sm:p-8 bg-card border-none shadow-card space-y-4">
        <div className="h-5 w-40 bg-muted rounded animate-pulse" />
        <div className="h-16 w-full max-w-sm bg-muted rounded-xl animate-pulse" />
        <div className="h-12 w-56 bg-muted rounded-full animate-pulse" />
      </Card>
    </div>
  );
}

function CurrentCardDisplay({
  paymentMethod,
}: {
  paymentMethod: PortalPaymentMethod;
}): React.JSX.Element {
  const brandLabel = formatCardBrand(paymentMethod.brand);
  const expMonth = String(paymentMethod.expMonth).padStart(2, "0");

  return (
    <div className="rounded-xl border border-input bg-background px-4 py-4 max-w-md">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <PortalCardBrandIcon brand={paymentMethod.brand} />
          <p className="text-sm font-semibold text-foreground">{brandLabel}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-700">
          Activo
        </span>
      </div>
      <p className="text-lg tracking-wide text-foreground font-medium">
        •••• •••• •••• {paymentMethod.last4}
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        Vence {expMonth}/{paymentMethod.expYear}
      </p>
    </div>
  );
}

interface PortalCardSetupFormProps {
  onSaved: () => void;
  onCancel?: () => void;
  onError: (message: string) => void;
}

function PortalCardSetupForm({
  onSaved,
  onCancel,
  onError,
}: PortalCardSetupFormProps): React.JSX.Element {
  const createSetupIntent = useCreateSetupIntent();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setClientSecret(null);
    setSetupError(null);

    void createSetupIntent
      .mutateAsync()
      .then((secret) => {
        if (!cancelled) {
          setClientSecret(secret);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          const message =
            extractErrorMessage(error) ||
            "No se pudo preparar el formulario de pago.";
          setSetupError(message);
          onError(message);
        }
      });

    return () => {
      cancelled = true;
    };
    // Fetch a new SetupIntent whenever the form instance changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryToken]);

  const elementsOptions = useMemo(
    () => ({
      locale: "es" as const,
      appearance: {
        theme: "stripe" as const,
        variables: {
          colorBackground: "#ffffff",
          borderRadius: "12px",
        },
      },
    }),
    []
  );

  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return (
      <p className="text-destructive">
        Falta la clave pública de Stripe. Configura
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
      </p>
    );
  }

  if (setupError) {
    return (
      <div className="space-y-3">
        <p className="text-destructive">{setupError}</p>
        <Button
          type="button"
          variant="outline"
          className="h-12 px-8 rounded-full font-bold"
          onClick={() => setRetryToken((token) => token + 1)}
        >
          Reintentar
        </Button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        Preparando formulario de tarjeta...
      </div>
    );
  }

  return (
    <Elements
      key={clientSecret}
      stripe={stripePromise}
      options={elementsOptions}
    >
      <CardSetupInnerForm
        clientSecret={clientSecret}
        onSaved={onSaved}
        onCancel={onCancel}
        onError={onError}
      />
    </Elements>
  );
}

interface CardSetupInnerFormProps {
  clientSecret: string;
  onSaved: () => void;
  onCancel?: () => void;
  onError: (message: string) => void;
}

function CardSetupInnerForm({
  clientSecret,
  onSaved,
  onCancel,
  onError,
}: CardSetupInnerFormProps): React.JSX.Element {
  const stripe = useStripe();
  const elements = useElements();
  const setDefaultPaymentMethod = useSetDefaultPaymentMethod();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError("El sistema de pagos aún no está listo. Intenta de nuevo.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onError("No se encontró el formulario de tarjeta.");
      return;
    }

    setIsProcessing(true);

    try {
      const { error, setupIntent } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (error) {
        onError(error.message || "No se pudo guardar la tarjeta.");
        return;
      }

      const paymentMethod = setupIntent?.payment_method;
      const paymentMethodId =
        typeof paymentMethod === "string" ? paymentMethod : paymentMethod?.id;

      if (!paymentMethodId) {
        onError("Stripe no devolvió un método de pago.");
        return;
      }

      await setDefaultPaymentMethod.mutateAsync({
        paymentMethodId,
      });

      onSaved();
    } catch (error) {
      onError(
        extractErrorMessage(error) ||
          "No se pudo guardar el método de pago. Intenta de nuevo."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const isBusy =
    isProcessing || setDefaultPaymentMethod.isPending || !stripe || !elements;

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      className="space-y-4"
    >
      <label className="text-sm font-medium text-foreground block">
        Datos de la tarjeta
      </label>
      <div
        className={`rounded-xl border border-input bg-background px-3 py-3 ${
          isBusy ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        <CardElement
          options={{
            ...CARD_ELEMENT_OPTIONS,
            disabled: isBusy,
          }}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="submit"
          className="w-full sm:w-auto h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold shadow-glow"
          disabled={isBusy}
        >
          {isBusy ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar tarjeta"
          )}
        </Button>
        {onCancel ? (
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto h-12 px-8 rounded-full font-bold"
            disabled={isBusy}
            onClick={onCancel}
          >
            Cancelar
          </Button>
        ) : null}
      </div>
    </form>
  );
}
