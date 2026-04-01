import { Capacitor } from "@capacitor/core";

import { env } from "@/lib/env";

/** Which env var supplied the resolved key (for dev logging). */
export type GoogleMapsKeySource =
  | "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_WEB"
  | "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_IOS"
  | "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID"
  | "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY";

let devKeyLogged = false;

/** Mobile/Capacitor builds use NODE_ENV=production, so dev-only logs never ran. Opt in with NEXT_PUBLIC_DEBUG_GOOGLE_MAPS=true at build time. */
function shouldLogGoogleMapsKey(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  const flag = process.env.NEXT_PUBLIC_DEBUG_GOOGLE_MAPS;
  return flag === "1" || flag === "true";
}

function logDevGoogleMapsKey(
  runtime: "ios" | "android" | "web",
  source: GoogleMapsKeySource
): void {
  if (!shouldLogGoogleMapsKey()) {
    return;
  }
  if (devKeyLogged) {
    return;
  }
  devKeyLogged = true;
  if (typeof window !== "undefined") {
    window.__NAMY_MAPS_DEBUG__ = {
      ...window.__NAMY_MAPS_DEBUG__,
      runtime,
      envVar: source,
    };
  }
  console.warn(`[Google Maps] runtime=${runtime} envVar=${source}`);
}

/**
 * Google Maps JS API key for the current runtime (web / iOS / Android).
 * Uses platform-specific env vars when set, otherwise falls back to
 * `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
 *
 * Map UI should load with `dynamic(..., { ssr: false })` or equivalent so this
 * runs in the browser where `Capacitor.getPlatform()` is accurate for native.
 */
export function getGoogleMapsApiKey(): string {
  const legacy = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const web = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_WEB ?? "";
  const ios = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_IOS ?? "";
  const android = env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID ?? "";

  let runtime: "ios" | "android" | "web" = "web";
  if (typeof window !== "undefined") {
    try {
      runtime = Capacitor.getPlatform() as "ios" | "android" | "web";
    } catch {
      runtime = "web";
    }
  }

  let key: string;
  let source: GoogleMapsKeySource;

  if (runtime === "ios") {
    if (ios) {
      key = ios;
      source = "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_IOS";
    } else {
      key = legacy;
      source = "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY";
    }
  } else if (runtime === "android") {
    if (android) {
      key = android;
      source = "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID";
    } else {
      key = legacy;
      source = "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY";
    }
  } else {
    if (web) {
      key = web;
      source = "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_WEB";
    } else {
      key = legacy;
      source = "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY";
    }
  }

  logDevGoogleMapsKey(runtime, source);
  return key;
}
