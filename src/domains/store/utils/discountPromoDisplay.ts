import type { Discount } from "@/domains/admin";
import {
  formatDiscountPromo,
  normalizeDiscountType,
  DiscountType,
} from "@/lib/discount-type";

import { assignPromoAccents, type PromoAccent } from "./promoAccentPalette";

export type { PromoAccent } from "./promoAccentPalette";
export { assignPromoAccents, PROMO_ACCENT_THEMES } from "./promoAccentPalette";

export type PromoDisplayMode = "banner" | "text";

const ALL_DAY_INDICES = [0, 1, 2, 3, 4, 5, 6] as const;

const MON_FRI_INDICES = [0, 1, 2, 3, 4] as const;
const WEEKEND_INDICES = [5, 6] as const;

/** Full day name, lowercase (e.g. "viernes"). */
const DAY_NAME_LOWER: Record<number, string> = {
  0: "lunes",
  1: "martes",
  2: "miércoles",
  3: "jueves",
  4: "viernes",
  5: "sábado",
  6: "domingo",
};

/** Short abbrev, title case for ranges (e.g. "Lun"). */
const DAY_ABBREV_TITLE: Record<number, string> = {
  0: "Lun",
  1: "Mar",
  2: "Mié",
  3: "Jue",
  4: "Vie",
  5: "Sáb",
  6: "Dom",
};

/** Short abbrev, lowercase for "Excepto mar y mié". */
const DAY_ABBREV_LOWER: Record<number, string> = {
  0: "lun",
  1: "mar",
  2: "mié",
  3: "jue",
  4: "vie",
  5: "sáb",
  6: "dom",
};

const MAX_EXCEPTO_DAYS = 3;

function resolveScheduleDaySets(discount: Discount): {
  available: number[];
  unavailable: number[];
} {
  let available =
    discount.availableDaysAndTimes?.availableDays?.map((d) => d.dayIndex) ?? [];

  if (available.length === 0 && discount.excludedDaysOfWeek?.length) {
    const excluded = new Set(discount.excludedDaysOfWeek);
    available = ALL_DAY_INDICES.filter((d) => !excluded.has(d));
  }

  if (available.length === 0) {
    available = [...ALL_DAY_INDICES];
  }

  const availableSet = new Set(available);
  const unavailable = ALL_DAY_INDICES.filter((d) => !availableSet.has(d));

  return {
    available: [...new Set(available)].sort((a, b) => a - b),
    unavailable: [...unavailable].sort((a, b) => a - b),
  };
}

function isSameDaySet(a: readonly number[], b: readonly number[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((day, index) => day === b[index]);
}

function isConsecutiveDays(days: number[]): boolean {
  if (days.length < 2) {
    return false;
  }
  for (let i = 1; i < days.length; i++) {
    if (days[i]! - days[i - 1]! !== 1) {
      return false;
    }
  }
  return true;
}

function formatExceptoBadge(unavailable: number[]): string {
  if (unavailable.length === 1) {
    const name = DAY_NAME_LOWER[unavailable[0]!];
    return name ? `Excepto ${name}` : "Horario limitado";
  }

  const abbrevs = unavailable
    .map((d) => DAY_ABBREV_LOWER[d])
    .filter((label): label is string => Boolean(label));

  if (abbrevs.length === 0) {
    return "Horario limitado";
  }

  if (abbrevs.length === 2) {
    return `Excepto ${abbrevs[0]} y ${abbrevs[1]}`;
  }

  const last = abbrevs[abbrevs.length - 1]!;
  const rest = abbrevs.slice(0, -1);
  return `Excepto ${rest.join(", ")} y ${last}`;
}

/**
 * Schedule badge for promo cards.
 *
 * | Scenario        | Badge              |
 * |-----------------|--------------------|
 * | Every day       | Todos los días     |
 * | Mon–Fri         | Lun–Vie            |
 * | Weekend         | Fin de semana      |
 * | Only Friday     | Solo viernes       |
 * | Except Tuesday  | Excepto martes     |
 * | Except Tue+Wed  | Excepto mar y mié  |
 */
export function formatDiscountScheduleBadge(discount: Discount): string {
  const { available, unavailable } = resolveScheduleDaySets(discount);

  if (unavailable.length === 0) {
    return "Todos los días";
  }

  if (isSameDaySet(available, MON_FRI_INDICES)) {
    return "Lun–Vie";
  }

  if (isSameDaySet(available, WEEKEND_INDICES)) {
    return "Fin de semana";
  }

  if (available.length === 1) {
    const day = DAY_NAME_LOWER[available[0]!];
    return day ? `Solo ${day}` : "Horario limitado";
  }

  if (unavailable.length <= MAX_EXCEPTO_DAYS) {
    return formatExceptoBadge(unavailable);
  }

  if (isConsecutiveDays(available) && available.length >= 2) {
    const start = DAY_ABBREV_TITLE[available[0]!];
    const end = DAY_ABBREV_TITLE[available[available.length - 1]!];
    if (start && end) {
      return `${start}–${end}`;
    }
  }

  const labels = available
    .map((d) => DAY_ABBREV_TITLE[d])
    .filter((label): label is string => Boolean(label))
    .slice(0, MAX_EXCEPTO_DAYS);

  return labels.length > 0 ? labels.join(" · ") : "Horario limitado";
}

function splitStubLabels(
  discount: Discount,
  promoLabel: string
): { primary: string; secondary?: string } {
  const type = normalizeDiscountType(discount.type);

  if (type === DiscountType.PERCENTAGE && discount.value > 0) {
    return { primary: `${discount.value}%`, secondary: "OFF" };
  }

  if (type === DiscountType.FIXED && discount.value > 0) {
    return { primary: `$${discount.value}`, secondary: "OFF" };
  }

  const custom = discount.customText?.trim();
  if (custom) {
    const words = custom.split(/\s+/);
    if (words.length === 1) {
      return { primary: words[0]! };
    }
    return {
      primary: words[0]!,
      secondary: words.slice(1).join(" "),
    };
  }

  const promo = promoLabel.trim();
  if (/^\d+%\s*OFF$/i.test(promo)) {
    const match = promo.match(/^(\d+)%/);
    return { primary: `${match?.[1]}%`, secondary: "OFF" };
  }

  if (promo.length <= 12) {
    return { primary: promo };
  }

  return {
    primary: promo.slice(0, 10).trim(),
    secondary: promo.length > 10 ? promo.slice(10).trim() : undefined,
  };
}

export type DiscountPromoSlide = {
  id: string;
  mode: PromoDisplayMode;
  accent: PromoAccent;
  imageUrl?: string | null;
  scheduleBadge: string;
  stubPrimary: string;
  stubSecondary?: string;
  title: string;
  headline: string;
  description?: string;
};

/** Banner = full image only (no overlay text). Text = ticket card + custom label. */
export function inferDiscountPromoDisplayMode(discount: {
  imageUrl?: string | null;
  customText?: string | null;
}): PromoDisplayMode {
  if (discount.imageUrl?.trim() && !discount.customText?.trim()) {
    return "banner";
  }
  return "text";
}

export function buildPromoSlidePayload(
  mode: PromoDisplayMode,
  imageUrl: string,
  customText: string
): { imageUrl?: string; customText?: string } {
  const trimmedImage = imageUrl.trim();
  const trimmedText = customText.trim();

  if (mode === "banner") {
    return {
      imageUrl: trimmedImage || undefined,
      customText: "",
    };
  }

  return {
    imageUrl: trimmedImage || undefined,
    customText: trimmedText || undefined,
  };
}

export function buildPromoSlidesFromDiscounts(
  discounts: Discount[],
  getLabel: (d: Discount) => string
): DiscountPromoSlide[] {
  const accents = assignPromoAccents(discounts.length);
  return discounts.map((discount, index) =>
    buildPromoSlideFromDiscount(discount, getLabel, accents[index])
  );
}

export function buildPromoSlideFromDiscount(
  discount: Discount,
  getLabel: (d: Discount) => string,
  accent: PromoAccent = "orange"
): DiscountPromoSlide {
  const mode = inferDiscountPromoDisplayMode(discount);
  const scheduleBadge = formatDiscountScheduleBadge(discount);
  const promoLabel = getLabel(discount);
  const stub = splitStubLabels(discount, promoLabel);

  if (mode === "banner") {
    return {
      id: discount.id,
      mode: "banner",
      accent,
      imageUrl: discount.imageUrl,
      scheduleBadge,
      stubPrimary: stub.primary,
      stubSecondary: stub.secondary,
      title: discount.title,
      headline: discount.title,
      description: discount.description,
    };
  }

  const headline =
    discount.customText?.trim() ||
    (discount.value > 0
      ? formatDiscountPromo(discount.type, discount.value)
      : promoLabel);

  return {
    id: discount.id,
    mode: "text",
    accent,
    imageUrl: discount.imageUrl,
    scheduleBadge,
    stubPrimary: stub.primary,
    stubSecondary: stub.secondary,
    title: discount.title,
    headline,
    description:
      discount.description ||
      (discount.customText?.trim() && discount.title
        ? discount.title
        : undefined),
  };
}

export function buildFallbackPromoSlide(
  percentage: number
): DiscountPromoSlide {
  return {
    id: "fallback-tier",
    mode: "text",
    accent: "orange",
    scheduleBadge: "Todos los días",
    stubPrimary: `${percentage}%`,
    stubSecondary: "OFF",
    title: "Descuento Ñamy",
    headline: `${percentage}% de descuento con Ñamy`,
    description: "Desbloquea cuando haya promociones activas en esta tienda",
  };
}
