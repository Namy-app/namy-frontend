"use client";

import { App } from "@capacitor/app";
import { useEffect } from "react";

import { isNativeApp } from "@/lib/app-platform";
import { recoverPendingPromo } from "@/store/usePromoStore";

/**
 * Runs promo recovery on:
 * 1. Initial mount — picks up promos received while the app was closed.
 * 2. Capacitor appStateChange (isActive: true) — picks up promos received
 *    while the app was backgrounded.
 *
 * Mount on the Explore page (already the push-notification entry point).
 */
export function usePromoRecovery(): void {
  useEffect(() => {
    // Recover any promo that arrived before the app opened
    void recoverPendingPromo();

    if (!isNativeApp()) {
      return;
    }

    // Also recover when the user brings the app back to foreground
    const listenerPromise = App.addListener(
      "appStateChange",
      ({ isActive }) => {
        if (isActive) {
          void recoverPendingPromo();
        }
      }
    );

    return () => {
      void listenerPromise.then((handle) => handle.remove());
    };
  }, []);
}
