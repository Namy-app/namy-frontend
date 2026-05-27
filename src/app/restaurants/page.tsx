// To integrate this into your Next.js app, create a new route at:
// src/app/restaurants/page.tsx

"use client";

import { Search, Map, ChevronLeft, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useRef } from "react";

import { CategoryFilterPills } from "@/components/CategoryFilterPills";
import StoreMap from "@/components/store-map";
import { StoreType } from "@/domains/admin/types";
import { RestaurantCard } from "@/domains/store/components/RestaurantCard";
import { useCategoriesByStoreType, useStores } from "@/domains/store/hooks";
import { calculateDistance } from "@/domains/store/hooks/query/useClosestStores";
import { type StoreFilters } from "@/domains/store/type";
import { useMyLevel } from "@/domains/user/hooks/query/useMyLevel";
import { BasicLayout } from "@/layouts/BasicLayout";
import type { Store } from "@/lib/api-types";
import { getUserLocationSafe } from "@/lib/utils";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { useAuthStore } from "@/store/useAuthStore";

/** Fixed map panel offsets (ExploreHeader h-14 + bottom nav h-16) */
const MAP_PANEL_TOP =
  "calc(var(--status-bar-height, env(safe-area-inset-top, 0px)) + 3.5rem)";
const MAP_PANEL_BOTTOM = "4rem";
/** Height of back + search row floating over the map */
const MAP_FLOATING_HEADER_HEIGHT = "3.8rem";
/** Top corner radius for the map bottom sheet (half snap) */
const MAP_SHEET_TOP_RADIUS = "rounded-t-[40px]";
const MAP_SHEET_TRANSITION =
  "transition-[top,opacity,box-shadow,border-radius] duration-[500ms] ease-in-out";

type MapSnapPosition = "half" | "full";
type MapSortBy = "DISTANCE" | "RATING";

interface StoreWithDistance extends Store {
  distance?: number;
}

function attachDistanceToStores(
  stores: Store[],
  userLocation: { latitude: number; longitude: number } | null
): StoreWithDistance[] {
  return stores.map((store) => {
    let distance: number | undefined;
    if (userLocation && store.lat && store.lng) {
      distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        store.lat,
        store.lng
      );
    }
    return { ...store, distance };
  });
}

function sortMapStores(
  stores: StoreWithDistance[],
  mapSortBy: MapSortBy
): StoreWithDistance[] {
  if (mapSortBy === "RATING") {
    return [...stores].sort(
      (a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0)
    );
  }
  return [...stores].sort(
    (a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity)
  );
}

export default function RestaurantListingPage(): React.JSX.Element {
  const router = useRouter();
  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategoriesByStoreType(StoreType.RESTAURANT);

  const categories = categoriesData ?? [];

  const searchTimeoutRef = useRef<NodeJS.Timeout>(undefined);
  const sheetScrollRef = useRef<HTMLDivElement>(null);
  const lastSheetScrollTopRef = useRef(0);
  const sheetTouchStartYRef = useRef(0);
  const sheetHandleDraggingRef = useRef(false);
  const [filters, setFilters] = useState<StoreFilters>({
    type: StoreType.RESTAURANT,
    categoryIds: undefined,
  });
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [snapPosition, setSnapPosition] = useState<MapSnapPosition>("half");
  const [isPinSelected, setIsPinSelected] = useState(false);
  const [mapSortBy, setMapSortBy] = useState<MapSortBy>("DISTANCE");

  const [sortBy, setSortBy] = useState<"DISTANCE" | "NEWEST">("NEWEST");

  const [availabilityFilter, setAvailabilityFilter] = useState<
    "all" | "available"
  >("all");

  const storeFilters = {
    ...filters,
    type: StoreType.RESTAURANT,
    categoryIds:
      selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
    lat:
      sortBy === "DISTANCE" && userLocation ? userLocation.latitude : undefined,
    lng:
      sortBy === "DISTANCE" && userLocation
        ? userLocation.longitude
        : undefined,
  };

  const { data: allStoresResult, isLoading } = useStores(
    storeFilters,
    { page: 1, first: 500 },
    true
  );

  const { data: myLevel } = useMyLevel();
  const { user } = useAuthStore();
  const discountPercentage =
    (user?.isPremium ? 15 : myLevel?.discountPercentage) ?? 10;

  const loading = isLoading || categoriesLoading;

  //Fetch user location on mount
  useEffect(() => {
    let mounted = true;

    const fetchLocation = async (): Promise<void> => {
      const location = await getUserLocationSafe();
      if (mounted && location) {
        setUserLocation(location);
      }
    };

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      void fetchLocation();
    }

    return () => {
      mounted = false;
    };
  }, []);

  const mapSheetTop =
    snapPosition === "full" ? MAP_FLOATING_HEADER_HEIGHT : "55%";

  const mapStoresList = useMemo((): StoreWithDistance[] => {
    const withDistance = attachDistanceToStores(
      allStoresResult?.data ?? [],
      userLocation
    );
    return sortMapStores(withDistance, mapSortBy);
  }, [allStoresResult?.data, userLocation, mapSortBy]);

  const toggleMapSheetSnap = (): void => {
    setSnapPosition((prev) => (prev === "half" ? "full" : "half"));
  };

  const handleSheetScroll = (): void => {
    const el = sheetScrollRef.current;
    if (!el) {
      return;
    }
    const top = el.scrollTop;
    if (top > 8) {
      setSnapPosition("full");
    }
    lastSheetScrollTopRef.current = top;
  };

  const handleSheetWheel = (e: React.WheelEvent<HTMLDivElement>): void => {
    const el = sheetScrollRef.current;
    if (!el) {
      return;
    }
    if (snapPosition === "half" && e.deltaY > 0) {
      setSnapPosition("full");
      return;
    }
    if (snapPosition === "full" && el.scrollTop <= 0 && e.deltaY < 0) {
      setSnapPosition("half");
    }
  };

  const handleSheetTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    const touch = e.touches[0];
    if (!touch) {
      return;
    }
    sheetTouchStartYRef.current = touch.clientY;
  };

  const handleSheetTouchEnd = (e: React.TouchEvent<HTMLDivElement>): void => {
    const el = sheetScrollRef.current;
    const touch = e.changedTouches[0];
    if (!el || !touch) {
      return;
    }
    const delta = sheetTouchStartYRef.current - touch.clientY;
    if (snapPosition === "half" && delta > 30) {
      setSnapPosition("full");
      return;
    }
    if (snapPosition === "full" && el.scrollTop <= 0 && delta < -30) {
      setSnapPosition("half");
    }
  };

  const handleSheetHandlePointerDown = (
    e: React.PointerEvent<HTMLButtonElement>
  ): void => {
    sheetTouchStartYRef.current = e.clientY;
    sheetHandleDraggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleSheetHandlePointerMove = (
    e: React.PointerEvent<HTMLButtonElement>
  ): void => {
    if (!sheetHandleDraggingRef.current) {
      return;
    }
    const delta = sheetTouchStartYRef.current - e.clientY;
    if (delta > 24) {
      setSnapPosition("full");
    } else if (delta < -24) {
      setSnapPosition("half");
    }
  };

  const handleSheetHandlePointerUp = (
    e: React.PointerEvent<HTMLButtonElement>
  ): void => {
    if (!sheetHandleDraggingRef.current) {
      return;
    }
    sheetHandleDraggingRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    const delta = sheetTouchStartYRef.current - e.clientY;
    if (Math.abs(delta) < 10) {
      toggleMapSheetSnap();
    } else if (delta > 40) {
      setSnapPosition("full");
    } else if (delta < -40) {
      setSnapPosition("half");
    }
  };

  const handleCategoryClick = (categoryId: string): void => {
    if (categoryId === "all") {
      setSelectedCategoryIds([]);
    } else {
      setSelectedCategoryIds((prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId)
          : [...prev, categoryId]
      );
    }
  };

  const handleSetSearchQuery = (query: string): void => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setSearchQuery(query);
    searchTimeoutRef.current = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: query || undefined,
      }));
    }, 300);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleMapSearchChange = (query: string): void => {
    if (snapPosition !== "full") {
      setSnapPosition("full");
    }
    handleSetSearchQuery(query);
  };

  const handleSortChange = (newSort: "DISTANCE" | "NEWEST") => {
    setSortBy(newSort);
    setShowFilterModal(false);
  };

  const handleAvailabilityFilterChange = (value: "all" | "available") => {
    setAvailabilityFilter(value);
  };

  // const handleMapView = (): void => {
  //   // TODO: Implement map view
  //   alert("¡Vista de mapa próximamente!");
  // };

  const clearFilters = (): void => {
    setSearchQuery("");
    setSelectedCategoryIds([]);
    setSortBy("NEWEST");
    setAvailabilityFilter("all");
    setFilters({
      type: StoreType.RESTAURANT,
    });
  };

  return (
    <BasicLayout>
      <div
        className="fixed left-0 right-0 z-10 flex flex-col overflow-hidden bg-background"
        style={{ top: MAP_PANEL_TOP, bottom: MAP_PANEL_BOTTOM }}
      >
        {/* Back + search — always on top of map and sheet */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-center gap-2 px-3 py-2">
          <Button
            type="button"
            size="icon"
            aria-label="Volver"
            onClick={() => router.back()}
            className="pointer-events-auto h-10 w-10 shrink-0 rounded-full border-0 bg-white text-foreground shadow-md hover:bg-white/95"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </Button>
          <div className="relative min-w-0 flex-1 pointer-events-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              enterKeyHint="search"
              autoComplete="off"
              placeholder="Busca lugares o categorias"
              value={searchQuery}
              onChange={(e) => handleMapSearchChange(e.target.value)}
              onFocus={() => setSnapPosition("full")}
              className="h-11 rounded-full border-border/60 bg-white pl-9 shadow-md"
            />
          </div>
        </div>

        <div className="relative z-0 min-h-0 flex-1 overflow-hidden">
          <div
            className={`absolute inset-x-0 transition-opacity duration-500 ease-in-out ${
              isPinSelected
                ? "inset-y-0 opacity-100"
                : snapPosition === "full"
                  ? "top-0 h-[55%] pointer-events-none opacity-0"
                  : "top-0 h-[55%] opacity-100"
            }`}
          >
            <StoreMap
              stores={mapStoresList}
              height="h-full"
              discountPercentage={discountPercentage}
              onSelectedStoreChange={(store) => setIsPinSelected(!!store)}
              center={
                userLocation
                  ? {
                      lat: userLocation.latitude,
                      lng: userLocation.longitude,
                    }
                  : undefined
              }
            />
          </div>
        </div>

        {!isPinSelected ? (
          <div
            className={`absolute inset-x-0 bottom-0 flex flex-col overflow-hidden bg-card ${MAP_SHEET_TRANSITION} ${
              snapPosition === "full"
                ? "z-30 rounded-none shadow-[0_-4px_24px_rgba(0,0,0,0.12)]"
                : `z-20 ${MAP_SHEET_TOP_RADIUS} shadow-[0_-4px_24px_rgba(0,0,0,0.1)]`
            }`}
            style={{ top: mapSheetTop }}
          >
            <button
              type="button"
              aria-label={
                snapPosition === "half" ? "Expandir lista" : "Mostrar mapa"
              }
              onPointerDown={handleSheetHandlePointerDown}
              onPointerMove={handleSheetHandlePointerMove}
              onPointerUp={handleSheetHandlePointerUp}
              onPointerCancel={handleSheetHandlePointerUp}
              className="flex min-h-11 w-full shrink-0 cursor-grab touch-none items-center justify-center bg-card active:cursor-grabbing"
            >
              <span className="h-1.5 w-12 rounded-full bg-gray-300" />
            </button>

            <div className="z-10 shrink-0 border-b border-border/60 bg-card">
              <CategoryFilterPills
                categories={categories}
                selectedCategoryIds={selectedCategoryIds}
                onCategoryClick={handleCategoryClick}
                isLoading={categoriesLoading}
                allLabel="Todos"
                loadingLabel="Cargando categorías..."
                className="pb-1"
              />

              <div className="flex flex-col gap-2 px-4 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMapSortBy("DISTANCE")}
                    className={`flex w-1/2 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                      mapSortBy === "DISTANCE"
                        ? "bg-[#0f172a] text-white"
                        : "bg-slate-100 text-foreground"
                    }`}
                  >
                    <Map className="h-4 w-4 shrink-0" />
                    Distancia
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapSortBy("RATING")}
                    className={`flex w-1/2 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                      mapSortBy === "RATING"
                        ? "bg-[#0f172a] text-white"
                        : "bg-slate-100 text-foreground"
                    }`}
                  >
                    <Star className="h-4 w-4 shrink-0 fill-current" />
                    Mejor valorado
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {loading ? "" : `${mapStoresList.length} restaurantes`}
                </p>
              </div>
            </div>

            <div
              ref={sheetScrollRef}
              onScroll={handleSheetScroll}
              onWheel={handleSheetWheel}
              onTouchStart={handleSheetTouchStart}
              onTouchEnd={handleSheetTouchEnd}
              className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain touch-pan-y px-4 pb-4 [-webkit-overflow-scrolling:touch]"
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-12">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="text-center text-muted-foreground">
                    Cargando restaurantes...
                  </p>
                </div>
              ) : mapStoresList.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="mb-4 text-lg text-muted-foreground">
                    No se encontraron restaurantes
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Limpiar filtros
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 pt-1">
                  {mapStoresList.map((store) => (
                    <RestaurantCard
                      key={store.id}
                      discountPercentage={discountPercentage}
                      store={store}
                      distance={store.distance}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Filter Modal (Simple) */}
      {showFilterModal ? (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
          onClick={() => setShowFilterModal(false)}
        >
          <div
            className="bg-card rounded-t-3xl p-6 w-full max-w-md animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Filtros</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilterModal(false)}
              >
                Listo
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Ordenar por
                </label>
                <div className="space-y-2">
                  {[
                    { value: "NEWEST", label: "Más recientes" },
                    { value: "DISTANCE", label: "Más cercano" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        handleSortChange(option.value as "DISTANCE" | "NEWEST")
                      }
                      className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                        sortBy === option.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Disponibilidad
                </label>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "Todos" },
                    { value: "available", label: "Disponible ahora" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        handleAvailabilityFilterChange(
                          option.value as "all" | "available"
                        )
                      }
                      className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                        availabilityFilter === option.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={clearFilters}
                variant="outline"
                className="w-full"
              >
                Limpiar todos los filtros
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Availability Guide Modal */}
      {/* <AvailabilityGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      /> */}
    </BasicLayout>
  );
}
