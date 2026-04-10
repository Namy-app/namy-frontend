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

    const applyStatusBar = async () => {
      // overlay: false = WebView is sized to exclude status bar (top) and
      // navigation bar (bottom). fixed bottom-0 elements sit naturally
      // above the Android nav bar with no extra padding needed.
      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: "#ffffff" });

      // Status bar height: screen.height - outerHeight
      const statusBarHeight = window.screen.height - window.outerHeight;
      const safeTop = statusBarHeight > 0 ? statusBarHeight : 24;

      document.documentElement.style.setProperty(
        "--status-bar-height",
        `${safeTop}px`
      );
    };

    void applyStatusBar();
  }, []);

  return null;
}
