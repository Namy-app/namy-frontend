"use client";

import { useEffect } from "react";

import { buildPartnerTheme } from "@/lib/partner-theme";
import { usePartnerConfig } from "@/store/usePartnerStore";

export function PartnerTheme(): null {
  const partner = usePartnerConfig();

  useEffect(() => {
    const root = document.documentElement;
    const overrides = buildPartnerTheme(partner);
    const previous = Object.keys(overrides).map(
      (key) => [key, root.style.getPropertyValue(key)] as const
    );
    for (const [key, value] of Object.entries(overrides)) {
      root.style.setProperty(key, value);
    }
    return () => {
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
