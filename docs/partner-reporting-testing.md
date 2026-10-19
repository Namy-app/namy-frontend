# Partner reporting and analytics

Deploy the companion backend change before this frontend. The new admin query
requires `adminCouponPartners`, `Coupon.partnerId`, `Coupon.partner`, and
`CouponFiltersInput.partnerId` / `partnerOnly`. No database migration is needed.

## Admin acceptance

1. Generate and redeem one coupon in a normal Namy session and another in a
   USA Transfers session. Use separate browser profiles to avoid switching sessions.
2. As admin, open `/admin/redemptions`. Confirm each row's source is Namy or
   USA Transfers according to the coupon's stored attribution.
3. Apply Namy, all partners, and USA Transfers filters. Combine each with a
   redemption date range. Confirm the total and every page respect both filters.
   Applying or clearing filters must return to page 1.
4. Inactive partners remain available for historical filtering. Missing partner
   metadata displays `Origen desconocido`, rather than guessing Namy.
5. Try the reporting query as a regular authenticated user and while logged out:
   both reporting entry points must be rejected by the backend guards.
6. Download the existing Excel billing report for the same period. Verify its
   existing USA Transfers redemption count against the admin results. This patch
   does not change export calculations or the existing active-partner columns.

## PostHog acceptance

Existing events retain the shared `partner` property from PR1. Four additional
journey events are emitted only when a partner exists in the session store:

| Event                      | Trigger                                             |
| -------------------------- | --------------------------------------------------- |
| `partner_session_started`  | Successful one-time code exchange and session setup |
| `partner_reauth_requested` | Reload button asks the parent app for a new code    |
| `partner_coupon_generated` | Successful direct coupon generation on store detail |
| `partner_coupon_qr_viewed` | User opens a coupon QR from My coupons              |

Properties include `partner_slug`, `lang`, and applicable coupon/store/discount
IDs. Never add login codes, access tokens, partner keys, staff PINs, or email.
Check live ingestion in PostHog after deployment; unit tests do not establish
live delivery. Journey events describe the current session. Coupon attribution
in the database is the reporting and billing source of truth, including when
connected accounts use both normal Namy and partner sessions.

Repeat generation and QR viewing in a normal Namy session: existing events
should remain and no `partner_*` journey events should be emitted.

## Automated checks

Frontend: `yarn type-check` and
`node --test tools/partner-reporting/reporting.test.mjs tools/i18n/i18n.test.mjs tools/partner-iframe/host.test.mjs`.
Backend: `yarn typecheck` and
`yarn jest src/domains/coupon/coupon-reporting.spec.ts src/domains/export/export.service.spec.ts --runInBand`.

Physical iOS/Android iframe testing, production assets, and live analytics/export
verification remain acceptance steps. This patch does not provide a native PoC.
