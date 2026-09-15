"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { PortalPinInput } from "@/domains/portal/components/PortalPinInput";
import { usePortalLogin, usePortalVerifyPin } from "@/domains/portal/hooks";
import { usePortalAuthStore } from "@/domains/portal/store/portalAuthStore";
import { usePortalSelectedStoreStore } from "@/domains/portal/store/portalSelectedStoreStore";
import type { PortalStoreOption } from "@/domains/portal/types";
import { formatStoreType } from "@/domains/portal/utils";
import { useToast } from "@/hooks/use-toast";
import { contentfulImageLoader } from "@/lib/image-utils";
import { extractErrorMessage, cn } from "@/lib/utils";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Input } from "@/shared/components/Input";
import { PasswordInput } from "@/shared/components/PasswordInput";

type LoginStep = "credentials" | "store" | "pin";

export default function PortalLoginPage(): React.JSX.Element {
  const router = useRouter();
  const { toast } = useToast();
  const setPortalAuth = usePortalAuthStore((state) => state.setPortalAuth);
  const setSelectedStoreId = usePortalSelectedStoreStore(
    (state) => state.setSelectedStoreId
  );
  const portalLogin = usePortalLogin();
  const portalVerifyPin = usePortalVerifyPin();

  const [step, setStep] = useState<LoginStep>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [stores, setStores] = useState<PortalStoreOption[]>([]);
  const [selectedStore, setSelectedStore] = useState<PortalStoreOption | null>(
    null
  );
  const [pin, setPin] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const isMultiStore = stores.length > 1;
  const totalSteps = isMultiStore ? 3 : 2;
  const currentStepNumber = useMemo(() => {
    if (step === "credentials") {
      return 1;
    }
    if (step === "store") {
      return 2;
    }
    return isMultiStore ? 3 : 2;
  }, [isMultiStore, step]);

  const completeLogin = async (store: PortalStoreOption): Promise<void> => {
    if (!tempToken) {
      setFormError("Sesión expirada, inicia sesión nuevamente");
      setStep("credentials");
      return;
    }

    try {
      const result = await portalVerifyPin.mutateAsync({
        tempToken,
        storeId: store.id,
        pin,
      });

      setPortalAuth(
        result.accessToken,
        result.owner,
        result.mustChangePassword || mustChangePassword ? password : undefined
      );
      setSelectedStoreId(store.id);
      setTempToken(null);

      if (result.mustChangePassword || mustChangePassword) {
        router.replace("/portal/change-password");
        return;
      }

      router.replace("/portal/dashboard");
    } catch (error) {
      const message = extractErrorMessage(error) || "PIN incorrecto";
      if (/sesión expirada/i.test(message)) {
        setTempToken(null);
        setStores([]);
        setSelectedStore(null);
        setPin("");
        setStep("credentials");
        setFormError(message);
        return;
      }
      setFormError("PIN incorrecto");
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setFormError(null);

    try {
      const result = await portalLogin.mutateAsync({
        email: email.trim(),
        password,
      });

      setTempToken(result.tempToken);
      setMustChangePassword(result.mustChangePassword);
      setStores(result.stores);
      setPin("");

      if (result.stores.length === 0) {
        setFormError("No hay restaurantes asociados a esta cuenta");
        return;
      }

      if (result.stores.length === 1 && result.stores[0]) {
        setSelectedStore(result.stores[0]);
        setStep("pin");
        return;
      }

      setSelectedStore(null);
      setStep("store");
    } catch (error) {
      const message =
        extractErrorMessage(error) ||
        "Correo electrónico o contraseña inválidos";
      setFormError(message);
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: message,
      });
    }
  };

  const handlePinSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setFormError(null);
    if (!selectedStore) {
      setFormError("Selecciona un restaurante");
      return;
    }
    if (pin.length !== 4) {
      setFormError("Ingresa el PIN de 4 dígitos");
      return;
    }
    await completeLogin(selectedStore);
  };

  const handleSelectStore = (store: PortalStoreOption): void => {
    setSelectedStore(store);
    setPin("");
    setFormError(null);
    setStep("pin");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="w-full p-8 bg-card border-none shadow-glow">
          <div className="text-center mb-8">
            <Image
              loader={contentfulImageLoader}
              src="/namy-logo.webp"
              alt="Ñamy Logo"
              width={96}
              height={96}
              className="mx-auto mb-4 rounded-2xl shadow-glow"
              priority
            />
            <h1 className="text-3xl font-bold text-primary mb-2">Ñamy</h1>
            <p className="text-muted-foreground">Portal de Restaurantes</p>
          </div>

          <div className="mb-6">
            <p className="text-xs font-medium text-muted-foreground text-center mb-2">
              Paso {currentStepNumber} de {totalSteps}
            </p>
            <div className="flex gap-2">
              {Array.from({ length: totalSteps }, (_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1.5 flex-1 rounded-full",
                    index < currentStepNumber ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>

          {step === "credentials" ? (
            <form
              onSubmit={(e) => {
                void handleCredentialsSubmit(e);
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="portal-email"
                  className="text-sm font-medium text-foreground mb-2 block"
                >
                  Correo electrónico
                </label>
                <Input
                  id="portal-email"
                  type="email"
                  placeholder="tu@restaurante.com"
                  className="h-12 rounded-xl"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFormError(null);
                  }}
                  disabled={portalLogin.isPending}
                />
              </div>

              <div>
                <label
                  htmlFor="portal-password"
                  className="text-sm font-medium text-foreground mb-2 block"
                >
                  Contraseña
                </label>
                <PasswordInput
                  id="portal-password"
                  placeholder="••••••••"
                  className="h-12 rounded-xl"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFormError(null);
                  }}
                  disabled={portalLogin.isPending}
                />
              </div>

              {formError ? (
                <p className="text-sm text-destructive">{formError}</p>
              ) : null}

              <Button
                type="submit"
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold shadow-glow"
                disabled={portalLogin.isPending}
              >
                {portalLogin.isPending
                  ? "Iniciando sesión..."
                  : "Iniciar sesión"}
              </Button>
            </form>
          ) : null}

          {step === "store" ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground text-center">
                Selecciona tu restaurante
              </h2>
              <div className="space-y-2">
                {stores.map((store) => (
                  <button
                    key={store.id}
                    type="button"
                    onClick={() => handleSelectStore(store)}
                    className="w-full text-left rounded-xl border border-border bg-background px-4 py-3 hover:border-primary hover:bg-muted/60 transition-colors"
                  >
                    <p className="font-semibold text-foreground">
                      {store.name}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {[store.city, formatStoreType(store.type)]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    {formatStoreType(store.type) ? (
                      <span className="inline-flex mt-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        {formatStoreType(store.type)}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="w-full text-sm text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setTempToken(null);
                  setStores([]);
                  setSelectedStore(null);
                  setStep("credentials");
                  setFormError(null);
                }}
              >
                Volver
              </button>
            </div>
          ) : null}

          {step === "pin" && selectedStore ? (
            <form
              onSubmit={(e) => {
                void handlePinSubmit(e);
              }}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold text-foreground text-center">
                Ingresa el PIN de {selectedStore.name}
              </h2>
              <div>
                <label
                  htmlFor="portal-pin"
                  className="text-sm font-medium text-foreground mb-2 block"
                >
                  PIN de 4 dígitos
                </label>
                <PortalPinInput
                  id="portal-pin"
                  value={pin}
                  onChange={(value) => {
                    setPin(value);
                    setFormError(null);
                  }}
                  disabled={portalVerifyPin.isPending}
                  autoFocus
                />
              </div>
              {formError ? (
                <p className="text-sm text-destructive">{formError}</p>
              ) : null}
              <Button
                type="submit"
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold shadow-glow"
                disabled={portalVerifyPin.isPending || pin.length !== 4}
              >
                {portalVerifyPin.isPending ? "Verificando..." : "Verificar"}
              </Button>
              <button
                type="button"
                className="w-full text-sm text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setPin("");
                  setFormError(null);
                  if (isMultiStore) {
                    setStep("store");
                    return;
                  }
                  setTempToken(null);
                  setStores([]);
                  setSelectedStore(null);
                  setStep("credentials");
                }}
              >
                Volver
              </button>
            </form>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
