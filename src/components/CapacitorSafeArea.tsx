"use client";

import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { useEffect } from "react";

export function CapacitorSafeArea(): null {
  useEffect(() => {
    if (Capacitor.getPlatform() !== "android") {
      return;
    }

    document.documentElement.classList.add("capacitor-android");

    void StatusBar.setOverlaysWebView({ overlay: false });
    void StatusBar.setStyle({ style: Style.Light });
  }, []);

  return null;
}
