#!/usr/bin/env bash
# Bring Ñamy to the foreground on a connected device/emulator (e.g. tablet AVD).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ADB="$("$ROOT/scripts/android-resolve-adb.sh")"

pick_serial() {
  if [ -n "${ANDROID_SERIAL:-}" ]; then
    echo "$ANDROID_SERIAL"
    return
  fi
  "$ADB" devices | awk '/\tdevice$/{print $1; exit}'
}

SERIAL="$(pick_serial)"
if [ -z "$SERIAL" ]; then
  echo "No Android device/emulator connected. Start an AVD (e.g. Medium Tablet) and wait for adb devices." >&2
  exit 1
fi

exec "$ADB" -s "$SERIAL" shell am start -n namyapp.com/.MainActivity
