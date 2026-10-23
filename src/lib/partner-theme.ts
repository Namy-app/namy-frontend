import type { PartnerConfig } from "@/store/usePartnerStore";

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

/** Opaque tints also match ticket cut-outs when painted over a coloured stub. */
function tint(hex: string, amount: number): string {
  const raw = hex.slice(1);
  const expanded = raw.length === 3 ? [...raw].map((c) => c + c).join("") : raw;
  return (
    "#" +
    [0, 2, 4]
      .map((index) =>
        Math.round(
          parseInt(expanded.slice(index, index + 2), 16) * amount +
            255 * (1 - amount)
        )
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
      .toUpperCase()
  );
}

function foreground(hex: string): { hsl: string; hex: string } {
  const raw = hex.slice(1);
  const expanded = raw.length === 3 ? [...raw].map((c) => c + c).join("") : raw;
  const rgb = [0, 2, 4].map((index) => {
    const value = parseInt(expanded.slice(index, index + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const luminance = rgb[0]! * 0.2126 + rgb[1]! * 0.7152 + rgb[2]! * 0.0722;
  return (luminance + 0.05) / 0.05 >= 1.05 / (luminance + 0.05)
    ? { hsl: "0 0% 0%", hex: "#000000" }
    : { hsl: "0 0% 100%", hex: "#FFFFFF" };
}

/** Produce scoped token overrides. An absent session must not recolour normal Namy. */
export function buildPartnerTheme(
  partner: PartnerConfig | null
): Record<string, string> {
  if (!partner) {
    return {};
  }
  const colors = partner.branding.colors ?? {};
  const primary = hexToHsl(colors.primary);
  const secondary = hexToHsl(colors.secondary);
  const overrides: Record<string, string> = {};
  if (primary) {
    Object.assign(overrides, {
      "--partner-primary": colors.primary!,
      "--primary": primary,
      "--primary-foreground": foreground(colors.primary!).hsl,
      "--ring": primary,
      "--primary-glow": primary,
      "--partner-primary-tint": tint(colors.primary!, 0.07),
      "--partner-border": `hsl(${primary} / 0.16)`,
      "--gradient-primary": `linear-gradient(135deg, hsl(${primary}), hsl(${primary}))`,
      "--gradient-hero": `linear-gradient(180deg, hsl(${primary} / 0.06), white)`,
      "--shadow-card": `0 4px 20px -5px hsl(${primary} / 0.15)`,
      "--shadow-glow": `0 0 30px hsl(${primary} / 0.3)`,
    });
  }
  if (secondary) {
    Object.assign(overrides, {
      "--partner-secondary": colors.secondary!,
      "--secondary": secondary,
      "--secondary-foreground": foreground(colors.secondary!).hsl,
      "--partner-secondary-foreground": foreground(colors.secondary!).hex,
      "--accent-foreground": foreground(colors.secondary!).hsl,
      "--services-foreground": foreground(colors.secondary!).hsl,
      "--partner-secondary-tint": tint(colors.secondary!, 0.09),
      "--accent": secondary,
      "--services": secondary,
      "--gradient-secondary": `linear-gradient(135deg, hsl(${secondary}), hsl(${secondary}))`,
    });
  }
  // Every partner uses the same neutral white surfaces, independent of identity.
  Object.assign(overrides, {
    "--background": "0 0% 100%",
    "--card": "0 0% 100%",
    "--popover": "0 0% 100%",
    "--foreground": "222 47% 11%",
    "--card-foreground": "222 47% 11%",
    "--popover-foreground": "222 47% 11%",
    "--muted-foreground": "215 25% 35%",
    "--muted": "214 32% 96%",
    "--border": "214 32% 91%",
    "--input": "214 32% 91%",
  });
  return overrides;
}
