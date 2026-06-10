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
  // Use Zustand's built-in hasHydrated to wait for localStorage rehydration
  const [isHydrated, setIsHydrated] = useState(() =>
    useAuthStore.persist.hasHydrated()
  );

  useEffect(() => {
    if (isHydrated) {
      return;
    }
    // Subscribe to Zustand's rehydration finish event
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
    // In case it already hydrated between the useState init and this effect,
    // schedule the state update asynchronously to avoid cascading renders.
    if (useAuthStore.persist.hasHydrated()) {
      setTimeout(() => setIsHydrated(true), 0);
    }
    return unsub;
  }, [isHydrated]);

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

  // Show loading spinner while waiting for Zustand to rehydrate from localStorage
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
