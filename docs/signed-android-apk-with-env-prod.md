# Building a Signed Android APK with `.env.prod`

This guide explains how to build a signed Android APK for `namy-frontend` using production environment values from `.env.prod`.

## 1) Prepare production env file

Next.js uses `.env.production` for production builds. If your source file is `.env.prod`, copy it first:

```bash
cd /Users/abisoyeoke-lawal/Development/GenieX/namy/namy-frontend
cp .env.prod .env.production
```

Then build and sync Android only:

```bash
PATH="/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin" yarn mobile:build
PATH="/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin" npx cap sync android
```

> Note: Use `npx cap sync android` (not plain `npx cap sync`) to avoid iOS sync failures when iOS is not fully configured.

## 2) Create Android keystore (one-time)

Run this once to generate your release keystore:

```bash
cd /Users/abisoyeoke-lawal/Development/GenieX/namy/namy-frontend/android/app
keytool -genkeypair -v \
  -keystore namy-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias namyrelease
```

Keep this file safe. Losing it means you cannot publish updates for the same app identity.

## 3) Configure signing secrets

In `android/gradle.properties` (or `~/.gradle/gradle.properties`), add:

```properties
MYAPP_UPLOAD_STORE_FILE=app/namy-release-key.jks
MYAPP_UPLOAD_KEY_ALIAS=namyrelease
MYAPP_UPLOAD_STORE_PASSWORD=your_store_password
MYAPP_UPLOAD_KEY_PASSWORD=your_key_password
```

Do not commit real passwords to git.

## 4) Configure signing in Gradle

Update `android/app/build.gradle` to include release signing:

```gradle
android {
    // ...
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

## 5) Build signed release APK

```bash
cd /Users/abisoyeoke-lawal/Development/GenieX/namy/namy-frontend/android
PATH="/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin" ./gradlew assembleRelease
```

Expected output:

- Signed APK: `android/app/build/outputs/apk/release/app-release.apk`
- Unsigned APK (if signing is not configured): `android/app/build/outputs/apk/release/app-release-unsigned.apk`

## Optional: Build Play Store bundle (AAB)

```bash
cd /Users/abisoyeoke-lawal/Development/GenieX/namy/namy-frontend/android
PATH="/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin" ./gradlew bundleRelease
```

Output:

- `android/app/build/outputs/bundle/release/app-release.aab`
