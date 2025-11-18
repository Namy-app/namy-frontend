"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { useVerifyEmail, useResendVerification } from "@/domains/user/hooks";
import { useToast } from "@/hooks/use-toast";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const verifyEmailMutation = useVerifyEmail();
  const resendVerificationMutation = useResendVerification();

  // Get email from URL params if available
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !code) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both email and verification code.",
      });
      return;
    }

    try {
      const response = await verifyEmailMutation.mutateAsync({
        email,
        code,
      });

      toast({
        title: "Email verified!",
        description: response.message,
      });

      // Redirect to login page after successful verification
      setTimeout(() => {
        router.push("/auth");
      }, 2000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description:
          error.message || "Invalid verification code. Please try again.",
      });
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter your email address.",
      });
      return;
    }

    try {
      const response = await resendVerificationMutation.mutateAsync({
        email,
      });

      toast({
        title: "Verification email sent",
        description: response.message,
      });

      // Set cooldown to 60 seconds
      setResendCooldown(60);
    } catch (error: any) {
      // Check if error message contains cooldown information
      const cooldownMatch = error.message?.match(/wait (\d+) seconds/);
      if (cooldownMatch) {
        const seconds = parseInt(cooldownMatch[1]);
        setResendCooldown(seconds);
      }

      toast({
        variant: "destructive",
        title: "Failed to resend",
        description:
          error.message ||
          "Could not resend verification email. Please try again later.",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-hero items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 bg-card border-border shadow-glow">
        <div className="text-center mb-8">
          <Image
            src="/assets/namy-logo.jpg"
            alt="Ñamy Logo"
            width={96}
            height={96}
            className="mx-auto mb-4 rounded-2xl shadow-glow"
          />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Verify your email
          </h1>
          <p className="text-muted-foreground text-sm">
            We&apos;ve sent a verification code to your email address. Please
            enter it below to complete your registration.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleVerifyEmail}>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="your@email.com"
              className="h-12 rounded-xl"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={verifyEmailMutation.isPending}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Verification Code
            </label>
            <Input
              id="code"
              name="code"
              type="text"
              placeholder="Enter 6-digit code"
              className="h-12 rounded-xl text-center text-2xl tracking-widest font-mono"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              disabled={verifyEmailMutation.isPending}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold shadow-glow"
            disabled={verifyEmailMutation.isPending}
          >
            {verifyEmailMutation.isPending ? "Verifying..." : "Verify Email"}
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the code?
            </p>
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-full"
              onClick={handleResendVerification}
              disabled={
                resendVerificationMutation.isPending || resendCooldown > 0
              }
            >
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : resendVerificationMutation.isPending
                ? "Sending..."
                : "Resend verification email"}
            </Button>
          </div>

          <div className="text-center pt-2">
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => router.push("/auth")}
            >
              Back to Login
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
