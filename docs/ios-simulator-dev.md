# iOS Simulator: “dev mode”, console logs, and live reload

## Why the Xcode Run button feels like production

When you **build** with `yarn mobile:build:ios` and **Run** in Xcode, the app loads the **static export** from `out/` (from `MOBILE_BUILD=true next build`). That bundle is always built with **`NODE_ENV=production`**, so:

- `next dev` behaviors (fast refresh, `NODE_ENV === "development"`) **do not** apply
- Client logging that is gated on `development` will not run unless you use `NEXT_PUBLIC_DEBUG_GOOGLE_MAPS` or similar

That is expected: the Simulator is running the **same shipped web assets** as a release build, not the Next dev server.

## Use the Next dev server from the Simulator (recommended)

This loads the app from **`http://localhost:3000`** (your `next dev` process). Then **`NODE_ENV` is `development`** and normal dev logging works.

### One command (starts dev server + iOS live reload)

From `namy-frontend`:

```bash
yarn mobile:ios:dev
```

This uses **`npx concurrently`** and **`npx wait-on`** (no extra install): it starts **`next dev`**, waits until **port 3000** is open, then runs **`npx cap run ios -l --host localhost --port 3000`**. The Simulator WebView loads the dev server, not the static `out/` export.

Press **Ctrl+C** once to stop both processes (`-k` kills the other pane).

### Two terminals (same result, manual)

1. **Terminal 1:** `yarn dev` (leave running; default `http://localhost:3000`).
2. **Terminal 2:** `yarn mobile:ios:live` — runs `npx cap run ios -l --host localhost --port 3000`: syncs, builds, installs the iOS app, and points the WebView at the dev server instead of `out/`.

Use **Simulator** (or a device on the same machine). The iOS Simulator shares the Mac’s network, so **`localhost` reaches your Mac’s port 3000**.

### 3) See JavaScript logs

- **Safari** → **Develop** → **Simulator** → your app → **Console**
- Or Xcode → **Debug** workflow if you attach to the process (WebView logs still show most clearly in Safari)

## If `localhost` does not connect

- Confirm `yarn dev` is listening on **3000** (or change `--port` to match).
- Try `--host 127.0.0.1` instead of `localhost`.
- For a **physical device**, use your Mac’s LAN IP, e.g. `--host 192.168.1.x`, and run `next dev -H 0.0.0.0` so Next accepts non-localhost connections.

## Xcode-only alternative (not ideal)

You can temporarily set `server.url` in `capacitor.config.ts` to `http://localhost:3000`, run `npx cap sync ios`, then **Run** from Xcode while `yarn dev` is up. Remember to **remove** `server.url` before production builds so you do not ship a dev URL.

## Production-like testing

Use **`yarn mobile:ios`** or Xcode after `mobile:build:ios` when you want to match what users get from the App Store (static `out/`, `NODE_ENV=production`).
