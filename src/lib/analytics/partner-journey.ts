export type PartnerJourneyAction =
  | "session_started"
  | "reauth_requested"
  | "coupon_generated"
  | "coupon_qr_viewed";
export interface PartnerJourneyContext {
  partner: { slug: string } | null;
  lang: "en" | "es";
}
export interface PartnerJourneyIds {
  coupon_id?: string;
  store_id?: string;
  discount_id?: string;
}
export interface PartnerJourneyProperties extends PartnerJourneyIds {
  partner_slug: string;
  lang: "en" | "es";
}

/** Allowlisted properties only: never include login codes, tokens, PINs or email. */
export function buildPartnerJourneyEvent(
  action: PartnerJourneyAction,
  context: PartnerJourneyContext,
  ids: PartnerJourneyIds = {}
) {
  if (!context.partner) {
    return null;
  }
  return {
    name: `partner_${action}` as `partner_${PartnerJourneyAction}`,
    properties: {
      partner_slug: context.partner.slug,
      lang: context.lang,
      ...(ids.coupon_id ? { coupon_id: ids.coupon_id } : {}),
      ...(ids.store_id ? { store_id: ids.store_id } : {}),
      ...(ids.discount_id ? { discount_id: ids.discount_id } : {}),
    } satisfies PartnerJourneyProperties,
  };
}
