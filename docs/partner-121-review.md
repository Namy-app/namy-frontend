# PR121 review follow-up — prepared, not final

Base: PR121 head `5cc6e281734f57d0e81a031cd22c8128e34a9780`.

## Implemented locally

- Brand colours come only from partner.branding.colors. No named USA palette,
  no slug checks. White surfaces/neutral text apply to every partner. Text contrast
  uses configured colours; leaving partner mode restores prior tokens/attributes.
- Expired-session button has a neutral default, not a partner-specific hex.
- Restore Explore/My coupons bottom tabs, store selection state and safe-area
  spacing. This restores usability while Esteban chooses the final navigation.
- Tabs have 44px minimum touch targets. Partner-only small labels have a 14px
  minimum at the default root size, inputs use 16px and text autosizing is stable.
  This is a code adjustment, not an APK visual sign-off.
- One root Google Maps loader serves maps and Places. Previously LoadScript and
  useJsApiLoader both loaded Maps with different library options. This was a
  code-level loading hazard; it is NOT a confirmed APK root cause.
- Non-map pages stay usable during failed/missing Maps loading. Map views show
  an error rather than mounting before the API is ready. Address input remains
  usable manually while Places is unavailable.
- Maps render with a store/city fallback without waiting for GPS. Missing GPS
  does not paint a fake user marker. Zero-coordinate stores are valid.
- Embedded sessions retain the web Maps key path. Diagnostic logs show runtime,
  key source and whether a key exists without printing the key.

## Evidence gathered

- Public staging root returned HTTP 200. Initial public JavaScript chunks contain
  an injected legacy NEXT_PUBLIC_GOOGLE_MAPS_API_KEY. A dedicated web-key literal
  was not established from the initial chunks; lazy loading makes that
  inconclusive. Neither Vercel dashboard settings nor Cloud restrictions were verified.
- Unit/component tests cover DB-only theming, tab navigation, Maps loading/error
  states, missing location and fallback rendering. These are not real Google
  tile/network or location-permission tests.
- No Rodrigo APK was available in the workspace or found in the file search.
  No adb/Android emulator is available here. No chrome://inspect session occurred.
- Messaging lookup was unavailable because the mail connection was disconnected;
  Esteban's identity/channel is not resolved. No message was sent.

## Required before final PR121 update

1. Obtain Rodrigo's APK, a device/emulator with USB debugging and a fresh test code.
2. Open chrome://inspect/#devices, inspect the USA Transfers WebView, then select
   the Namy iframe execution context. If the WebView is absent, ask Rodrigo for
   a debug-enabled APK; web code cannot enable remote WebView debugging.
3. Record the actual frame URL/origin, viewport width/devicePixelRatio and console
   Maps errors. Confirm only one Maps API script request. Redact codes/tokens/keys.
4. In Vercel staging confirm NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_WEB and rebuild after
   changes to NEXT_PUBLIC variables. In Google Cloud confirm website referrers
   include https://namy-frontend.vercel.app/*, Maps JavaScript API is enabled and
   billing is active. Do not substitute native bundle restrictions for the iframe's
   HTTPS page. Inspect the actual Referer header if restrictions still fail.
5. Repeat with browser location allowed and denied. Both must load tiles and
   stores. Denied means no user marker. Permission failure is separate from
   Maps authentication failure. Check the list/Explore/coupons still work if
   Maps key/script loading fails.
6. Ask Rodrigo to confirm iframe allow="geolocation", no blocking ancestor
   Permissions-Policy/sandbox, HTTPS, and Android host location permission /
   WebView geolocation prompt handling. These are host settings, not a web-only fix.
7. Capture the standalone mobile web view and the same screens inside the APK.
   Compare text at equal viewport sizes (no pinch zoom). Record computed font size
   and viewport scale; ask Rodrigo to confirm a device-width host viewport if the
   iframe is scaled down. Do not label mockups as APK screenshots.
8. Send Esteban the actual paired screenshots and alternatives: (a) the restored
   two-tab bottom bar fitted to their app, or (b) a compact page-top Explore/My
   coupons switch. Ask him to choose or supply desired section screens.
9. Apply his choice, repeat the device checks, then update existing PR121 and its
   title/body. Do not create a competing final PR or claim his choice is known.

## Primary reference

https://developers.google.com/maps/documentation/javascript/error-messages
https://developers.google.com/maps/api-security-best-practices

## Local checks

```sh
yarn type-check
node --test tools/partner-maps/*.test.mjs tools/partner-branding/*.test.mjs tools/partner-review/*.test.mjs tools/i18n/i18n.test.mjs tools/partner-reporting/reporting.test.mjs tools/partner-iframe/host.test.mjs
```
