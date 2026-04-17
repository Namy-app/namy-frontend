# iOS production build and release

This document explains how to produce a **production** iOS build for `namy-frontend`: a Next.js static export synced into the Capacitor iOS project, then archived and distributed via Xcode (TestFlight or App Store).

## Stack (what you are building)

| Layer      | What happens                                                                            |
| ---------- | --------------------------------------------------------------------------------------- |
| Web        | `MOBILE_BUILD=true next build` → static export to `out/` (see `next.config.js`)         |
| Post-build | `mobile:postbuild` copies `404.html` and dynamic route HTML for Capacitor routing       |
| Native     | `npx cap sync ios` copies `out/` into `ios/App/App/public` and updates Capacitor config |

Capacitor `appId` remains `namyapp.com` for Android alignment (`capacitor.config.ts`). The **iOS bundle ID** is **`com.namyapp`** (Xcode target **App** → `ios/App/App.xcodeproj`).

## Prerequisites

- **Node** ≥ 24.2 (see `package.json` `engines`)
- **Yarn** (repo uses `yarn.lock`)
- **Xcode** (current stable, with command-line tools) on macOS
- **Apple Developer** account with App Store Connect access for distribution
- **Environment**: production values in `.env.production` (and any secrets required for the static build)

## npm scripts (from repo root `namy-frontend`)

| Script                    | Purpose                                                                                                                          |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `yarn mobile:build:ios`   | Production Next export → postbuild → `cap sync ios` only (no Xcode). Use when you only need fresh web assets in the iOS project. |
| `yarn mobile:ios:release` | Same as `mobile:build:ios`, clears extended attributes on `ios/`, then **`npx cap open ios`** so you can archive in Xcode.       |
| `yarn mobile:ios`         | Dev-oriented: build, sync, then run on simulator/device via Capacitor.                                                           |

For App Store / TestFlight, you typically run **`yarn mobile:ios:release`** (or `yarn mobile:build:ios` and open Xcode yourself).

## Step 1 — Build web assets and sync iOS

From the `namy-frontend` directory:

```bash
cd namy-frontend
yarn mobile:build:ios
```

Or to sync and open Xcode in one step:

```bash
yarn mobile:ios:release
```

If the macOS Terminal environment cannot find `node` or `yarn`, ensure Homebrew binaries are on `PATH`, for example:

```bash
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
```

Successful output ends with Capacitor **Sync finished** and updates `ios/App/App/public` with the exported site.

## Step 2 — Sign and version in Xcode

1. Open `ios/App/App.xcodeproj` (or use the project opened by `cap open ios`).
2. Select the **App** target → **Signing & Capabilities**.
3. Enable **Automatically manage signing**, choose your **Team**, and confirm the **Bundle Identifier** matches the app in App Store Connect (must align with **`com.namyapp`** / your registered App ID).
4. Set **Version** (`CFBundleShortVersionString`) and **Build** (`CFBundleVersion`); increment **Build** for every upload.

## Step 3 — Create an archive (production IPA for distribution)

1. Destination: **Any iOS Device (arm64)** (not a simulator).
2. Menu **Product → Archive**.
3. When the Organizer opens, select the archive → **Distribute App** → **App Store Connect** → **Upload** (or follow your team’s internal process).

After processing in App Store Connect, use TestFlight or submit for App Store review.

### Optional: archive from the command line

On a machine with a working Xcode install, you can archive with `xcodebuild` (scheme name is typically **`App`**). Adjust signing settings and export options to match your provisioning; this is often wrapped in CI with a dedicated export plist.

```bash
cd ios/App
xcodebuild -project App.xcodeproj -scheme App -configuration Release \
  -destination 'generic/platform=iOS' archive \
  -archivePath build/App.xcarchive
```

Use **Xcode Organizer** or `xcodebuild -exportArchive` with an export options plist to produce an `.ipa` for upload.

## Export compliance (“Missing Compliance” on the build)

Apple requires export-encryption info for each build. For a typical app that only uses **HTTPS/TLS** (APIs, Stripe, maps, etc.) and no custom proprietary cryptography, declare that you do **not** use non-exempt encryption:

- **Info.plist** includes `ITSAppUsesNonExemptEncryption` = `NO` (`false`) in this project so new uploads usually skip the manual step.
- For a build already uploaded: **App Store Connect → your app → TestFlight (or the version) → select the build → App Encryption Documentation / Compliance** and answer that the app uses only exempt encryption (e.g. standard HTTPS), or use the questionnaire’s exempt option. Exact labels vary slightly in the UI.

If you add features that use **non-standard** encryption, reassess and consult Apple’s export compliance docs.

## Troubleshooting

- **Stale web UI in the app** — Run `yarn mobile:build:ios` again, then rebuild or re-archive in Xcode.
- **Capacitor / iOS platform issues** — Regenerate the iOS platform only if you know you need to (this can overwrite native customizations):

  ```bash
  npx cap add ios
  npx cap sync ios
  ```

- **Signing errors** — Verify Team, Bundle ID, and provisioning profiles under **Signing & Capabilities**; ensure the app record exists in App Store Connect.
- **Quarantine / “damaged” framework messages** — The `mobile:ios:release` script runs `xattr -cr ios` to clear extended attributes; you can run that manually if needed after copying the repo from another machine.

## App Store screenshots

Processed JPEG screenshots (sRGB, correct pixel sizes per slot) live under **`docs/app-store-screenshots/`** — see that folder’s `README.md` for iPhone **6.5"** / **6.7"** and iPad **13"** / **12.9"** paths.

## Related docs

- [Android signed release with env](signed-android-apk-with-env-prod.md) — Android equivalent patterns for env and builds.
