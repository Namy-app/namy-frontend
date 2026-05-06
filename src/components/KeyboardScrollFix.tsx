"use client";

import { Capacitor } from "@capacitor/core";
// @ts-expect-error Capacitor keyboard plugin types can be unavailable in web-only type checking.
import { Keyboard } from "@capacitor/keyboard";
import { useEffect } from "react";

export function KeyboardScrollFix(): null {
  useEffect(() => {
    if (Capacitor.getPlatform() !== "android") {
      return;
    }

    const onShow = Keyboard.addListener(
      "keyboardDidShow",
      (info: { keyboardHeight: number }) => {
        document.body.style.paddingBottom = `${info.keyboardHeight}px`;
        setTimeout(() => {
          const el = document.activeElement as HTMLElement | null;
          if (el && ["INPUT", "TEXTAREA"].includes(el.tagName)) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 50);
      }
    );

    const onHide = Keyboard.addListener("keyboardDidHide", () => {
      document.body.style.paddingBottom = "";
    });

    return () => {
      onShow
        .then((h: { remove: () => Promise<void> }) => h.remove())
        .catch(() => undefined);
      onHide
        .then((h: { remove: () => Promise<void> }) => h.remove())
        .catch(() => undefined);
    };
  }, []);

  return null;
}
