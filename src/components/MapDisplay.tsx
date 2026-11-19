"use client";

import { GoogleMap, Marker } from "@react-google-maps/api";
import { useMemo, useState } from "react";

import { GoogleMapsDiagnosticsError } from "@/components/GoogleMapsDiagnosticsError";
import { useGoogleMapsStatus } from "@/components/GoogleMapsProvider";
import { MapLoadingView } from "@/components/MapLoadingView";

interface MapDisplayProps {
  lat: number;
  lng: number;
  storeName?: string;
  height?: string;
}

const mapContainerStyle = {
  width: "100%",
  borderRadius: "12px",
};

// Hide all POIs, transit, and business labels — only show roads + terrain
const cleanMapStyles: google.maps.MapTypeStyle[] = [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
];

export function MapDisplay({
  lat,
  lng,
  storeName,
  height = "200px",
}: MapDisplayProps) {
  const { isLoaded, loadError, authRejected, apiKeyMissing } =
    useGoogleMapsStatus();
  const center = useMemo(() => ({ lat, lng }), [lat, lng]);
  const [tilesReady, setTilesReady] = useState(false);

  if (loadError || authRejected || apiKeyMissing) {
    return (
      <GoogleMapsDiagnosticsError
        height="min-h-[200px]"
        loadError={loadError}
        authRejected={authRejected}
        apiKeyMissing={apiKeyMissing}
      />
    );
  }
  if (!isLoaded) {
    return (
      <div style={{ height }}>
        <MapLoadingView message="Loading map…" />
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-[12px]"
      style={{ height }}
    >
      {!tilesReady ? (
        <div className="absolute inset-0 z-[5]">
          <MapLoadingView message="Loading map…" />
        </div>
      ) : null}
      <GoogleMap
        mapContainerStyle={{ ...mapContainerStyle, height }}
        center={center}
        zoom={15}
        options={{
          disableDefaultUI: true,
          mapTypeControl: false,
          streetViewControl: false,
          draggable: false,
          scrollwheel: false,
          disableDoubleClickZoom: true,
          gestureHandling: "none",
          styles: cleanMapStyles,
        }}
        onLoad={(map) => {
          google.maps.event.addListenerOnce(map, "idle", () => {
            setTilesReady(true);
          });
        }}
      >
        <Marker position={center} title={storeName} />
      </GoogleMap>
    </div>
  );
}
