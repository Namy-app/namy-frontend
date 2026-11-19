"use client";

import { isMapsDiagnosticsEnabled } from "@/lib/google-maps-diagnostics";

interface GoogleMapsDiagnosticsErrorProps {
  height: string;
  loadError: Error | undefined;
  authRejected: boolean;
  apiKeyMissing?: boolean;
}

export function GoogleMapsDiagnosticsError({
  height,
  loadError,
  authRejected,
  apiKeyMissing = false,
}: GoogleMapsDiagnosticsErrorProps) {
  const verbose = isMapsDiagnosticsEnabled();
  const snap =
    typeof window !== "undefined" ? window.__NAMY_MAPS_DEBUG__ : undefined;

  const summary = apiKeyMissing
    ? "The map is temporarily unavailable. You can still browse the store list."
    : authRejected
      ? "The map is currently unavailable. You can still browse stores and coupons."
      : loadError
        ? "Check your connection and try again."
        : "Check your connection and try again.";

  return (
    <div
      className={`flex w-full ${height} flex-col items-center justify-center gap-3 bg-muted/30 px-4 py-6 text-center`}
    >
      <p className="text-sm font-medium text-foreground">Map couldn’t load</p>
      <p className="max-w-md text-xs text-muted-foreground">{summary}</p>
      {verbose ? (
        <div className="mt-1 max-w-lg rounded-md border border-dashed border-border bg-background/90 p-3 text-left text-[11px] font-mono leading-relaxed text-muted-foreground">
          <p className="mb-2 font-sans text-xs font-semibold text-foreground">
            Maps debug
          </p>
          {snap?.runtime != null ? <p>runtime: {snap.runtime}</p> : null}
          {snap?.envVar ? <p>key source: {snap.envVar}</p> : null}
          {snap?.keyConfigured !== undefined ? (
            <p>key configured: {String(snap.keyConfigured)}</p>
          ) : null}
          {snap?.loadScriptError != null ? (
            <p>loadScript: {snap.loadScriptError}</p>
          ) : null}
          {snap?.authFailureAt != null ? (
            <p>gm_authFailure: {new Date(snap.authFailureAt).toISOString()}</p>
          ) : null}
          {snap?.loadScriptErrorAt != null ? (
            <p>
              loadScript error at:{" "}
              {new Date(snap.loadScriptErrorAt).toISOString()}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
