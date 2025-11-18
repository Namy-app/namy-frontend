"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { useLogin, useSignup } from "@/domains/user/hooks";
import { useToast } from "@/hooks/use-toast";
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
      router.push("/user");
    }
  }, [isAuthenticated, checkExpiration, router]);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Signup state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupDisplayName, setSignupDisplayName] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const loginMutation = useLogin();
  const signupMutation = useSignup();

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      await loginMutation.mutateAsync({
        emailOrUsername: loginEmail,
        password: loginPassword,
        rememberMe,
      });

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });

      router.push("/user");
    } catch (error) {
      // Check if error is about unverified email
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage?.includes("Email not verified")) {
        toast({
          variant: "default",
          title: "Email verification required",
          description: errorMessage,
        });

        // Redirect to verify email page with email pre-filled
        const email = loginEmail.includes("@") ? loginEmail : "";
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: errorMessage || "Invalid email, username or password",
        });
      }
    }
  };

  const handleSignup = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (signupPassword !== signupConfirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
      });
      return;
    }

    if (!agreeToTerms) {
      toast({
        variant: "destructive",
        title: "Terms Required",
        description: "Please agree to the terms and conditions to continue.",
      });
      return;
    }

    try {
      await signupMutation.mutateAsync({
        email: signupEmail,
        username: signupUsername || undefined,
        password: signupPassword,
        displayName: signupDisplayName || undefined,
      });

      toast({
        title: "Registration Successful! 🎉",
        description: `A verification code has been sent to ${signupEmail}. Please check your email and verify your account.`,
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
        title: "Signup failed",
        description: errorMessage || "Could not create account",
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
          <p className="text-muted-foreground">Unlock delicious discounts</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 rounded-[14px]">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
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
                  Email or Username
                </label>
                <Input
                  type="text"
                  placeholder="your@email.com or username"
                  className="h-12 rounded-xl"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={loginMutation.isPending}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Password
                </label>
                <PasswordInput
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
                  label="Remember me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loginMutation.isPending}
                />
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold shadow-glow"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
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
                  Display Name
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
                  Email
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
                  Username
                </label>
                <Input
                  type="text"
                  placeholder="username"
                  className="h-12 rounded-xl"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  disabled={signupMutation.isPending}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Password
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
                  Use 8+ characters with mix of letters, numbers & symbols
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Confirm Password
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

              <Checkbox
                label={
                  <span>
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-primary hover:underline"
                      target="_blank"
                    >
                      Terms & Conditions
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
                {signupMutation.isPending ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
