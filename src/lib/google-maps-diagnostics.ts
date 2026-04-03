/**
 * Google Maps JS can fail silently in the map tile with "Something went wrong".
 * We register window.gm_authFailure (invalid key / API disabled / billing) and
 * surface LoadScript errors. Enable details with NEXT_PUBLIC_DEBUG_GOOGLE_MAPS=true.
 */

export const MAPS_AUTH_FAILURE_EVENT = "namy-maps-auth-failure";

/** Fired when any Maps diagnostic field on window is updated (auth or LoadScript). */
export const MAPS_DIAGNOSTICS_UPDATE_EVENT = "namy-maps-diagnostics-update";

/** Shown in-app when Google invokes window.gm_authFailure (no extra args from Google). */
export const GOOGLE_MAPS_AUTH_FAILURE_SUMMARY = `gm_authFailure — Google Maps JavaScript API rejected this session.

Google does not pass a reason string to this callback. Typical causes:
• API key invalid or from another project
• Application restrictions: iOS bundle ID must be com.namyapp (Cloud Console → Credentials → key → iOS apps)
• Maps JavaScript API not enabled for the project
• Billing disabled on the Google Cloud project
• Key quota exceeded

Check the Network tab for https://maps.googleapis.com/ — failed responses often include an error body.`;

export function isMapsDiagnosticsEnabled(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  const flag = process.env.NEXT_PUBLIC_DEBUG_GOOGLE_MAPS;
  return flag === "1" || flag === "true";
}

export function registerGoogleMapsAuthFailureHandler(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.gm_authFailure = () => {
    window.__NAMY_MAPS_DEBUG__ = {
      ...window.__NAMY_MAPS_DEBUG__,
      authFailureAt: Date.now(),
      authFailureSummary: GOOGLE_MAPS_AUTH_FAILURE_SUMMARY,
    };
    window.dispatchEvent(new CustomEvent(MAPS_AUTH_FAILURE_EVENT));
    window.dispatchEvent(new CustomEvent(MAPS_DIAGNOSTICS_UPDATE_EVENT));
    console.warn(
      "[Google Maps] gm_authFailure — check API key restrictions and Maps JavaScript API."
    );
    console.error(GOOGLE_MAPS_AUTH_FAILURE_SUMMARY);
  };
}

export function recordLoadScriptError(error: unknown): void {
  if (typeof window === "undefined") {
    return;
  }
  const message = formatMapsLoadError(error);
  const stack = error instanceof Error ? error.stack : undefined;
  const name = error instanceof Error ? error.name : "Error";
  window.__NAMY_MAPS_DEBUG__ = {
    ...window.__NAMY_MAPS_DEBUG__,
    loadScriptError: message,
    loadScriptErrorName: name,
    loadScriptStack: stack,
    loadScriptErrorAt: Date.now(),
  };
  window.dispatchEvent(new CustomEvent(MAPS_DIAGNOSTICS_UPDATE_EVENT));
}

export function formatMapsLoadError(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  return String(err);
}

declare global {
  interface Window {
    /** Called by Google Maps JS when the API key is invalid or not allowed */
    gm_authFailure?: () => void;
    __NAMY_MAPS_DEBUG__?: {
      runtime?: "ios" | "android" | "web";
      envVar?: string;
      key?: string;
      authFailureAt?: number;
      authFailureSummary?: string;
      loadScriptError?: string;
      loadScriptErrorName?: string;
      loadScriptStack?: string;
      loadScriptErrorAt?: number;
    };
  }
}

export {};
