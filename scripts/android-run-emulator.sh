#!/usr/bin/env bash
# Full pipeline: web export → Capacitor sync → debug APK → install → launch on emulator/tablet.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# Prefer Android Studio's JBR when JAVA_HOME is unset (common in GUI terminals).
if [ -z "${JAVA_HOME:-}" ] && [ -d "/Applications/Android Studio.app/Contents/jbr/Contents/Home" ]; then
  export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
fi

yarn mobile:build:android
(cd android && ./gradlew assembleDebug)
bash scripts/android-install-debug.sh
bash scripts/android-launch-emulator.sh
