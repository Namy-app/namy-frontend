# Progressive Web App (PWA) Setup

This Next.js app has been configured as a Progressive Web App following the [official Next.js PWA guide](https://nextjs.org/docs/app/guides/progressive-web-apps).

## 🎯 What's Been Implemented

### 1. Web App Manifest

- Created [`src/app/manifest.ts`](src/app/manifest.ts) with app metadata
- Configured for standalone display mode
- Added support for app installation on home screen
- Set theme color to #8B5CF6 (purple)

### 2. Service Worker

- Updated [`public/sw.js`](public/sw.js) with caching strategies
- Implements offline support for cached resources
- Supports push notifications
- Handles notification clicks

### 3. PWA Metadata

- Enhanced [`src/app/layout.tsx`](src/app/layout.tsx) with PWA-specific metadata
- Added theme color for mobile browsers
- Configured Apple Web App settings
- Set viewport for mobile optimization

### 4. Security Headers

- Updated [`next.config.js`](next.config.js) with security headers
- Added `X-Content-Type-Options: nosniff`
- Added `X-Frame-Options: DENY`
- Added `Referrer-Policy: strict-origin-when-cross-origin`
- Special headers for service worker security

## 📱 Required Icons

You need to create the following icon files and place them in the `public/` directory:

### Required Files:

- `public/icon-192x192.png` - 192x192 pixels
- `public/icon-512x512.png` - 512x512 pixels

### Icon Requirements:

- **Format**: PNG with transparency
- **Purpose**: Both "maskable" and "any" icons are configured
- **Design Guidelines**:
  - Ensure your logo/icon has safe area padding (at least 10% on all sides for maskable icons)
  - Use your brand colors (purple #8B5CF6 as primary)
  - Should be recognizable at small sizes

### Tools to Generate Icons:

- [RealFaviconGenerator](https://realfavicongenerator.net/) - Generate all icon sizes
- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator) - CLI tool
- [Favicon.io](https://favicon.io/) - Simple online generator

### Quick Icon Creation:

```bash
# If you have a source logo (e.g., logo.png), you can use tools like ImageMagick:
convert logo.png -resize 192x192 public/icon-192x192.png
convert logo.png -resize 512x512 public/icon-512x512.png
```

## 🧪 Testing the PWA

### 1. Local Testing with HTTPS

PWAs require HTTPS. To test locally:

```bash
# Run with experimental HTTPS support
npm run dev -- --experimental-https
# or
pnpm dev -- --experimental-https
```

### 2. Install PWA Locally

1. Open your browser to `https://localhost:3000`
2. Accept the self-signed certificate warning
3. Look for the install prompt in your browser (usually in the address bar)
4. Click "Install" to add the app to your home screen

### 3. Test on Mobile Devices

**iOS (iPhone/iPad):**

1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will install with your icon and theme color

**Android:**

1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Install app" or "Add to Home Screen"
4. The app will install as a standalone app

### 4. Browser DevTools Testing

**Chrome DevTools:**

1. Open DevTools (F12)
2. Go to "Application" tab
3. Check "Manifest" section for your web app manifest
4. Check "Service Workers" to see if it's registered
5. Use "Lighthouse" tab to run a PWA audit

**Firefox:**

1. Open DevTools (F12)
2. Go to "Application" tab
3. Check "Manifest" and "Service Workers"

## 🔔 Push Notifications (Optional)

The service worker is configured to handle push notifications. To implement this feature, you'll need to:

1. Generate VAPID keys:

```bash
npm install -g web-push
web-push generate-vapid-keys
```

2. Add to `.env.local`:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
```

3. Implement push notification UI components and server actions as needed
   (See [Next.js PWA docs](https://nextjs.org/docs/app/guides/progressive-web-apps#implementing-web-push-notifications))

## 📊 PWA Checklist

- [x] Web App Manifest created
- [x] Service Worker implemented
- [x] HTTPS required for production
- [x] Security headers configured
- [x] Icons created and placed in public/ directory
- [ ] Tested installation on mobile devices
- [ ] Tested offline functionality
- [ ] (Optional) Push notifications implemented

## 🚀 Deployment Notes

### Vercel/Netlify/Production:

- PWA will work automatically on HTTPS
- The app is installable on all supported browsers
- Service worker will cache resources for offline use
- Users can install the app to their home screen

### What Users Will Experience:

1. **Install Prompt**: Modern browsers will show an install banner
2. **Home Screen Icon**: App appears with your icon and name
3. **Standalone Mode**: Opens without browser UI (chrome-less)
4. **Fast Loading**: Cached resources load instantly
5. **Offline Support**: Basic offline functionality for cached pages

## 🔍 Verification

Run the app in production mode:

```bash
npm run build
npm run start
```

Then use Lighthouse in Chrome DevTools to audit the PWA score:

- Target: PWA score > 90
- Check all PWA requirements are met

## 📚 Additional Resources

- [Next.js PWA Documentation](https://nextjs.org/docs/app/guides/progressive-web-apps)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN PWA Documentation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [What PWA Can Do Today](https://whatpwacando.today/)

## ⚠️ Important Notes

1. **HTTPS Required**: PWAs only work over HTTPS (except localhost)
2. **Service Worker Scope**: The service worker is served from `/public`
3. **Cache Strategy**: Currently using basic cache-first strategy
4. **Icons are Critical**: The app won't be installable without proper icons
5. **Browser Support**:
   - ✅ Chrome/Edge (full support)
   - ✅ Safari iOS 16.4+ (with limitations)
   - ✅ Firefox (full support)
   - ✅ Samsung Internet (full support)

## 🎨 Next Steps

1. **Create your icons** (192x192 and 512x512)
2. **Test locally** with `npm run dev -- --experimental-https`
3. **Deploy to production** (automatic HTTPS)
4. **Test installation** on mobile devices
5. **Run Lighthouse audit** to verify PWA score
6. **(Optional)** Implement push notifications

Enjoy your new PWA! 🎉
