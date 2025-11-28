"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthStore } from "@/store/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({
  children,
}: ProtectedRouteProps): React.JSX.Element | null {
  const router = useRouter();
  const { isAuthenticated, checkExpiration } = useAuthStore();

  useEffect(() => {
    // Check if session has expired
    const isValid = checkExpiration();

    // Redirect to login if not authenticated or session expired
    if (!isAuthenticated || !isValid) {
      router.push("/auth");
    }
  }, [isAuthenticated, checkExpiration, router]);

  // Don't render children until we verify authentication
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
