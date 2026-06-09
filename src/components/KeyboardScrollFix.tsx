"use client";

import { Capacitor } from "@capacitor/core";
import type { PluginListenerHandle } from "@capacitor/core";
import { Keyboard } from "@capacitor/keyboard";
import { useEffect } from "react";

export function KeyboardScrollFix(): null {
  useEffect(() => {
    const platform = Capacitor.getPlatform();
    if (platform !== "android" && platform !== "ios") {
      return;
    }

    let keyboardVisible = false;
    let focusTimer: ReturnType<typeof setTimeout> | null = null;
    let showHandle: PluginListenerHandle | null = null;
    let hideHandle: PluginListenerHandle | null = null;

    function scrollActiveIntoView() {
      const el = document.activeElement as HTMLElement | null;
      if (!el || !["INPUT", "TEXTAREA"].includes(el.tagName)) {
        return;
      }
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function onFocusIn(e: FocusEvent) {
      const el = e.target as HTMLElement | null;
      if (!el || !["INPUT", "TEXTAREA"].includes(el.tagName)) {
        return;
      }
      if (!keyboardVisible) {
        return;
      }
      if (focusTimer) {
        clearTimeout(focusTimer);
      }
      focusTimer = setTimeout(scrollActiveIntoView, 80);
    }

    // keyboardDidShow gives us the final keyboard height after animation.
    // On iOS we shrink the container by setting --keyboard-height; Android's
    // WebView already resizes via adjustResize so we leave --keyboard-height at 0.
    void Keyboard.addListener("keyboardDidShow", (info) => {
      keyboardVisible = true;
      if (platform === "ios") {
        document.documentElement.style.setProperty(
          "--keyboard-height",
          `${info.keyboardHeight}px`
        );
      }
      setTimeout(scrollActiveIntoView, 80);
    }).then((h) => {
      showHandle = h;
    });

    void Keyboard.addListener("keyboardWillHide", () => {
      keyboardVisible = false;
      if (platform === "ios") {
        document.documentElement.style.setProperty("--keyboard-height", "0px");
      }
    }).then((h) => {
      hideHandle = h;
    });

    document.addEventListener("focusin", onFocusIn);

    return () => {
      if (focusTimer) {
        clearTimeout(focusTimer);
      }
      void showHandle?.remove();
      void hideHandle?.remove();
      document.removeEventListener("focusin", onFocusIn);
      document.documentElement.style.removeProperty("--keyboard-height");
    };
  }, []);

  return null;
}
