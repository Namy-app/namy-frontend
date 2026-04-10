"use client";

import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Handles the Android hardware back button.
 *
 * Default Capacitor behavior exits the app when the back button is pressed.
 * This component intercepts the event and navigates back in browser history
 * instead. If there is no history to go back to, it navigates to the home
 * page rather than exiting.
 */
export function AndroidBackHandler(): null {
  const router = useRouter();

  useEffect(() => {
    if (Capacitor.getPlatform() !== "android") {
      return;
    }

    const listener = App.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        router.replace("/");
      }
    });

    return () => {
      void listener.then((handle) => handle.remove());
    };
  }, [router]);

  return null;
}
