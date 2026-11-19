import type { CouponFiltersInput } from "./types";

export interface ReportingPartner {
  id: string;
  name: string;
  slug: string;
  active: boolean;
}

export function buildRedemptionFilters(
  from: string,
  to: string,
  source: string
): CouponFiltersInput {
  return {
    used: true,
    includeExpired: true,
    ...(from ? { usedAtFrom: `${from}T00:00:00` } : {}),
    ...(to ? { usedAtTo: `${to}T23:59:59.999` } : {}),
    ...(source === "namy" ? { partnerOnly: false } : {}),
    ...(source === "partners" ? { partnerOnly: true } : {}),
    ...(!["all", "namy", "partners"].includes(source)
      ? { partnerId: source }
      : {}),
  };
}

/** Attribution belongs to the coupon, not the user's current partner session. */
export function redemptionSourceLabel(coupon: {
  partnerId?: string | null;
  partner?: ReportingPartner | null;
}): string {
  if (coupon.partnerId === null) {
    return "Namy";
  }
  return coupon.partner?.name || "Origen desconocido";
}
