/**
 * Partner (white-label) mode.
 *
 * A partner session starts at `/partner?code=...`. The one-time code is
 * exchanged for a 24h access token and a PartnerConfig:
 * `{ slug, name, discountLevel, adsDisabled, features, branding }`.
 * `features` is JSON (e.g. `{ mural, leaderboard, challenges }`).
 * `branding` is JSON (e.g. `{ logoUrl, colors: { primary, secondary } }`).
 *
 * While partner mode is active, `/auth` is blocked and the user is sent to
 * `/partner/expired`. Use `useIsPartnerMode()` from `@/store/usePartnerStore`
 * to hide or show UI for a partner session.
 */

import { usePartnerStore, type PartnerConfig } from "@/store/usePartnerStore";

export function isPartnerMode(): boolean {
  return usePartnerStore.getState().partner != null;
}

export function getPartnerConfig(): PartnerConfig | null {
  return usePartnerStore.getState().partner;
}

export { isInIframe } from "@/lib/app-platform";
