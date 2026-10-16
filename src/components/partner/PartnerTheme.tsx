"use client";

import { useEffect } from "react";

import { usePartnerConfig } from "@/store/usePartnerStore";

/** Convert partner hex colours to the HSL channels used by Namy's tokens. */
function hexToHsl(value: string | undefined): string | null {
  if (!value || !/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(value)) {
    return null;
  }
  const hex = value.slice(1);
  const expanded = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex;
  const r = parseInt(expanded.slice(0, 2), 16) / 255;
  const g = parseInt(expanded.slice(2, 4), 16) / 255;
  const b = parseInt(expanded.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const lightness = (max + min) / 2;
  let hue = 0;
  if (delta) {
    if (max === r) {
      hue = ((g - b) / delta) % 6;
    } else if (max === g) {
      hue = (b - r) / delta + 2;
    } else {
      hue = (r - g) / delta + 4;
    }
  }
  const saturation = delta ? delta / (1 - Math.abs(2 * lightness - 1)) : 0;
  return `${(hue * 60 + 360) % 360} ${saturation * 100}% ${lightness * 100}%`;
}

export function PartnerTheme(): null {
  const partner = usePartnerConfig();

  useEffect(() => {
    if (!partner) {
      return;
    }
    const root = document.documentElement;
    const primary = hexToHsl(partner.branding.colors?.primary);
    const secondary = hexToHsl(partner.branding.colors?.secondary);
    const overrides: Record<string, string> = {};
    if (primary) {
      overrides["--partner-primary"] = partner.branding.colors!.primary!;
      overrides["--primary"] = primary;
      overrides["--ring"] = primary;
      overrides["--primary-glow"] = primary;
      overrides["--gradient-primary"] =
        `linear-gradient(135deg, hsl(${primary}), hsl(${primary}))`;
      overrides["--shadow-card"] = `0 4px 20px -5px hsl(${primary} / 0.15)`;
      overrides["--shadow-glow"] = `0 0 30px hsl(${primary} / 0.3)`;
    }
    if (secondary) {
      overrides["--partner-secondary"] = partner.branding.colors!.secondary!;
      overrides["--secondary"] = secondary;
      overrides["--accent"] = secondary;
      overrides["--gradient-secondary"] =
        `linear-gradient(135deg, hsl(${secondary}), hsl(${secondary}))`;
    }
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
