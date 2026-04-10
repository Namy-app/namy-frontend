#!/usr/bin/env bash
# Prints the path to adb (stdout) or exits 127.
resolve_adb() {
  if command -v adb >/dev/null 2>&1; then
    command -v adb
    return
  fi
  if [ -n "${ANDROID_HOME:-}" ] && [ -x "${ANDROID_HOME}/platform-tools/adb" ]; then
    echo "${ANDROID_HOME}/platform-tools/adb"
    return
  fi
  if [ -n "${ANDROID_SDK_ROOT:-}" ] && [ -x "${ANDROID_SDK_ROOT}/platform-tools/adb" ]; then
    echo "${ANDROID_SDK_ROOT}/platform-tools/adb"
    return
  fi
  if [ -x "${HOME}/Library/Android/sdk/platform-tools/adb" ]; then
    echo "${HOME}/Library/Android/sdk/platform-tools/adb"
    return
  fi
  echo "adb not found. Add Android SDK platform-tools to PATH, or set ANDROID_HOME." >&2
  exit 127
}

resolve_adb
