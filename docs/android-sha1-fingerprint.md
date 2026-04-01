# Android SHA-1 certificate fingerprint

Google services (Firebase, Google Sign-In, Maps API keys, and similar) often require the **SHA-1** fingerprint of the signing certificate that matches your app’s package name.

The Android app id for this project is **`namyapp.com`** (see `android/app/build.gradle`).

## Option A: Gradle signing report (recommended)

From the Android project directory, run:

```bash
cd android
./gradlew signingReport
```

In the output, find the **Variant** you care about (for example `debug` or `release`) and copy the **SHA1** line under **V1/V2/V3 Signing Configs**.

- **Debug** builds use the default debug keystore (usually `~/.android/debug.keystore`).
- **Release** builds appear only if release signing is configured (see `MYAPP_UPLOAD_*` in `local.properties` and `android/app/build.gradle`).

Ensure `JAVA_HOME` points to a JDK if Gradle reports that `java` is missing.

## Option B: Debug keystore with `keytool`

Local debug installs use the Android debug keystore. Default location and credentials:

| Setting  | Value                       |
| -------- | --------------------------- |
| Keystore | `~/.android/debug.keystore` |
| Alias    | `androiddebugkey`           |
| Password | `android`                   |

```bash
keytool -list -v \
  -keystore ~/.android/debug.keystore \
  -alias androiddebugkey \
  -storepass android \
  -keypass android
```

Look for the **SHA1** line in the output.

## Option C: Release / upload keystore with `keytool`

If you use a release keystore (for example the one created in [signed-android-apk-with-env-prod.md](./signed-android-apk-with-env-prod.md)), list fingerprints with your real path, alias, and passwords:

```bash
keytool -list -v -keystore /path/to/your-release.keystore -alias YOUR_KEY_ALIAS
```

You will be prompted for the keystore password (and key password if it differs). Copy the **SHA1** value from the output.

Register the SHA-1 that matches how you install the app: use the **debug** fingerprint for development builds and the **release** (or Play App Signing) fingerprint for store builds, as required by the Google product you are configuring.
