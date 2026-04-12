"use client";

import { type Libraries, LoadScript } from "@react-google-maps/api";
import { type ReactNode, useState } from "react";

import { MapLoadingView } from "@/components/MapLoadingView";
import { getGoogleMapsApiKey } from "@/lib/google-maps-api-key";
import { recordLoadScriptError } from "@/lib/google-maps-diagnostics";

const libraries: Libraries = ["places"];

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const [loadFailed, setLoadFailed] = useState(false);

  if (loadFailed) {
    return <>{children}</>;
  }

  return (
    <LoadScript
      googleMapsApiKey={getGoogleMapsApiKey()}
      libraries={libraries}
      onError={(err) => {
        recordLoadScriptError(err);
        console.warn("[Google Maps] LoadScript error", err);
        setLoadFailed(true);
      }}
      loadingElement={
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
          <MapLoadingView message="Loading map…" className="min-h-[50vh]" />
        </div>
      }
    >
      {children}
    </LoadScript>
  );
}
