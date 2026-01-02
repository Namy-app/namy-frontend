"use client";

import { App as CapApp } from "@capacitor/app";
import { useEffect } from "react";

export function CapacitorProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Capacitor plugins
    const initCapacitor = async () => {
      // Handle app state changes
      CapApp.addListener("appStateChange", ({ isActive }) => {
        console.error("App state changed. Is active:", isActive);
      }).catch(console.error);

      // Handle URL opens
      CapApp.addListener("appUrlOpen", (data) => {
        console.error("App opened with URL:", data);
      }).catch(console.error);

      // Handle back button
      CapApp.addListener("backButton", ({ canGoBack }) => {
        if (!canGoBack) {
          CapApp.exitApp().catch(console.error);
        } else {
          window.history.back();
        }
      }).catch(console.error);
    };

    void initCapacitor();

    // Cleanup listeners on unmount
    return () => {
      void CapApp.removeAllListeners();
    };
  }, []);

  return <>{children}</>;
}
