# iOS app icon (stay in sync with Android)

The iOS target uses **`AppIcon.appiconset`** with a single **1024×1024** PNG referenced as `AppIcon-512@2x.png` (see `Contents.json`).

Android often uses **adaptive icons** (`mipmap-anydpi-v26` + drawables) and/or **`mipmap-*dpi/ic_launcher.png`**. Those are different files from the iOS asset catalog, so updating only Android does not change iOS until you copy the same artwork.

## Option A — Sync script (macOS)

From `namy-frontend`, after you have **either**:

- `public/icon-512x512.png` (or `icon-192x192.png`), **or**
- `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` (or another density),

run:

```bash
yarn mobile:icons:sync-ios
```

This runs `scripts/sync-ios-app-icon-from-android.sh`, which uses **`sips`** to produce **`ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png`**.

If you only changed **vector** adaptive layers (`drawable-v24/ic_launcher_foreground.xml`), export a **square PNG** from Android Studio / Figma and save it as `public/icon-512x512.png`, then run the script.

## Option B — Xcode

1. Open **`ios/App/App.xcworkspace`** in Xcode.
2. **App** → **Assets.xcassets** → **AppIcon**.
3. Drag a **1024×1024** image into the iOS slot (or replace `AppIcon-512@2x.png` on disk and keep `Contents.json` as-is).

## App Store note

Use a **1024×1024** icon that meets [Apple’s guidelines](https://developer.apple.com/design/human-interface-guidelines/app-icons) (no transparency for the App Store asset in many cases).
