# Capacitor PWA Setup

This app has been configured as a Progressive Web App (PWA) using Capacitor.js.

## What's Configured

✅ **Capacitor Core** - Installed and configured
✅ **PWA Manifest** - Created at `public/manifest.json`
✅ **App Plugin** - For native app lifecycle management
✅ **Static Export** - Next.js configured for static export
✅ **Capacitor Provider** - Added for app state management

## Available Scripts

```bash
# Development
yarn dev

# Build for production
yarn build

# Build and sync with Capacitor
yarn export

# Sync Capacitor (after build)
yarn cap:sync

# Open iOS project in Xcode
yarn cap:open:ios

# Open Android project in Android Studio
yarn cap:open:android
```

## Adding Mobile Platforms

### iOS

1. Install dependencies:

   ```bash
   yarn add @capacitor/ios
   npx cap add ios
   ```

2. Build your app:

   ```bash
   yarn build
   ```

3. Sync and open Xcode:
   ```bash
   yarn cap:sync
   yarn cap:open:ios
   ```

### Android

1. Install dependencies:

   ```bash
   yarn add @capacitor/android
   npx cap add android
   ```

2. Build your app:

   ```bash
   yarn build
   ```

3. Sync and open Android Studio:
   ```bash
   yarn cap:sync
   yarn cap:open:android
   ```

## PWA Features

- **Offline Support**: Service worker configured in `public/sw.js`
- **App-like Experience**: Standalone display mode
- **Back Button Handling**: Custom back button behavior
- **App State Management**: Lifecycle events tracked
- **URL Deep Linking**: Ready for deep link handling

## Important Notes

1. **Icons**: You'll need to add app icons:
   - `public/icon-192.png` (192x192)
   - `public/icon-512.png` (512x512)

2. **Build Process**: Always run `yarn build` before syncing with Capacitor platforms

3. **Testing PWA**:
   - Build the app: `yarn build`
   - Serve the build: `npx serve out`
   - Test in browser as PWA

4. **Environment Variables**: Make sure all environment variables are prefixed with `NEXT_PUBLIC_` to be available in the static build

## Next Steps

1. Generate app icons (192x192 and 512x512)
2. Test the PWA in production build
3. Add mobile platforms (iOS/Android) if needed
4. Configure splash screens
5. Add additional Capacitor plugins as needed

## Additional Plugins

You can add more Capacitor plugins:

```bash
# Camera
yarn add @capacitor/camera

# Geolocation
yarn add @capacitor/geolocation

# Push Notifications
yarn add @capacitor/push-notifications

# And many more...
```

Check the [Capacitor Plugins documentation](https://capacitorjs.com/docs/plugins) for more options.
