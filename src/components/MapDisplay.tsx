"use client";

import { GoogleMap, Marker } from "@react-google-maps/api";
import { useMemo } from "react";

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

export function MapDisplay({
  lat,
  lng,
  storeName,
  height = "200px",
}: MapDisplayProps) {
  const center = useMemo(() => ({ lat, lng }), [lat, lng]);
  return (
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
      }}
    >
      <Marker position={center} title={storeName} />
    </GoogleMap>
  );
}
