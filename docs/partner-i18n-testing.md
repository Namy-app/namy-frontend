# Partner English/Spanish (PR 2)

Base: PR #116 commit 49f9d11022b58ea4be49648e0a54ff1ab7d3834e.

## Implementation

- i18next and react-i18next with bundled en/es dictionaries. `useAppTranslation()` reads the partner store's language. Each language has an immutable instance to avoid changing another SSR request's language.
- Normal sessions use the existing Namy copy through a separate namespace, even when a previous partner language remains in storage.
- Labels/messages translated on Explore, restaurants/services, search/filter/listing, store detail/reviews, coupon cards, coupon/QR/restrictions, partner profile, header and expired-session screen.
- Coupon plurals, injected coupon codes, dates and schedule badges use the selected language. The document language updates after hydration.
- Store-provided content and backend-generated messages remain as supplied. A translated UI does not translate store names, descriptions, custom promotions, catalog data or backend availability text.

## Local checks

```bash
yarn install
yarn type-check
node --test tools/i18n/i18n.test.mjs
node --test tools/partner-iframe/host.test.mjs
```

Six translation tests cover independent instances, rendering both partner languages, normal-mode wording, plurals/interpolation, key coverage and schedule badges. The three existing host tests also pass. Existing hook lint findings in my-coupons/store detail remain; no new lint findings are expected. No full production build or browser/device language verification is claimed for this patch.

## Iframe checks

Start the host as described in partner-ui-testing.md. Obtain a fresh code, choose English, and check Explore → restaurants/services → search/filter/map → store detail → unlock → My coupons → QR/restrictions → profile. Verify Spanish on a fresh entry with lang=es. Codes are single use and expire after 60 seconds.

Check weekday labels and actual opening hours together, singular/plural coupon counts, messages after generation/redemption, and expired-session Reload. Repeat in a fresh normal session to confirm original branding and wording. Store-entered text may remain Spanish in the English UI by design.

If PR #116 is not merged, open this as a stacked PR against feat/usa-transfers-partner-ui. After PR #116 merges, retarget this PR to develop.
