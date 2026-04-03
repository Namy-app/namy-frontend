import { Capacitor } from "@capacitor/core";

import { env } from "@/lib/env";

/** Which env var supplied the resolved key (for dev logging). */
export type GoogleMapsKeySource =
  | "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_WEB"
  | "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_IOS"
  | "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID"
  | "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY";

let devKeyLogged = false;

function logDevGoogleMapsKey(
  runtime: "ios" | "android" | "web",
  source: GoogleMapsKeySource,
  key: string
): void {
  if (typeof window === "undefined") {
    return;
  }
  if (devKeyLogged) {
    return;
  }
  devKeyLogged = true;

  window.__NAMY_MAPS_DEBUG__ = {
    ...window.__NAMY_MAPS_DEBUG__,
    runtime,
    envVar: source,
    key,
  };

  console.warn(`[Google Maps] runtime=${runtime} envVar=${source} key=${key}`);
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

  logDevGoogleMapsKey(runtime, source, key);
  return key;
}
