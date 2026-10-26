# Partner review follow-up

Current follow-up base: PR121 commit `5cc6e281734f57d0e81a031cd22c8128e34a9780`.
The restored bar is provisional until Esteban chooses the final navigation.

## Revised behaviour

- Partner mode again has the two-tab Explore/My coupons bottom bar. Store pages
  keep Explore selected. No top navigation. This is the interim layout pending
  Esteban choosing bottom tabs or a small page-top switch.
- My coupons retains all, active and used filters. Layout and QR scroll content
  reserve room for the restored bar and the bottom safe area.
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
All brand colours come only from `partner.branding.colors`. No hardcoded USA
Transfers palette or slug checks remain. White surfaces apply to every partner;
foreground contrast is derived from the configured colours. The staging DB owner
will set the final palette and logo. The expired page has a neutral fallback.

Partner-only small labels now have a 14px minimum at the default root size and
inputs use 16px; the bottom-tab targets are at least 44px. Actual appearance inside
Rodrigo's APK remains unverified. See `partner-121-review.md` for pending evidence.

## Automated validation

Run `yarn type-check`, then:

```sh
node --test tools/partner-maps/*.test.mjs tools/partner-branding/*.test.mjs tools/partner-review/*.test.mjs tools/i18n/i18n.test.mjs tools/partner-reporting/reporting.test.mjs tools/partner-iframe/host.test.mjs
```

The review tests cover iframe/native/SSR detection, storage, dynamic-route
navigation, web Maps key selection, native-detection bypasses, two-tab partner navigation,
normal five-tab markup, top header presence, hydration, blocked Crisp installation,
profile deep-link routing and review query enablement. These are unit/server
markup tests, not a mobile browser or device run.

## Mobile observations and evidence limits

Source/layout changes remove the old header clearance on Explore, My coupons and
store detail; reserve restored bottom-navigation clearance; and reserve safe-area room
at the bottom of the QR scroll view. Automated component markup confirms the
restored two-tab navigation.

A mobile browser run could not be completed in this environment: no browser was
installed and the browser download failed. No iOS/Android visual, touch, keyboard,
permission, live SSO or host-container result is claimed. A React Native/USA
Transfers host test remains separate from Namy's Capacitor application.

## Device smoke checks before the full test

1. Run the frontend with local-only `FRAME_ANCESTORS="*"` and use the existing
   `tools/partner-iframe` host with a fresh code. Use approved frame origins on staging.
2. At 320/390/430 px portrait widths and landscape, verify no top menu or old
   header-sized gap, two bottom tabs, and no horizontal page overflow.
3. Open a store from Explore. Device/browser back returns
   to the listing. No ratings/review content, write button or review network query.
4. Use the My coupons tab; test all/active/used. Open a QR, scroll restrictions
   to the end, close it and return to Explore. No Crisp widget, script or help button.
5. Open `/profile` directly; confirm redirect to My coupons and no profile flash.
6. In the actual iframe on iOS and Android, inspect effective helpers: web/false.
   Verify web storage, real `/stores/<id>` URLs, web Maps key and browser location
   permission. The parent must delegate geolocation and permit it in its policy.
7. Repeat normal Namy as a separate session: five-tab navigation, profile,
   reviews and configured Crisp remain. Verify top-level Namy native back,
   keyboard, storage and push on both OSes before release.

Record device model, OS/container version and any failures. Do not merge until
another engineer has reviewed the stacked changes.
