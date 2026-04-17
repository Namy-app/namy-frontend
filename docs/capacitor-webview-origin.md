# Why the app URL is `capacitor://localhost/...`

## What you are seeing

In the iOS (or Android) shell, the WebView’s **document URL** is often:

`capacitor://localhost/restaurants/`  
(or similar paths under `capacitor://localhost`)

So network requests, **`document.location`**, and sometimes **Referer** metadata are tied to that origin—not `https://yourdomain.com` or `http://localhost:3000`.

## Why Capacitor does this

Capacitor serves your built web assets from the native app. On **iOS**, WKWebView must use a **custom URL scheme** for that content; it **cannot** use `http://` or `https://` for this internal app origin (see Capacitor `server.iosScheme` — default **`capacitor`**, with host **`localhost`** from `server.hostname`).

So the “site” your JS thinks it runs on is **`capacitor://localhost`**, plus whatever path Next exported (e.g. `/restaurants/`).

## Google Maps API keys

- A key restricted only with **HTTP referrers** (website) expects origins like `https://example.com`. It will **not** match `capacitor://localhost`.
- For the **native app**, create or use a key (or restriction) for **iOS apps** with bundle ID **`com.namyapp`**, and enable **Maps JavaScript API** (and billing as required). That path does not rely on the `capacitor://` string matching a referrer allowlist.

Use **`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_IOS`** (or your legacy key) for that iOS-restricted key in builds that run inside Capacitor.

## When the origin is `http://localhost:3000` instead

If you use **live reload** (`yarn mobile:ios:live` / `npx cap run ios -l ...`), the WebView loads your **dev server** URL. Then the page origin is **`http://localhost:3000`**, and referrer-style restrictions for local dev can apply to that key.

## Summary

| Mode                                                        | Typical page origin         |
| ----------------------------------------------------------- | --------------------------- |
| Static export in native app (`yarn mobile:ios` / Xcode Run) | `capacitor://localhost/...` |
| Live reload against Next dev                                | `http://localhost:3000/...` |
| PWA / browser                                               | `https://...`               |

`capacitor://localhost` for the bundled app is **normal**, not a misconfiguration — **including production** builds installed from TestFlight or the App Store. Only live-reload dev uses `http://localhost:3000` instead.
