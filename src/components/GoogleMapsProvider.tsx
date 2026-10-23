"use client";

import { type Libraries, useJsApiLoader } from "@react-google-maps/api";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { getGoogleMapsApiKey } from "@/lib/google-maps-api-key";
import {
  MAPS_AUTH_FAILURE_EVENT,
  recordLoadScriptError,
} from "@/lib/google-maps-diagnostics";

const libraries: Libraries = ["places"];
interface MapsStatus {
  isLoaded: boolean;
  loadError?: Error;
  authRejected: boolean;
  apiKeyMissing: boolean;
}
const MapsContext = createContext<MapsStatus>({
  isLoaded: false,
  authRejected: false,
  apiKeyMissing: false,
});
export const useGoogleMapsStatus = (): MapsStatus => useContext(MapsContext);

function MapsLoader({
  apiKey,
  children,
}: {
  apiKey: string;
  children: ReactNode;
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "namy-google-maps",
    googleMapsApiKey: apiKey,
    libraries,
  });
  const [authRejected, setAuthRejected] = useState(() =>
    Boolean(
      typeof window !== "undefined" && window.__NAMY_MAPS_DEBUG__?.authFailureAt
    )
  );
  useEffect(() => {
    const onFailure = (): void => setAuthRejected(true);
    window.addEventListener(MAPS_AUTH_FAILURE_EVENT, onFailure);
    return () => window.removeEventListener(MAPS_AUTH_FAILURE_EVENT, onFailure);
  }, []);
  useEffect(() => {
    if (loadError) {
      recordLoadScriptError(loadError);
    }
  }, [loadError]);
  return (
    <MapsContext.Provider
      value={{ isLoaded, loadError, authRejected, apiKeyMissing: false }}
    >
      {children}
    </MapsContext.Provider>
  );
}

/** One loader for every map. Non-map screens never wait for the Maps network. */
export function GoogleMapsProvider({ children }: { children: ReactNode }) {
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    return (
      <MapsContext.Provider
        value={{ isLoaded: false, authRejected: false, apiKeyMissing: true }}
      >
        {children}
      </MapsContext.Provider>
    );
  }
  return <MapsLoader apiKey={apiKey}>{children}</MapsLoader>;
}
