/** Promo ticket accent ids — order is the rotation pool (6 distinct hues). */
export type PromoAccent =
  | "orange"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "gold";

export type PromoAccentTheme = {
  stub: string;
  panel: string;
  scallop: string;
  badge: string;
  accentText: string;
  dot: string;
  unlockBtn: string;
};

/** Inspired by prod ticket cards — stub gradient + matching pale panel tint. */
export const PROMO_ACCENT_ORDER: PromoAccent[] = [
  "orange",
  "green",
  "blue",
  "purple",
  "pink",
  "gold",
];

export const PROMO_ACCENT_THEMES: Record<PromoAccent, PromoAccentTheme> = {
  orange: {
    stub: "bg-linear-to-b from-orange-500 via-orange-400 to-amber-300",
    panel: "bg-orange-50",
    scallop: "bg-orange-50",
    badge: "bg-orange-200/70 text-orange-900",
    accentText: "text-orange-600",
    dot: "bg-orange-500",
    unlockBtn: "bg-orange-500 hover:bg-orange-600 text-white",
  },
  green: {
    stub: "bg-linear-to-b from-emerald-500 via-green-500 to-lime-400",
    panel: "bg-emerald-50",
    scallop: "bg-emerald-50",
    badge: "bg-emerald-200/70 text-emerald-900",
    accentText: "text-emerald-600",
    dot: "bg-emerald-500",
    unlockBtn: "bg-emerald-500 hover:bg-emerald-600 text-white",
  },
  blue: {
    stub: "bg-linear-to-b from-sky-500 via-blue-500 to-indigo-400",
    panel: "bg-sky-50",
    scallop: "bg-sky-50",
    badge: "bg-sky-200/70 text-sky-900",
    accentText: "text-blue-600",
    dot: "bg-blue-500",
    unlockBtn: "bg-blue-500 hover:bg-blue-600 text-white",
  },
  purple: {
    stub: "bg-linear-to-b from-violet-600 via-purple-500 to-fuchsia-500",
    panel: "bg-violet-50",
    scallop: "bg-violet-50",
    badge: "bg-violet-200/70 text-violet-900",
    accentText: "text-purple-600",
    dot: "bg-purple-600",
    unlockBtn: "bg-purple-600 hover:bg-purple-700 text-white",
  },
  pink: {
    stub: "bg-linear-to-b from-rose-500 via-pink-500 to-red-400",
    panel: "bg-rose-50",
    scallop: "bg-rose-50",
    badge: "bg-rose-200/70 text-rose-900",
    accentText: "text-rose-600",
    dot: "bg-rose-500",
    unlockBtn: "bg-rose-500 hover:bg-rose-600 text-white",
  },
  gold: {
    stub: "bg-linear-to-b from-amber-500 via-yellow-500 to-orange-300",
    panel: "bg-amber-50",
    scallop: "bg-amber-50",
    badge: "bg-amber-200/80 text-amber-950",
    accentText: "text-amber-700",
    dot: "bg-amber-500",
    unlockBtn: "bg-amber-500 hover:bg-amber-600 text-white",
  },
};

/** Assign accents so no two neighboring slides share the same color. */
export function assignPromoAccents(slideCount: number): PromoAccent[] {
  if (slideCount <= 0) {
    return [];
  }

  const accents: PromoAccent[] = [];
  let poolIndex = 0;

  for (let i = 0; i < slideCount; i++) {
    let picked: PromoAccent | null = null;

    for (let attempt = 0; attempt < PROMO_ACCENT_ORDER.length; attempt++) {
      const candidate =
        PROMO_ACCENT_ORDER[(poolIndex + attempt) % PROMO_ACCENT_ORDER.length]!;
      if (i === 0 || candidate !== accents[i - 1]) {
        picked = candidate;
        poolIndex = (poolIndex + attempt + 1) % PROMO_ACCENT_ORDER.length;
        break;
      }
    }

    accents.push(picked ?? PROMO_ACCENT_ORDER[i % PROMO_ACCENT_ORDER.length]!);
  }

  return accents;
}

export function getPromoAccentTheme(accent: PromoAccent): PromoAccentTheme {
  return PROMO_ACCENT_THEMES[accent];
}
