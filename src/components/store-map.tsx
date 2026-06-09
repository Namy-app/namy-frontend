"use client";

import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";
import { Heart, MapPin, Star, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";

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
  onSelectedStoreChange?: (store: Store | null) => void;
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

function MapSelectedStoreCard({
  store,
  discountPercentage,
  onClose,
  onNavigate,
}: {
  store: Store;
  discountPercentage: number;
  onClose: () => void;
  onNavigate: () => void;
}) {
  const imageUrl =
    store.imageUrl ||
    "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&auto=format&fit=crop";
  const rating = store.averageRating?.toFixed(1) ?? "4.5";
  const distanceLabel =
    store.distance !== undefined ? `${store.distance.toFixed(1)} km` : null;
  const categoryLabel =
    store.type === "RESTAURANT"
      ? "Restaurante"
      : store.type === "SERVICE"
        ? "Servicio"
        : store.type === "PRODUCT"
          ? "Tienda"
          : "Restaurant";

  return (
    <div
      className="flex h-[7.75rem] cursor-pointer overflow-hidden rounded-2xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
      onClick={onNavigate}
    >
      <div className="relative h-full w-[7.75rem] shrink-0">
        <Image
          src={imageUrl}
          alt={store.name}
          fill
          className="object-cover"
          unoptimized
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/124x124/fef2f2/f87171?text=Store";
          }}
        />
        <div className="absolute left-2 top-2 rounded-md bg-[#E8572A] px-1.5 py-0.5 text-[11px] font-bold leading-none text-white">
          {discountPercentage}%
        </div>
        <button
          type="button"
          aria-label="Cerrar"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/95 text-gray-500 shadow-sm hover:text-gray-700"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between px-3 py-2.5">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-sm font-bold leading-tight text-gray-900">
            {store.name}
          </p>
          <Heart
            className="mt-0.5 h-4 w-4 shrink-0 text-gray-300"
            aria-hidden
          />
        </div>

        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-[#E8572A] text-[#E8572A]" />
          <span className="text-xs font-semibold text-[#E8572A]">{rating}</span>
          {store.reviewCounter ? (
            <span className="text-xs text-gray-400">
              ({store.reviewCounter})
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-x-2 gap-y-0.5">
          <span className="text-[11px] font-medium text-sky-600">
            {categoryLabel}
          </span>
        </div>

        {distanceLabel ? (
          <div className="flex items-center gap-1 text-gray-500">
            <MapPin className="h-3 w-3 text-[#E8572A]" />
            <span className="text-xs">{distanceLabel}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StoreMapInner({
  stores,
  center,
  zoom = 12,
  height = "h-screen",
  discountPercentage = 10,
  onSelectedStoreChange,
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

  const visibleStores = useMemo(() => {
    return stores
      .filter((s) => s.lat && s.lng)
      .filter((store) => {
        if (!bounds) {
          return true;
        }
        return bounds.contains({ lat: store.lat!, lng: store.lng! });
      });
  }, [stores, bounds]);

  useEffect(() => {
    onSelectedStoreChange?.(selectedStore);
  }, [selectedStore, onSelectedStoreChange]);

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

      {selectedStore ? (
        <div className="absolute bottom-5 left-4 right-4 z-10">
          <MapSelectedStoreCard
            store={selectedStore}
            discountPercentage={discountPercentage}
            onClose={() => setSelectedStore(null)}
            onNavigate={() => navigateTo(`/stores/${selectedStore.id}`, router)}
          />
        </div>
      ) : null}
    </div>
  );
}

const StoreMap = dynamic(async () => ({ default: StoreMapInner }), {
  ssr: false,
});

export default StoreMap;
