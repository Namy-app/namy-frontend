# iOS Simulator: where JavaScript logs actually go

## Xcode / macOS “system log” usually won’t show your app’s `console.log`

Capacitor apps render the web UI in a **WKWebView**. **`console.log` / `console.warn` / `console.error` from your JavaScript do not reliably appear** in:

- The Xcode **debug area** (console) while the app runs
- **Console.app** filtered only by process name, for WebView output

That is normal. Native `NSLog` from Swift/ObjC shows in Xcode; **WebView JS logs do not** unless you attach a debugger to the Web Content process (advanced).

## Use Safari Web Inspector (recommended)

This is the standard way to see **network, console, and errors** for the Simulator WebView.

1. On the Mac, open **Safari** (not Chrome).
2. **Safari → Settings → Advanced** → enable **“Show features for web developers”** / **“Show Develop menu in menu bar”** (wording varies by macOS version).
3. Run your app in the **iOS Simulator** so it is in the foreground.
4. In Safari: **Develop → Simulator → &lt;your app name&gt;** → pick the **WebView** / page entry (sometimes listed as the URL or “index”).
5. A Web Inspector window opens. Open the **Console** tab — your `console.warn`, `console.error`, and network errors appear here.

If the menu is empty, confirm the Simulator app is running and try again after a cold launch.

## Maps-specific errors

If the map shows a grey **“Something went wrong”** tile, Google is rejecting the request (key, API enablement, billing, or restrictions). With **`NEXT_PUBLIC_DEBUG_GOOGLE_MAPS=true`** (or `next dev`), the in-app **Maps debug** strip at the bottom shows masked key, runtime, and whether **`gm_authFailure`** fired — you do not have to rely on logs alone.

## Live reload + dev server

To get `NODE_ENV=development` and easier debugging, run **`yarn dev`** and **`yarn mobile:ios:live`** so the WebView loads `http://localhost:3000`. See **`docs/ios-simulator-dev.md`**.
