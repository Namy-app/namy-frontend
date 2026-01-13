"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

import { useResetPassword } from "@/domains/user/hooks";
import { useToast } from "@/hooks/use-toast";
import { extractErrorMessage } from "@/lib/utils";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { PasswordInput } from "@/shared/components/PasswordInput";

function ResetPasswordForm(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const tokenParam = searchParams?.get("token") ?? null;
  const token = tokenParam ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isTokenValid = !!tokenParam;
  const resetPasswordMutation = useResetPassword();

  useEffect(() => {
    if (!tokenParam) {
      toast({
        variant: "destructive",
        title: "Invalid reset link",
        description: "This password reset link is invalid or has expired.",
      });
      setTimeout(() => router.push("/auth/forgot-password"), 3000);
    }
  }, [tokenParam, router, toast]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
      });
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        token,
        newPassword,
      });

      toast({
        title: "Password reset successful!",
        description: "You can now login with your new password.",
      });

      setTimeout(() => router.push("/auth"), 2000);
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast({
        variant: "destructive",
        title: "Reset failed",
        description:
          errorMessage ||
          "Failed to reset password. The link may have expired.",
      });
    }
  };

  if (!isTokenValid) {
    return (
      <div className="flex min-h-screen bg-gradient-hero items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 bg-card border-border shadow-glow">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Invalid Reset Link
            </h2>
            <p className="text-muted-foreground">
              Redirecting to password reset...
            </p>
          </div>
        </Card>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Reset Your Password
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter your new password below
          </p>
        </div>

        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className="space-y-4"
        >
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              New Password
            </label>
            <PasswordInput
              placeholder="••••••••"
              className="h-12 rounded-xl"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={resetPasswordMutation.isPending}
              showStrength
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use 8+ characters with mix of letters, numbers & symbols
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Confirm New Password
            </label>
            <PasswordInput
              placeholder="••••••••"
              className="h-12 rounded-xl"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={resetPasswordMutation.isPending}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold shadow-glow"
            disabled={resetPasswordMutation.isPending}
          >
            {resetPasswordMutation.isPending
              ? "Resetting..."
              : "Reset Password"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => router.push("/auth")}
          >
            Back to Login
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen bg-gradient-hero items-center justify-center p-6">
          <Card className="w-full max-w-md p-8 bg-card border-border shadow-glow">
            <div className="text-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </Card>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
