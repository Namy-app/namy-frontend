"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement forgot password API call when backend is ready
    // For now, simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Password reset email sent",
      description: "Check your email for instructions to reset your password.",
    });

    setEmailSent(true);
    setIsSubmitting(false);
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
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Forgot Password?
          </h1>
          <p className="text-muted-foreground text-sm">
            {emailSent
              ? "We've sent you a password reset link"
              : "Enter your email and we'll send you a reset link"}
          </p>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                className="h-12 rounded-xl"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold shadow-glow"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
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
        ) : (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                We've sent a password reset link to:
              </p>
              <p className="text-foreground font-medium text-center mt-2">
                {email}
              </p>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>Didn't receive the email?</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Check your spam folder</li>
                <li>Make sure you entered the correct email</li>
                <li>Wait a few minutes and try again</li>
              </ul>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setEmailSent(false);
                setEmail("");
              }}
            >
              Try Different Email
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => router.push("/auth")}
            >
              Back to Login
            </Button>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs text-center text-muted-foreground">
            <strong>Note:</strong> Password reset is coming soon! This feature
            requires backend implementation.
          </p>
        </div>
      </Card>
    </div>
  );
}
