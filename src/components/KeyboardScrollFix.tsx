"use client";

import { Capacitor } from "@capacitor/core";
import type { PluginListenerHandle } from "@capacitor/core";
import { Keyboard } from "@capacitor/keyboard";
import { useEffect } from "react";

const FOCUSABLE_INPUT_SELECTOR =
  'input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), select:not([disabled]), [contenteditable="true"]';

function isFocusableInput(el: Element | null): el is HTMLElement {
  if (!el || !(el instanceof HTMLElement)) {
    return false;
  }
  return el.matches(FOCUSABLE_INPUT_SELECTOR);
}

function setKeyboardHeight(height: number): void {
  const px = `${Math.max(0, Math.round(height))}px`;
  document.documentElement.style.setProperty("--keyboard-height", px);
  document.documentElement.style.setProperty(
    "--keyboard-safe-height",
    height > 0 ? `calc(100dvh - ${px})` : "100dvh"
  );
}

function scrollActiveIntoView(): void {
  const el = document.activeElement;
  if (!isFocusableInput(el)) {
    return;
  }

  const keyboardHeight = Number.parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--keyboard-height"
    ),
    10
  );
  if (keyboardHeight > 0) {
    el.style.scrollMarginBottom = `${Math.min(keyboardHeight + 20, 320)}px`;
  }

  el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
}

function scheduleScrollIntoView(): void {
  // Keyboard animation varies by platform — retry so the field stays visible
  for (const delay of [0, 80, 180, 350]) {
    setTimeout(scrollActiveIntoView, delay);
  }
}

export function KeyboardScrollFix(): null {
  useEffect(() => {
    const platform = Capacitor.getPlatform();
    const isNative = platform === "android" || platform === "ios";

    let showHandle: PluginListenerHandle | null = null;
    let hideHandle: PluginListenerHandle | null = null;

    function onFocusIn(e: FocusEvent): void {
      if (!isFocusableInput(e.target as Element)) {
        return;
      }
      scheduleScrollIntoView();
    }

    function onViewportChange(): void {
      const viewport = window.visualViewport;
      if (!viewport) {
        return;
      }

      const keyboardHeight = window.innerHeight - viewport.height;
      setKeyboardHeight(keyboardHeight);

      if (keyboardHeight > 0) {
        scheduleScrollIntoView();
      }
    }

    document.addEventListener("focusin", onFocusIn);

    if (isNative) {
      void Keyboard.addListener("keyboardDidShow", (info) => {
        // iOS: shrink scroll container. Android WebView resizes via adjustResize.
        if (platform === "ios") {
          setKeyboardHeight(info.keyboardHeight);
        }
        scheduleScrollIntoView();
      }).then((h) => {
        showHandle = h;
      });

      void Keyboard.addListener("keyboardWillHide", () => {
        setKeyboardHeight(0);
      }).then((h) => {
        hideHandle = h;
      });
    } else if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onViewportChange);
      window.visualViewport.addEventListener("scroll", onViewportChange);
    }

    return () => {
      document.removeEventListener("focusin", onFocusIn);
      void showHandle?.remove();
      void hideHandle?.remove();
      window.visualViewport?.removeEventListener("resize", onViewportChange);
      window.visualViewport?.removeEventListener("scroll", onViewportChange);
      document.documentElement.style.removeProperty("--keyboard-height");
      document.documentElement.style.removeProperty("--keyboard-safe-height");
    };
  }, []);

  return null;
}
