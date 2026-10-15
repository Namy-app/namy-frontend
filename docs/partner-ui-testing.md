# Partner UI: PR 1 validation

This PR changes the Namy web frontend. The iframe host is separate from Namy mobile and from the frontend's production routes. It does not implement USA Transfers' server-to-server authentication.

## Local iframe host

1. Start the frontend against the staging backend using your existing environment configuration: `FRAME_ANCESTORS="*" npm run dev`. Wildcard framing is local only; deployed environments need approved parent origins.
2. In another terminal, serve the host: `python3 -m http.server 3001 --bind 127.0.0.1 --directory tools/partner-iframe`.
3. Open `http://localhost:3001`. Enter the frontend URL, language and a fresh code supplied by Vinay. Submit within 60 seconds.
4. The host delegates geolocation via `allow="geolocation"`. Browser permission, HTTPS outside localhost, and any parent Permissions-Policy must also permit it.
5. When the embedded expired-session screen sends `namy:reauth`, the host accepts messages only from that frame and its configured origin. Supply a new code to return to the requested path. The real USA Transfers host must obtain its code through its backend automatically.

## Acceptance checks

- Login: successful exchange, code removed from child URL, explore/coupons/store links load directly. Expired and reused codes fail; Reload reaches the host.
- Branding: partner name fallback until a real logo is configured; configured colours on header, explore cards, listing, store details and coupon/QR screens. Normal Namy retains its colours and logo.
- Navigation: no bottom nav or premium, level, league, wallet, referrals, logout, onboarding or notification promotions. Direct excluded routes return to explore. Profile offers active/used coupons.
- Coupon: ad-free partner sessions call `generateCoupon` without requesting video ads. No AdSense load on partner entry/reload. Verify actual returned coupon value, QR, animation, active/used filters and redemption. Fixed/zero-value and premium offers currently follow backend exceptions; clarify the blanket 15% requirement with Vinay.
- QR: Powered by Nami with logo, staff hint, working Crisp help when its environment variable is configured.
- Content: restaurants and services, search, store detail, location granted/denied, map and reviews. Mural upload absent when false and available when true.
- Analytics: existing tracked events carry the current partner slug, or null in normal mode; direct generation uses method `partner`.
- Regression: normal Namy login, bottom nav, premium ad bypass, free-user ad unlock, profile and referrals unchanged.

## Evidence still required

Real staging SSO/redemption and iframe runtime checks need a fresh test code and configured backend. iOS/Android host regression needs actual device/simulator access; record model, OS and browser/container per result. Final USA Transfers assets are pending. English/Spanish dictionaries are PR 2; admin source/filter and custom partner events are PR 3.

Local TypeScript checks pass. Existing hook lint findings in my-coupons and store detail are also present on develop. Production compilation succeeded, but complete build verification was blocked by automatic review over Sentry network disclosure; no complete production build is claimed.
