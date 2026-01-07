"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { useLogin, useSignup } from "@/domains/user/hooks";
import { useToast } from "@/hooks/use-toast";
import type { AuthResponse } from "@/lib/api-types";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Checkbox } from "@/shared/components/Checkbox";
import { Input } from "@/shared/components/Input";
import { PasswordInput } from "@/shared/components/PasswordInput";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/Tabs";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthPage(): React.JSX.Element {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, checkExpiration } = useAuthStore();

  // Redirect to user dashboard if already authenticated
  useEffect(() => {
    const isValid = checkExpiration();
    if (isAuthenticated && isValid) {
      router.push("/explore");
    }
  }, [isAuthenticated, checkExpiration, router]);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Signup state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupDisplayName, setSignupDisplayName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const loginMutation = useLogin();
  const signupMutation = useSignup();

  const updateCrisp = (user: AuthResponse["user"]): void => {
    try {
      if (typeof window !== "undefined" && window.$crisp && user) {
        window.$crisp.push(["set", "user:email", user.email]);
        window.$crisp.push(["set", "user:name", user.displayName ?? ""]);
      }
    } catch (error) {
      console.error("Failed to update Crisp user info:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      const response = await loginMutation.mutateAsync({
        email: loginEmail,
        password: loginPassword,
        rememberMe,
      });

      updateCrisp(response.user);

      toast({
        title: "Bienvenido de nuevo!",
        description: "Has iniciado sesión con éxito.",
      });

      router.push("/explore");
    } catch (error) {
      // Check if error is about unverified email
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage?.includes("Email not verified")) {
        toast({
          variant: "default",
          title: "Verificación de correo electrónico requerida",
          description: errorMessage,
        });

        // Redirect to verify email page with email pre-filled
        const email = loginEmail.includes("@") ? loginEmail : "";
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        toast({
          variant: "destructive",
          title: "Error de inicio de sesión",
          description:
            errorMessage || "Correo electrónico o contraseña inválidos",
        });
      }
    }
  };

  const handleSignup = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (signupPassword !== signupConfirmPassword) {
      toast({
        variant: "destructive",
        title: "Las contraseñas no coinciden",
        description: "Por favor, asegúrate de que tus contraseñas coincidan.",
      });
      return;
    }

    if (!agreeToTerms) {
      toast({
        variant: "destructive",
        title: "Se requieren términos",
        description:
          "Por favor, acepta los términos y condiciones para continuar.",
      });
      return;
    }

    try {
      const response = await signupMutation.mutateAsync({
        email: signupEmail,
        password: signupPassword,
        displayName: signupDisplayName || undefined,
        referralCode: referralCode || undefined,
      });
      updateCrisp(response.user);

      toast({
        title: response.user.isPremium
          ? "¡Registro exitoso y membresía Premium activada! 🎉"
          : "¡Registro exitoso! 🎉",
        description: `Se ha enviado un código de verificación a ${signupEmail}. Por favor, revisa tu correo electrónico y verifica tu cuenta.`,
      });

      // Redirect to verify email page
      router.push(
        `/auth/verify-email?email=${encodeURIComponent(signupEmail)}`
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast({
        variant: "destructive",
        title: "Error de registro",
        description: errorMessage || "No se pudo crear la cuenta",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-hero items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 bg-card border-border shadow-glow">
        <div className="text-center mb-8">
          <Image
            src="/namy-logo.webp"
            alt="Ñamy Logo"
            width={96}
            height={96}
            className="mx-auto mb-4 rounded-2xl shadow-glow"
          />
          <h1 className="text-4xl font-bold text-primary mb-2">Ñamy</h1>
          <p className="text-muted-foreground">
            Desbloquea descuentos deliciosos
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 rounded-[14px]">
            <TabsTrigger value="login">Acceso</TabsTrigger>
            <TabsTrigger value="signup">Registrarse</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form
              onSubmit={(e) => {
                void handleLogin(e);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Correo electrónico
                </label>
                <Input
                  name="email"
                  type="text"
                  placeholder="your@email.com"
                  className="h-12 rounded-xl"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={loginMutation.isPending}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Contraseña
                </label>
                <PasswordInput
                  name="password"
                  placeholder="••••••••"
                  className="h-12 rounded-xl"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={loginMutation.isPending}
                />
              </div>

              <div className="flex items-center justify-between">
                <Checkbox
                  label="Recuérdame"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loginMutation.isPending}
                />
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold shadow-glow"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending
                  ? "Iniciando sesión..."
                  : "Iniciar sesión"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form
              onSubmit={(e) => {
                void handleSignup(e);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Nombre para mostrar
                </label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  className="h-12 rounded-xl"
                  value={signupDisplayName}
                  onChange={(e) => setSignupDisplayName(e.target.value)}
                  disabled={signupMutation.isPending}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Correo electrónico
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="h-12 rounded-xl"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  disabled={signupMutation.isPending}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Contraseña
                </label>
                <PasswordInput
                  placeholder="••••••••"
                  className="h-12 rounded-xl"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  disabled={signupMutation.isPending}
                  showStrength
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Usa 8+ caracteres con una mezcla de letras, números y símbolos
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Confirmar contraseña
                </label>
                <PasswordInput
                  placeholder="••••••••"
                  className="h-12 rounded-xl"
                  required
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  disabled={signupMutation.isPending}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Código de referido (opcional)
                </label>
                <Input
                  type="text"
                  placeholder="Ingresa el código de referido"
                  className="h-12 rounded-xl"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  disabled={signupMutation.isPending}
                />
              </div>

              <Checkbox
                label={
                  <span>
                    Acepto los{" "}
                    <Link
                      href="/terms"
                      className="text-primary hover:underline"
                      target="_blank"
                    >
                      Términos y Condiciones
                    </Link>
                  </span>
                }
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                disabled={signupMutation.isPending}
              />

              <Button
                type="submit"
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold shadow-glow"
                disabled={signupMutation.isPending}
              >
                {signupMutation.isPending ? "Creando cuenta..." : "Registrarse"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
