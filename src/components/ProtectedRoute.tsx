"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuthStore } from "@/store/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({
  children,
}: ProtectedRouteProps): React.JSX.Element | null {
  const router = useRouter();
  const { isAuthenticated, checkExpiration } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated after first render (Zustand has loaded from localStorage)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Only check auth after hydration is complete
    if (!isHydrated) {
      return;
    }

    // Check if session has expired
    const isValid = checkExpiration();

    // Redirect to login if not authenticated or session expired
    if (!isAuthenticated || !isValid) {
      router.push("/auth");
    }
  }, [isHydrated, isAuthenticated, checkExpiration, router]);

  // Show loading spinner during hydration
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  // Don't render children until we verify authentication
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
