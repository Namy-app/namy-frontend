# App Store Connect screenshots

**JPEG** (`.jpg`), quality ~90%, **sRGB**. Apple also accepts PNG; JPEG avoids some Connect validation issues.

| Folder                                 | Use in App Store Connect                      | Pixel size (portrait) |
| -------------------------------------- | --------------------------------------------- | --------------------- |
| `iphone-6-5-display-1284x2778/`        | **iPhone 6.5"** display                       | 1284 × 2778           |
| `iphone-6-7-display-1290x2796/`        | **iPhone 6.7"** display                       | 1290 × 2796           |
| `ipad-13-display-2064x2752-portrait/`  | **iPad Pro 13"** (native resolution)          | 2064 × 2752           |
| `ipad-129-display-2048x2732-portrait/` | **12.9" iPad Pro** slot (largest legacy size) | 2048 × 2732           |

Upload screenshots only to the tab that matches the folder (wrong tab → “wrong format” errors).

Files are numbered `01.jpg`–`05.jpg` in display order.

**iPad sets** were upscaled from the iPhone 6.7" shots for sizing only — for sharp iPad marketing assets, capture again in **Xcode → iPad Pro 13-inch** (or 12.9") Simulator (**File → Save Screen**) and re-run `sips` to these dimensions if Connect rejects upscaled images.

The folder `../app-store-screenshots-1284x2778/` is the older flat iPhone set (also JPEG); prefer the `iphone-*` folders above for phones.
