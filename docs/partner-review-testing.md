# Partner review follow-up

Base: frontend PR118 commit `71bf5791391cac0bd2c6165476c586c0459f8239`.
No earlier PR needs to be merged to apply or review this change.

## Revised behaviour

- Partner mode has no top or bottom navigation. Explore, My coupons and store
  detail remain directly accessible by URL. This supersedes the two-tab review request.
- My coupons retains all, active and used filters. Extra bottom-tab clearance
  is removed; QR content retains safe-area spacing.
- Partner profile is removed. Direct profile links redirect to My coupons;
  normal profile content is not mounted while partner storage hydrates.
- Crisp's partner button is removed and the provider does not install its script
  in partner mode, on partner entry, or before partner storage hydration completes.
- Partner store reviews, write/detail modals, and rating previews are hidden;
  review queries are disabled. Normal Namy keeps those features.
- `app-platform.ts` is the only app module calling Capacitor's raw detection
  methods. In an iframe (including a parent access exception), effective platform
  is web and effective native status is false. Storage, Maps key selection,
  navigation, analytics, back/keyboard listeners, push, downloads and payments
  use these helpers. Top-level native Namy still uses Capacitor's result.

This establishes intended app behaviour if a native bridge is present in a
frame; it does not establish how the actual USA Transfers host injects its bridge.
USA Transfers colours are now confirmed: primary `#03378D`, secondary `#FF4E18`.
The frontend theme overrides the old USA Transfers placeholder colours; other
partners retain their own config. Final icons/logo remain pending. There is no
replacement logo header.

## Automated validation

Run `yarn type-check`, then:

```sh
node --test tools/partner-branding/*.test.mjs tools/partner-review/*.test.mjs tools/i18n/i18n.test.mjs tools/partner-reporting/reporting.test.mjs tools/partner-iframe/host.test.mjs
```

The review tests cover iframe/native/SSR detection, storage, dynamic-route
navigation, web Maps key selection, native-detection bypasses, hidden partner navigation,
normal five-tab markup, top header presence, hydration, blocked Crisp installation,
profile deep-link routing and review query enablement. These are unit/server
markup tests, not a mobile browser or device run.

## Mobile observations and evidence limits

Source/layout changes remove the old header clearance on Explore, My coupons and
store detail; remove unused bottom-navigation clearance; and reserve safe-area room
at the bottom of the QR scroll view. Automated component markup confirms the
absence of partner navigation.

A mobile browser run could not be completed in this environment: no browser was
installed and the browser download failed. No iOS/Android visual, touch, keyboard,
permission, live SSO or host-container result is claimed. A React Native/USA
Transfers host test remains separate from Namy's Capacitor application.

## Device smoke checks before the full test

1. Run the frontend with local-only `FRAME_ANCESTORS="*"` and use the existing
   `tools/partner-iframe` host with a fresh code. Use approved frame origins on staging.
2. At 320/390/430 px portrait widths and landscape, verify no top menu or old
   header-sized gap, no bottom navigation, and no horizontal page overflow.
3. Open a store from Explore. Device/browser back returns
   to the listing. No ratings/review content, write button or review network query.
4. Open `/my-coupons` directly; test all/active/used. Open a QR, scroll restrictions
   to the end and close it. No Crisp widget, script or help button.
5. Open `/profile` directly; confirm redirect to My coupons and no profile flash.
6. In the actual iframe on iOS and Android, inspect effective helpers: web/false.
   Verify web storage, real `/stores/<id>` URLs, web Maps key and browser location
   permission. The parent must delegate geolocation and permit it in its policy.
7. Repeat normal Namy as a separate session: five-tab navigation, profile,
   reviews and configured Crisp remain. Verify top-level Namy native back,
   keyboard, storage and push on both OSes before release.

Record device model, OS/container version and any failures. Do not merge until
another engineer has reviewed the stacked changes.
