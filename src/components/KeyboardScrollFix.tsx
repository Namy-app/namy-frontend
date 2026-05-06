"use client";

import { Capacitor } from "@capacitor/core";
import { Keyboard } from "@capacitor/keyboard";
import { useEffect } from "react";

export function KeyboardScrollFix(): null {
  useEffect(() => {
    const platform = Capacitor.getPlatform();
    if (platform !== "android" && platform !== "ios") {
      return;
    }

    const onShow = Keyboard.addListener(
      "keyboardDidShow",
      (info: { keyboardHeight: number }) => {
        if (platform === "android") {
          document.body.style.paddingBottom = `${info.keyboardHeight}px`;
        }
        setTimeout(() => {
          const el = document.activeElement as HTMLElement | null;
          if (el && ["INPUT", "TEXTAREA"].includes(el.tagName)) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 50);
      }
    );

    const onHide = Keyboard.addListener("keyboardDidHide", () => {
      if (platform === "android") {
        document.body.style.paddingBottom = "";
      }
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
