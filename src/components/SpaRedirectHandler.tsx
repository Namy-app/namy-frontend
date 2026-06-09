"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  APP_BOOT_KEY,
  getCapacitorPlaceholderPath,
  isCapacitorDynamicRoute,
  isCapacitorNative,
  setCapacitorDynamicPath,
  SPA_REDIRECT_KEY,
} from "@/lib/capacitor-navigate";

/**
 * Client-side 404 recovery when synchronous cold-start did not run
 * (e.g. soft navigation back to root with a pending spa_redirect).
 */
export function SpaRedirectHandler(): null {
  const router = useRouter();

  useEffect(() => {
    if (!isCapacitorNative()) {
      return;
    }

    const redirect = localStorage.getItem(SPA_REDIRECT_KEY);
    if (!redirect || redirect === "/") {
      return;
    }

    const path = window.location.pathname;
    if (
      !path.endsWith("/index.html") &&
      path !== "/" &&
      path !== "/index.html"
    ) {
      return;
    }

    localStorage.removeItem(SPA_REDIRECT_KEY);
    sessionStorage.setItem(APP_BOOT_KEY, "1");

    if (isCapacitorDynamicRoute(redirect)) {
      setCapacitorDynamicPath(redirect);
      router.replace(getCapacitorPlaceholderPath(redirect));
      return;
    }

    router.replace(redirect);
  }, [router]);

  return null;
}
