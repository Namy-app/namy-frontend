import { Capacitor } from "@capacitor/core";

/** Parent bridges must never select native plugins or static routes in an iframe. */
export function isInIframe(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function getAppPlatform(): "web" | "ios" | "android" {
  if (typeof window === "undefined" || isInIframe()) {
    return "web";
  }
  const platform = Capacitor.getPlatform();
  return platform === "ios" || platform === "android" ? platform : "web";
}

export function isNativeApp(): boolean {
  return (
    typeof window !== "undefined" &&
    !isInIframe() &&
    Capacitor.isNativePlatform()
  );
}
