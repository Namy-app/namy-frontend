"use client";

import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import Link from "next/link";
import { useState, useEffect } from "react";

import type { Store } from "@/lib/api-types";
import { env } from "@/lib/env";
import { getUserLocationSafe, type UserLocation } from "@/lib/utils";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

// Custom store icon as SVG data URL
const storeIcon = {
  url:
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#E53935" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  `),
  scaledSize: { width: 32, height: 32 } as google.maps.Size,
  anchor: { x: 16, y: 32 } as google.maps.Point,
};

interface StoreMapProps {
  stores: Store[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
}

export default function StoreMap({
  stores,
  center,
  zoom = 12,
  height = "h-screen",
}: StoreMapProps) {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  });

  // Fetch user location on mount
  useEffect(() => {
    if (!center) {
      void getUserLocationSafe().then((location) => {
        if (location) {
          setUserLocation(location);
        }
      });
    }
  }, [center]);

  // Priority: 1. Provided center, 2. User location, 3. Store average, 4. Default (Mexico City)
  const storesWithCoords = stores.filter((s) => s.lat && s.lng);
  const mapCenter =
    center ||
    (userLocation
      ? { lat: userLocation.latitude, lng: userLocation.longitude }
      : null) ||
    (storesWithCoords.length > 0
      ? {
          lat:
            storesWithCoords.reduce((sum, s) => sum + s.lat!, 0) /
            storesWithCoords.length,
          lng:
            storesWithCoords.reduce((sum, s) => sum + s.lng!, 0) /
            storesWithCoords.length,
        }
      : { lat: 19.4326, lng: -99.1332 }); // Default to Mexico City

  if (loadError) {
    return (
      <div className={`w-full ${height} flex items-center justify-center`}>
        Error loading maps
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`w-full ${height} flex items-center justify-center`}>
        Loading maps...
      </div>
    );
  }

  return (
    <div className={`relative w-full ${height}`}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={zoom}
      >
        {stores
          .filter((store) => store.lat && store.lng)
          .map((store) => (
            <Marker
              key={store.id}
              position={{ lat: store.lat!, lng: store.lng! }}
              onClick={() => setSelectedStore(store)}
              icon={storeIcon}
            />
          ))}

        {/* InfoWindow appears near the selected marker */}
        {selectedStore && selectedStore.lat && selectedStore.lng ? <InfoWindow
            position={{
              lat: selectedStore.lat,
              lng: selectedStore.lng,
            }}
            onCloseClick={() => setSelectedStore(null)}
            options={{ pixelOffset: new google.maps.Size(0, -32) }}
          >
            <div className="p-2 min-w-50">
              <h3 className="font-bold text-lg mb-1">{selectedStore.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {selectedStore.address}
              </p>
              <div className="flex items-center gap-4 text-sm mb-3">
                {/* <span className="font-semibold">{selectedStore.price}</span> */}
                {/* <span className="text-yellow-500">
                  ⭐ {selectedStore.averageRating}
                </span> */}
              </div>
              <Link
                href={`/stores/${selectedStore.id}`}
                className="block w-full text-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                View Store
              </Link>
            </div>
          </InfoWindow> : null}
      </GoogleMap>
    </div>
  );
}
