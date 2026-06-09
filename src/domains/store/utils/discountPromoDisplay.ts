import type { Discount } from "@/domains/admin";

export type PromoDisplayMode = "banner" | "text";

/** Banner = full image only (no overlay text). Text = gradient + custom label. */
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

export function buildPromoSlideFromDiscount(
  discount: Discount,
  getLabel: (d: Discount) => string
): {
  id: string;
  mode: PromoDisplayMode;
  imageUrl?: string | null;
  headline?: string;
  subline?: string;
} {
  const mode = inferDiscountPromoDisplayMode(discount);

  if (mode === "banner") {
    return {
      id: discount.id,
      mode: "banner",
      imageUrl: discount.imageUrl,
    };
  }

  return {
    id: discount.id,
    mode: "text",
    imageUrl: discount.imageUrl,
    headline: `🎉 ${getLabel(discount)}`,
    subline: "con Ñamy",
  };
}
