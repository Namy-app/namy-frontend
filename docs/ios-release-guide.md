# iOS Release Guide (TestFlight/App Store)

This guide covers how to prepare and ship an iOS release for `namy-frontend` using Capacitor.

## Prerequisites

- Apple Developer account with App Store Connect access
- Xcode installed and signed in
- iOS bundle identifier configured in Apple Developer/App Store Connect
- Production environment values in `.env.production`

## 1) Build and sync iOS web assets

From project root:

```bash
cd /Users/abisoyeoke-lawal/Development/GenieX/namy/namy-frontend
PATH="/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin" yarn mobile:ios:release
```

What this does:

- runs production web build
- syncs Capacitor iOS project
- opens the iOS project in Xcode

## 2) Configure signing in Xcode

In Xcode:

1. Select `App` target
2. Open **Signing & Capabilities**
3. Enable **Automatically manage signing**
4. Choose your Team
5. Confirm Bundle Identifier matches App Store Connect app

## 3) Set version and build number

In Xcode target settings:

- **Version** (`CFBundleShortVersionString`), e.g. `1.0.1`
- **Build** (`CFBundleVersion`), increment each upload

## 4) Create Archive

In Xcode:

1. Select **Any iOS Device (arm64)** as destination
2. Use menu **Product > Archive**
3. Wait for Organizer to open

## 5) Upload to TestFlight / App Store Connect

From Organizer:

1. Select latest archive
2. Click **Distribute App**
3. Choose **App Store Connect**
4. Choose **Upload**
5. Keep defaults unless your release process requires otherwise

After upload, manage release in App Store Connect:

- Add testers for TestFlight, or
- Submit for App Store review

## Troubleshooting

- If iOS sync fails with missing `Podfile`, regenerate iOS platform:

```bash
cd /Users/abisoyeoke-lawal/Development/GenieX/namy/namy-frontend
PATH="/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin" npx cap add ios
PATH="/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin" npx cap sync ios
```

- If app shows stale web content, run `yarn mobile:build:ios` again before archiving.
- If signing fails, verify Team, Bundle ID, and provisioning in **Signing & Capabilities**.
