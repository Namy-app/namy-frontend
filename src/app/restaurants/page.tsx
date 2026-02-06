// To integrate this into your Next.js app, create a new route at:
// src/app/restaurants/page.tsx

"use client";

import {
  Search,
  MapPin,
  Map,
  SlidersHorizontal,
  Info,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  Clock,
  Navigation,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";

import { RestaurantCard } from "@/domains/store/components/RestaurantCard";
import { useStores } from "@/domains/store/hooks";
import { type StoreFilters } from "@/domains/store/type";
import { useMyLevel } from "@/domains/user/hooks/query/useMyLevel";
import { BasicLayout } from "@/layouts/BasicLayout";
import type { Store } from "@/lib/api-types";
import { getUserLocationSafe } from "@/lib/utils";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { useAuthStore } from "@/store/useAuthStore";

import { type ViewMode } from "../service/page";

// Note: Now using calculateAvailabilityStatus from availability-utils
// which uses real openDays data from the backend

// (Removed unused mock data to satisfy TypeScript noUnusedLocals)

const categories = [
  "All",
  "Tacos",
  "Pizza",
  "Healthy",
  "Coffee",
  "Burgers",
  "Sushi",
  "Thai",
  "Mediterranean",
  "Steakhouse",
];

let timeout: NodeJS.Timeout;

const ITEMS_PER_PAGE = 12;

//Haversine formula for distance calculation
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; //earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

interface StoreWithDistance extends Store {
  distance?: number;
}

export default function RestaurantListingPage(): React.JSX.Element {
  const [filters, setFilters] = useState<StoreFilters>({
    categoryId: "restaurant",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    "loading" | "granted" | "unavailable" | "denied"
  >("loading");
  const [locationName, setLocationName] = useState<string | null>(null);

  const { data: storesResult, isLoading } = useStores(filters, {
    page: currentPage,
    first: ITEMS_PER_PAGE,
  });
  const paginationInfo = storesResult?.paginationInfo;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [_, setShowGuideModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const [sortBy, setSortBy] = useState<"distance" | "newest">("newest");

  const [availabilityFilter, setAvailabilityFilter] = useState<
    "all" | "available"
  >("all");

  const { data: myLevel } = useMyLevel();
  const { user } = useAuthStore();
  const discountPercentage =
    (user?.isPremium ? 15 : myLevel?.discountPercentage) ?? 10;

  //Fetch user location on mount
  useEffect(() => {
    const fetchLocation = async () => {
      setLocationStatus("loading");
      const location = await getUserLocationSafe();
      if (location) {
        setUserLocation(location);
        setLocationStatus("granted");
        //Update filters with location for backend sorting
        setFilters((prev) => ({
          ...prev,
          lat: location.latitude,
          lng: location.longitude,
        }));

        // Reverse geocode to get location name
        void (async () => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}&zoom=10`
            );
            const data = await response.json();
            const city =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.state ||
              "Tu ubicación";
            setLocationName(city);
          } catch (error) {
            console.error("Failed to get location name:", error);
            setLocationName("Tu ubicación");
          }
        })();
      } else {
        setLocationStatus("denied");
      }
    };

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      void fetchLocation();
      return undefined;
    } else {
      // Use setTimeout to defer state update and avoid synchronous setState in effect
      const timeoutId = setTimeout(() => {
        setLocationStatus("unavailable");
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  //calculate distances and apply client-side sorting,
  const displayedStores = useMemo((): StoreWithDistance[] => {
    const allStores = storesResult?.data ?? [];
    let stores: StoreWithDistance[] = allStores.map((store) => {
      let distance: number | undefined;

      if (userLocation && store.lat && store.lng) {
        distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          store.lat,
          store.lng
        );
      }

      return {
        ...store,
        distance,
      };
    });

    //Apply availability filter
    if (availabilityFilter === "available") {
      stores = stores.filter(
        (store) => store.discountAvailabilityStatus === "available"
      );
    }

    //Apply sorting
    if (sortBy === "distance" && userLocation) {
      stores.sort((a, b) => (a.distance ?? 999999) - (b.distance ?? 999999));
    } else if (sortBy === "newest") {
      // Sort by Newest first (descending order by createdAt)
      stores.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
    }
    return stores;
  }, [storesResult?.data, userLocation, sortBy, availabilityFilter]);

  const handleCategoryClick = (subCategory: string): void => {
    setSelectedSubCategory(subCategory);
    setCurrentPage(1);
    setFilters((prev) => ({
      ...prev,
      subCategory: subCategory === "All" ? undefined : subCategory,
    }));
  };

  const handleSetSearchQuery = (query: string): void => {
    if (timeout) {
      clearTimeout(timeout);
    }

    setSearchQuery(query);
    timeout = setTimeout(() => {
      setCurrentPage(1);
      setFilters((prev) => ({
        ...prev,
        search: query || undefined,
      }));
    }, 300);
  };

  const handleSortChange = (newSort: "distance" | "newest") => {
    setSortBy(newSort);
    setShowFilterModal(false);
  };

  const handleAvailabilityFilterChange = (value: "all" | "available") => {
    setAvailabilityFilter(value);
    setCurrentPage(1);
  };

  // const handleMapView = (): void => {
  //   // TODO: Implement map view
  //   alert("¡Vista de mapa próximamente!");
  // };

  const clearFilters = (): void => {
    setSearchQuery("");
    setSelectedSubCategory("All");
    setSortBy("newest");
    setAvailabilityFilter("all");
    setCurrentPage(1);
    setFilters((prev) => ({
      categoryId: "restaurant",
      lat: prev.lat,
      lng: prev.lng,
    }));
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const requestLocation = async () => {
    setLocationStatus("loading");

    try {
      // Use the non-safe version to see the actual error
      const location = await getUserLocationSafe();
      if (location) {
        setUserLocation(location);
        setLocationStatus("granted");
        setFilters((prev) => ({
          ...prev,
          lat: location.latitude,
          lng: location.longitude,
        }));

        // Reverse geocode to get location name
        void (async () => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}&zoom=10`
            );
            const data = await response.json();
            const city =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.state ||
              "Tu ubicación";
            setLocationName(city);
          } catch (error) {
            console.error("Failed to get location name:", error);
            setLocationName("Tu ubicación");
          }
        })();
      } else {
        // If getUserLocationSafe returns null, it means permission was denied
        setLocationStatus("denied");

        // Show instructions to user
        alert(
          "Para activar la ubicación:\n\n" +
            "1. Haz clic en el ícono de candado/información en la barra de direcciones\n" +
            "2. Encuentra 'Ubicación' o 'Location'\n" +
            "3. Cambia a 'Permitir' o 'Allow'\n" +
            "4. Recarga la página"
        );
      }
    } catch (error) {
      console.error("Location error:", error);
      setLocationStatus("denied");
    }
  };

  return (
    <BasicLayout>
      <div className="pt-14">
        <div className="min-h-screen bg-gradient-hero">
          {/* Header Section with Search */}
          <div className="p-6 pb-8 ">
            <h1 className="text-3xl font-bold text-foreground text-center mb-2">
              Promos en restaurantes
            </h1>

            <div className="max-w-5xl mx-auto">
              <div className="flex items-center h-10 justify-center mb-6">
                <div className="flex flex-col items-center gap-1 text-muted-foreground text-sm mt-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {locationStatus === "granted" ? (
                      <span className="text-foreground font-medium">
                        {locationName || "Obteniendo ubicación..."}
                      </span>
                    ) : locationStatus === "loading" ? (
                      <span>Obteniendo ubicación...</span>
                    ) : locationStatus === "denied" ? (
                      <span className="text-amber-600">
                        Ubicación bloqueada
                      </span>
                    ) : (
                      <span>Ubicación desactivada</span>
                    )}
                  </div>
                  {locationStatus === "denied" && (
                    <button
                      onClick={() => void requestLocation()}
                      className="text-xs text-primary underline hover:no-underline"
                    >
                      ¿Cómo activar?
                    </button>
                  )}
                  {locationStatus === "unavailable" && (
                    <button
                      onClick={() => void requestLocation()}
                      className="text-primary underline hover:no-underline"
                    >
                      Activar ubicación
                    </button>
                  )}
                </div>
              </div>

              {/* <div className="flex items-center h-10 justify-center mb-6">
                <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>Cancún, Quintana Roo</span>
                </div>
              </div> */}

              {/* View Mode Toggle */}
              <div className="flex gap-2 justify-center my-4">
                <Button
                  onClick={() => setShowGuideModal(true)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Info className="w-4 h-4" />
                  Guía
                </Button>
                <Button
                  onClick={() => setViewMode("grid")}
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                >
                  <Grid3x3 className="w-4 h-4" />
                  Grid
                </Button>
                <Button
                  onClick={() => setViewMode("map")}
                  variant={viewMode === "map" ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                >
                  <Map className="w-4 h-4" />
                  Mapa
                </Button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar restaurantes..."
                  value={searchQuery}
                  onChange={(e) => handleSetSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-card border-border rounded-2xl"
                />
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="px-6 -mt-4 mb-4 max-w-5xl mx-auto">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`rounded-full whitespace-nowrap ${
                    selectedSubCategory === category
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-card border-border hover:border-primary"
                  }`}
                  variant={
                    selectedSubCategory === category ? "default" : "outline"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Availability Filter + Sort Options */}
          <div className="px-6 mb-6 max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Available Right Now Filter */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() =>
                    handleAvailabilityFilterChange(
                      availabilityFilter === "all" ? "available" : "all"
                    )
                  }
                  variant={
                    availabilityFilter === "available" ? "default" : "outline"
                  }
                  size="sm"
                  className="gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Disponible ahora
                </Button>
                {sortBy === "distance" && locationStatus === "granted" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    disabled
                  >
                    <Navigation className="w-4 h-4" />
                    Ordenando por cercanía
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  {isLoading
                    ? "Cargando..."
                    : `${displayedStores.length} restaurantes`}
                </p>
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      handleSortChange(e.target.value as "distance" | "newest")
                    }
                    className="text-sm bg-transparent text-foreground border border-border rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                  >
                    <option value="newest">Más recientes</option>
                    <option value="distance">Más cercano</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Cargando restaurantes...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Restaurant Grid */}
              <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {displayedStores.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground text-lg mb-4">
                      No se encontraron restaurantes que coincidan con tus
                      criterios
                    </p>
                    <Button onClick={clearFilters} variant="outline">
                      Limpiar filtros
                    </Button>
                  </div>
                ) : (
                  displayedStores.map((store) => (
                    <RestaurantCard
                      key={store.id}
                      discountPercentage={discountPercentage}
                      store={store}
                      distance={store.distance}
                    />
                  ))
                )}
              </div>

              {/* Pagination */}
              {paginationInfo && paginationInfo.totalPages > 1 ? (
                <div className="px-6 py-8 max-w-5xl mx-auto">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!paginationInfo.hasPreviousPage}
                      className="gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Anterior
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: paginationInfo.totalPages },
                        (_, i) => i + 1
                      )
                        .filter((page) => {
                          const distance = Math.abs(page - currentPage);
                          return (
                            distance === 0 ||
                            distance === 1 ||
                            page === 1 ||
                            page === paginationInfo?.totalPages
                          );
                        })
                        .map((page, index, array) => {
                          const prevPage = array[index - 1];
                          const showEllipsisBefore =
                            index > 0 &&
                            prevPage !== undefined &&
                            page - prevPage > 1;
                          return (
                            <span key={page} className="flex items-center">
                              {showEllipsisBefore ? (
                                <span className="px-2 text-muted-foreground">
                                  ...
                                </span>
                              ) : null}
                              <Button
                                variant={
                                  currentPage === page ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => handlePageChange(page)}
                                className="min-w-10"
                              >
                                {page}
                              </Button>
                            </span>
                          );
                        })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!paginationInfo.hasNextPage}
                      className="gap-1"
                    >
                      Siguiente
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Página {paginationInfo.page} de {paginationInfo.totalPages}{" "}
                    ({paginationInfo.total} restaurantes)
                  </p>
                </div>
              ) : null}
            </>
          )}
        </div>
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
                    { value: "newest", label: "Más recientes" },
                    { value: "distance", label: "Más cercano" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        handleSortChange(option.value as "distance" | "newest")
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
