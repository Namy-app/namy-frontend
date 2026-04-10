#!/usr/bin/env bash
# Install debug APK to a connected device/emulator. Resolves adb when platform-tools
# is not on PATH (common in GUI terminals).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APK="${1:-$ROOT/android/app/build/outputs/apk/debug/app-debug.apk}"

ADB="$(bash "$ROOT/scripts/android-resolve-adb.sh")"
if [ ! -f "$APK" ]; then
  echo "APK not found: $APK (run: yarn mobile:android:apk:debug)" >&2
  exit 1
fi

exec "$ADB" install -r "$APK"
