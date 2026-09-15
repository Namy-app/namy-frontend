"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { usePortalChangePassword } from "@/domains/portal/hooks";
import { usePortalAuthStore } from "@/domains/portal/store/portalAuthStore";
import { useToast } from "@/hooks/use-toast";
import { extractErrorMessage } from "@/lib/utils";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { PasswordInput } from "@/shared/components/PasswordInput";

const MIN_PASSWORD_LENGTH = 8;

export default function PortalChangePasswordPage(): React.JSX.Element {
  const router = useRouter();
  const { toast } = useToast();
  const tempPassword = usePortalAuthStore((state) => state.tempPassword);
  const updateOwner = usePortalAuthStore((state) => state.updateOwner);
  const clearTempPassword = usePortalAuthStore(
    (state) => state.clearTempPassword
  );
  const changePassword = usePortalChangePassword();

  const [currentPassword, setCurrentPassword] = useState(tempPassword ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setFormError(null);

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setFormError(
        `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError("Las contraseñas no coinciden");
      return;
    }

    try {
      await changePassword.mutateAsync({
        currentPassword,
        newPassword,
      });
      updateOwner({ mustChangePassword: false });
      clearTempPassword();
      toast({
        title: "Contraseña actualizada",
        description: "Ya puedes usar tu nueva contraseña.",
      });
      router.replace("/portal/dashboard");
    } catch (error) {
      const message =
        extractErrorMessage(error) ||
        "No se pudo cambiar la contraseña. Intenta de nuevo.";
      setFormError(message);
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="w-full p-8 bg-card border-none shadow-glow">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Bienvenido, por favor cambia tu contraseña
            </h1>
            <p className="text-sm text-muted-foreground">
              Usa la contraseña temporal que recibiste por correo, luego elige
              una nueva.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              void handleSubmit(e);
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="current-password"
                className="text-sm font-medium text-foreground mb-2 block"
              >
                Contraseña actual
              </label>
              <PasswordInput
                id="current-password"
                placeholder="Contraseña temporal"
                className="h-12 rounded-xl"
                required
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setFormError(null);
                }}
                disabled={changePassword.isPending}
              />
            </div>

            <div>
              <label
                htmlFor="new-password"
                className="text-sm font-medium text-foreground mb-2 block"
              >
                Nueva contraseña
              </label>
              <PasswordInput
                id="new-password"
                placeholder="••••••••"
                className="h-12 rounded-xl"
                required
                minLength={MIN_PASSWORD_LENGTH}
                autoComplete="new-password"
                showStrength
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setFormError(null);
                }}
                disabled={changePassword.isPending}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Mínimo {MIN_PASSWORD_LENGTH} caracteres
              </p>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="text-sm font-medium text-foreground mb-2 block"
              >
                Confirmar contraseña
              </label>
              <PasswordInput
                id="confirm-password"
                placeholder="••••••••"
                className="h-12 rounded-xl"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setFormError(null);
                }}
                disabled={changePassword.isPending}
              />
            </div>

            {formError ? (
              <p className="text-sm text-destructive">{formError}</p>
            ) : null}

            <Button
              type="submit"
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold shadow-glow"
              disabled={changePassword.isPending}
            >
              {changePassword.isPending ? "Guardando..." : "Guardar contraseña"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
