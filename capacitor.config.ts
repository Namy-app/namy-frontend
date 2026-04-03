import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  // Android `applicationId` is still `namyapp.com` (see android/app/build.gradle).
  // iOS bundle ID is `com.namyapp` (Xcode → App target → Signing & Capabilities).
  appId: "namyapp.com",
  appName: "namyapp",
  webDir: "out",
  ios: {
    webContentsDebuggingEnabled: true,
  },
  android: {
    webContentsDebuggingEnabled: true,
  },
  server: {
    errorPath: "404.html",
    hostname: "namyapp.com",
  },
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: "LIGHT",
      backgroundColor: "#ffffff",
    },
  },
};

export default config;
