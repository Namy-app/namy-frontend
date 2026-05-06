"use client";

import { Capacitor } from "@capacitor/core";
import { Keyboard } from "@capacitor/keyboard";
import { useEffect } from "react";

export function KeyboardScrollFix(): null {
  useEffect(() => {
    if (Capacitor.getPlatform() !== "android") {return;}

    const onShow = Keyboard.addListener("keyboardDidShow", (info) => {
      document.body.style.paddingBottom = `${info.keyboardHeight}px`;
      setTimeout(() => {
        const el = document.activeElement as HTMLElement | null;
        if (el && ["INPUT", "TEXTAREA"].includes(el.tagName)) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 50);
    });

    const onHide = Keyboard.addListener("keyboardDidHide", () => {
      document.body.style.paddingBottom = "";
    });

    return () => {
      void onShow.then((h) => h.remove());
      void onHide.then((h) => h.remove());
    };
  }, []);

  return null;
}
