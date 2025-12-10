"use client";

import { useRouter } from "next/navigation";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useLogout } from "@/domains/user/hooks";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { useAuthStore } from "@/store/useAuthStore";

export default function UserPage(): React.JSX.Element | null {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const logoutMutation = useLogout();

  if (!user) {
    // user is not available yet — avoid rendering until it's present
    return null;
  }

  const handleLogout = async (): Promise<void> => {
    try {
      await logoutMutation.mutateAsync();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      router.push("/");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: errorMessage || "Could not log out",
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-hero p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="p-6 shadow-glow">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user.displayName || user.email}!
            </h1>
            <p className="text-muted-foreground mb-6">
              Manage your account and explore delicious discounts
            </p>

            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-muted-foreground">
                  Email
                </h2>
                <p className="text-foreground">{user.email}</p>
              </div>

              {user.displayName ? (
                <div>
                  <h2 className="text-sm font-medium text-muted-foreground">
                    Display Name
                  </h2>
                  <p className="text-foreground">{user.displayName}</p>
                </div>
              ) : null}

              {user.phone ? (
                <div>
                  <h2 className="text-sm font-medium text-muted-foreground">
                    Phone
                  </h2>
                  <p className="text-foreground">{user.phone}</p>
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex gap-4">
              <Button
                onClick={() => router.push("/store")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Browse Stores
              </Button>
              <Button
                onClick={() => {
                  void handleLogout();
                }}
                variant="outline"
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
