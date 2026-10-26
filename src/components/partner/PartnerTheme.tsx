"use client";

import { useEffect } from "react";

import { buildPartnerTheme } from "@/lib/partner-theme";
import { usePartnerConfig } from "@/store/usePartnerStore";

export function PartnerTheme(): null {
  const partner = usePartnerConfig();

  useEffect(() => {
    if (!partner) {
      return;
    }
    const root = document.documentElement;
    const overrides = buildPartnerTheme(partner);
    const previousMode = root.getAttribute("data-partner-mode");
    root.setAttribute("data-partner-mode", "true");
    const previous = Object.keys(overrides).map(
      (key) => [key, root.style.getPropertyValue(key)] as const
    );
    for (const [key, value] of Object.entries(overrides)) {
      root.style.setProperty(key, value);
    }
    return () => {
      if (previousMode === null) {
        root.removeAttribute("data-partner-mode");
      } else {
        root.setAttribute("data-partner-mode", previousMode);
      }
      for (const [key, value] of previous) {
        if (value) {
          root.style.setProperty(key, value);
        } else {
          root.style.removeProperty(key);
        }
      }
    };
  }, [partner]);

  return null;
}
