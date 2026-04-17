"use client";

import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";
import { MapPin, Star, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

import { GoogleMapsDiagnosticsError } from "@/components/GoogleMapsDiagnosticsError";
import { MapLoadingView } from "@/components/MapLoadingView";
import type { Store } from "@/lib/api-types";
import { navigateTo } from "@/lib/capacitor-navigate";
import { getGoogleMapsApiKey } from "@/lib/google-maps-api-key";
import { MAPS_AUTH_FAILURE_EVENT } from "@/lib/google-maps-diagnostics";
import { getUserLocationSafe, type UserLocation } from "@/lib/utils";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

interface StoreMapProps {
  stores: Store[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  discountPercentage?: number;
}

// Blue pulsing circle for the user's own location
function UserLocationMarker({ onClick }: { onClick: () => void }) {
  return (
    <div
      style={{
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }}
      onClick={(e) => {
        e.stopPropagation();
        e.nativeEvent?.stopImmediatePropagation();
        onClick();
      }}
      className="flex items-center justify-center"
      aria-hidden
    >
      <div className="h-8 w-8 shrink-0 rounded-full border-3 border-white bg-[#4285F4] shadow-md ring-1 ring-black/10" />
      <span className="absolute inline-flex h-10 w-10 rounded-full bg-blue-400 opacity-40 animate-ping" />
    </div>
  );
}

// Pill label + teardrop pin rendered as an HTML overlay
function StorePinLabel({
  store,
  isSelected,
  onClick,
}: {
  store: Store;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.nativeEvent?.stopImmediatePropagation();
        onClick();
      }}
      style={{ transform: "translate(-50%, -100%)", cursor: "pointer" }}
      className="flex flex-col items-center select-none"
    >
      {/* Pill */}
      <div
        className={`px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap shadow-md border transition-all ${
          isSelected
            ? "bg-[#E8572A] text-white border-[#E8572A]"
            : "bg-white text-gray-900 border-gray-200 hover:bg-[#fff5f2] hover:border-[#E8572A]"
        }`}
      >
        {store.name}
      </div>
      {/* Teardrop pin */}
      <svg
        width="12"
        height="10"
        viewBox="0 0 12 10"
        className={isSelected ? "text-[#E8572A]" : "text-[#E8572A]"}
      >
        <path d="M6 10 L0 0 Q6 3 12 0 Z" fill="currentColor" />
      </svg>
    </div>
  );
}

function StoreMapInner({
  stores,
  center,
  zoom = 12,
  height = "h-screen",
  discountPercentage = 10,
}: StoreMapProps) {
  const router = useRouter();
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(!center);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null);
  const [mapTilesReady, setMapTilesReady] = useState(false);
  const [mapsAuthRejected, setMapsAuthRejected] = useState(false);

  const handleBoundsChanged = useCallback(() => {
    if (mapInstance) {
      setBounds(mapInstance.getBounds() ?? null);
    }
  }, [mapInstance]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: getGoogleMapsApiKey(),
  });

  useEffect(() => {
    if (center) {
      return;
    }

    let cancelled = false;
    const ceilingMs = 15_000;

    const locationPromise = getUserLocationSafe({
      // Simulator / WKWebView often struggle with high accuracy + long hangs with no callback
      enableHighAccuracy: false,
      timeout: 12_000,
      maximumAge: 300_000,
    });

    const ceilingPromise = new Promise<null>((resolve) => {
      window.setTimeout(() => {
        resolve(null);
      }, ceilingMs);
    });

    void Promise.race([locationPromise, ceilingPromise]).then((location) => {
      if (cancelled) {
        return;
      }
      if (location) {
        setUserLocation(location);
      }
      setIsLoadingLocation(false);
    });

    return () => {
      cancelled = true;
    };
  }, [center]);

  useEffect(() => {
    const onAuthFailure = (): void => {
      setMapsAuthRejected(true);
    };
    window.addEventListener(MAPS_AUTH_FAILURE_EVENT, onAuthFailure);
    return () => {
      window.removeEventListener(MAPS_AUTH_FAILURE_EVENT, onAuthFailure);
    };
  }, []);

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
      : { lat: 19.4326, lng: -99.1332 });

  if (loadError || mapsAuthRejected) {
    return (
      <GoogleMapsDiagnosticsError
        height={height}
        loadError={loadError ?? undefined}
        authRejected={mapsAuthRejected}
      />
    );
  }

  if (!isLoaded) {
    return (
      <div className={`w-full ${height}`}>
        <MapLoadingView message="Loading map…" />
      </div>
    );
  }

  const mapOptions: google.maps.MapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    zoomControl: true,
    styles: [
      {
        featureType: "all",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      { featureType: "poi", stylers: [{ visibility: "off" }] },
      { featureType: "transit", stylers: [{ visibility: "off" }] },
    ],
  };

  const visibleStores = storesWithCoords.filter((store) => {
    if (!bounds) {
      return true;
    }
    return bounds.contains({ lat: store.lat!, lng: store.lng! });
  });

  return (
    <div className={`relative w-full ${height}`}>
      {!mapTilesReady ? (
        <div className="absolute inset-0 z-[5]">
          <MapLoadingView message="Loading map…" />
        </div>
      ) : null}

      {isLoadingLocation ? (
        <div className="absolute inset-0 z-10">
          <MapLoadingView message="Getting your location…" />
        </div>
      ) : null}

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={zoom}
        options={mapOptions}
        onLoad={(map) => {
          setMapInstance(map);
          setMapTilesReady(false);
          google.maps.event.addListenerOnce(map, "idle", () => {
            setMapTilesReady(true);
          });
        }}
        onBoundsChanged={handleBoundsChanged}
        onClick={() => {
          setSelectedStore(null);
          setShowUserInfo(false);
        }}
      >
        <OverlayView
          position={mapCenter}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <UserLocationMarker
            onClick={() => {
              setSelectedStore(null);
              setShowUserInfo((prev) => !prev);
            }}
          />
        </OverlayView>

        {visibleStores.map((store) => (
          <OverlayView
            key={store.id}
            position={{ lat: store.lat!, lng: store.lng! }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <StorePinLabel
              store={store}
              isSelected={selectedStore?.id === store.id}
              onClick={() => {
                setShowUserInfo(false);
                setSelectedStore(selectedStore?.id === store.id ? null : store);
              }}
            />
          </OverlayView>
        ))}
      </GoogleMap>

      {/* User location panel */}
      {showUserInfo ? (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[calc(100%-2rem)] max-w-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-3 px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 shrink-0">
              <span className="h-3 w-3 rounded-full bg-white" />
            </span>
            <p className="font-semibold text-gray-900 text-sm">You</p>
            <button
              onClick={() => setShowUserInfo(false)}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Store detail card — fixed bottom panel, outside GoogleMap */}
      {selectedStore ? (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[calc(100%-2rem)] max-w-sm">
          <div
            className="cursor-pointer"
            onClick={() => navigateTo(`/stores/${selectedStore.id}`, router)}
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 flex overflow-hidden hover:shadow-xl transition-shadow">
              {/* Image */}
              <div className="relative w-28 shrink-0 h-28">
                <Image
                  src={
                    selectedStore.imageUrl ||
                    "https://placehold.co/112x112/fef2f2/f87171?text=Store"
                  }
                  alt={selectedStore.name}
                  fill
                  className="object-cover"
                  unoptimized
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/112x112/fef2f2/f87171?text=Store";
                  }}
                />
                {/* Discount badge */}
                <div className="absolute top-2 left-2 bg-[#E8572A] text-white text-xs font-bold px-1.5 py-0.5 rounded-md">
                  {discountPercentage}%
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 p-3 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <p className="font-bold text-gray-900 text-sm leading-tight pr-2">
                    {selectedStore.name}
                  </p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedStore(null);
                    }}
                    className="shrink-0 text-gray-400 hover:text-gray-600 mt-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-1.5">
                  <Star className="w-3.5 h-3.5 fill-[#E8572A] text-[#E8572A]" />
                  <span className="text-xs font-semibold text-gray-800">
                    {selectedStore.averageRating?.toFixed(1) ?? "4.5"}
                  </span>
                  {selectedStore.reviewCounter ? (
                    <span className="text-xs text-gray-400">
                      ({selectedStore.reviewCounter})
                    </span>
                  ) : null}
                </div>

                {/* Category pill */}
                {selectedStore.type ? (
                  <div className="flex gap-1 mb-1.5">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {selectedStore.type === "RESTAURANT"
                        ? "Restaurante"
                        : selectedStore.type === "SERVICE"
                          ? "Servicio"
                          : "Tienda"}
                    </span>
                  </div>
                ) : null}

                {/* Distance */}
                {selectedStore.distance !== undefined ? (
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPin className="w-3 h-3 text-[#E8572A]" />
                    <span className="text-xs">
                      {selectedStore.distance.toFixed(1)} km
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const StoreMap = dynamic(async () => ({ default: StoreMapInner }), {
  ssr: false,
});

export default StoreMap;
