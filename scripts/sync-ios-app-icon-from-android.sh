#!/usr/bin/env bash
# Generate ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png (1024×1024)
# from the same raster sources you use for Android or the web PWA icons.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST_DIR="$ROOT/ios/App/App/Assets.xcassets/AppIcon.appiconset"
DEST="$DEST_DIR/AppIcon-512@2x.png"
ANDROID_RES="$ROOT/android/app/src/main/res"

mkdir -p "$DEST_DIR"

try_sips() {
  local src="$1"
  if [[ -f "$src" ]]; then
    sips -z 1024 1024 "$src" --out "$DEST" >/dev/null
    echo "OK: wrote $DEST (from $src)"
    exit 0
  fi
}

# Prefer Android launcher art first so iOS matches the Play Store / device icon.
# (public/icon-*.png is often a generic PWA placeholder and must not win over mipmaps.)
for d in xxxhdpi xxhdpi xhdpi hdpi mdpi; do
  try_sips "$ANDROID_RES/mipmap-${d}/ic_launcher_foreground.png"
done
for d in xxxhdpi xxhdpi xhdpi hdpi mdpi; do
  try_sips "$ANDROID_RES/mipmap-${d}/ic_launcher.png"
  try_sips "$ANDROID_RES/mipmap-${d}/ic_launcher_round.png"
done

try_sips "$ROOT/public/icon-512x512.png"
try_sips "$ROOT/public/icon-192x192.png"

echo "No suitable source PNG found." >&2
echo "Add one of:" >&2
echo "  - android/app/src/main/res/mipmap-*/ic_launcher_foreground.png (preferred)" >&2
echo "  - android/app/src/main/res/mipmap-*/ic_launcher.png" >&2
echo "  - public/icon-512x512.png" >&2
echo "Then run: yarn mobile:icons:sync-ios" >&2
echo "Or in Xcode: App → Assets → AppIcon → drag a 1024×1024 PNG." >&2
exit 1
