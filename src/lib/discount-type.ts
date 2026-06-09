/**
 * Discount types aligned with backend GraphQL schema:
 * enum DiscountType { PERCENTAGE FIXED }
 */

/** Backend GraphQL `DiscountType` enum values. */
export type GraphQLDiscountType = "PERCENTAGE" | "FIXED";

export enum DiscountType {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}

/** Map API strings to schema enum (PERCENTAGE | FIXED). */
export function normalizeDiscountType(
  type: string | null | undefined
): DiscountType | null {
  if (!type) {
    return null;
  }
  const upper = type.toUpperCase();
  if (upper === DiscountType.PERCENTAGE) {
    return DiscountType.PERCENTAGE;
  }
  if (upper === DiscountType.FIXED) {
    return DiscountType.FIXED;
  }
  return null;
}

/** Ensure mutation input uses schema enum values only. */
export function toApiDiscountType(type: DiscountType): GraphQLDiscountType {
  return type === DiscountType.FIXED ? "FIXED" : "PERCENTAGE";
}

export function formatDiscountTypeLabel(type: string): string {
  const normalized = normalizeDiscountType(type);
  if (normalized === DiscountType.PERCENTAGE) {
    return "Percentage";
  }
  if (normalized === DiscountType.FIXED) {
    return "Fixed amount";
  }
  return type.replace(/_/g, " ");
}

export function formatDiscountAmount(type: string, value: number): string {
  const normalized = normalizeDiscountType(type);
  if (normalized === DiscountType.PERCENTAGE) {
    return `${value}%`;
  }
  if (normalized === DiscountType.FIXED) {
    return `$${value}`;
  }
  return String(value);
}

export function formatDiscountPromo(type: string, value: number): string {
  const normalized = normalizeDiscountType(type);
  if (normalized === DiscountType.PERCENTAGE) {
    return `${value}% OFF`;
  }
  if (normalized === DiscountType.FIXED) {
    return `$${value} OFF`;
  }
  return `${value} OFF`;
}

export interface DiscountDisplayFields {
  type?: string | null;
  value?: number | null;
  customText?: string | null;
  title?: string | null;
}

/** Store promo label — prefer customText when value is 0 (BOGO / copy-only). */
export function resolveDiscountDisplayText(
  options: DiscountDisplayFields
): string {
  const custom = options.customText?.trim();
  if (custom) {
    return custom;
  }

  const title = options.title?.trim();
  const value = options.value;
  const type = options.type;

  if (value != null && value > 0 && type) {
    return formatDiscountPromo(type, value);
  }

  if (title) {
    return title;
  }

  return "";
}

export interface CouponDisplayFields {
  value?: number | null;
  discount?: DiscountDisplayFields | null;
}

/**
 * Coupon card / QR label — never show user tier % (coupon.value) when the store
 * promo is copy-only (discount.value === 0) or has customText.
 */
export function resolveCouponDisplayLabel(coupon: CouponDisplayFields): string {
  const discount = coupon.discount;
  const custom = discount?.customText?.trim();
  const discountValue = discount?.value;
  const type = discount?.type;

  if (custom && (discountValue == null || discountValue === 0)) {
    return custom;
  }

  if (discountValue != null && discountValue > 0 && type) {
    return formatDiscountPromo(type, discountValue);
  }

  if (custom) {
    return custom;
  }

  const title = discount?.title?.trim();
  if (title) {
    return title;
  }

  return "Promoción Especial";
}
