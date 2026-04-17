"use client";

import dynamic from "next/dynamic";
import { useLayoutEffect, type ReactNode } from "react";

import { registerGoogleMapsAuthFailureHandler } from "@/lib/google-maps-diagnostics";

const GoogleMapsProvider = dynamic(
  () =>
    import("@/components/GoogleMapsProvider").then((m) => m.GoogleMapsProvider),
  { ssr: false }
);

export function GoogleMapsProviderClient({
  children,
}: {
  children: ReactNode;
}) {
  useLayoutEffect(() => {
    registerGoogleMapsAuthFailureHandler();
  }, []);

  return <GoogleMapsProvider>{children}</GoogleMapsProvider>;
}
