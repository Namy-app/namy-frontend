// To integrate this into your Next.js app, create a new route at:
// src/app/restaurants/page.tsx

"use client";

import {
  Search,
  MapPin,
  Filter,
  Map,
  SlidersHorizontal,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { RestaurantCard } from "@/domains/store/components/RestaurantCard";
import { useStores } from "@/domains/store/hooks";
import { type StoreFilters } from "@/domains/store/type";
import { useMyLevel } from "@/domains/user/hooks/query/useMyLevel";
import { BasicLayout } from "@/layouts/BasicLayout";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { useAuthStore } from "@/store/useAuthStore";

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

export default function RestaurantListingPage(): React.JSX.Element {
  const [filters, setFilters] = useState<StoreFilters>({
    categoryId: "restaurant",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const { data: storesResult, isLoading } = useStores(filters, {
    page: currentPage,
    first: ITEMS_PER_PAGE,
  });
  const allStores = storesResult?.data ?? [];
  const paginationInfo = storesResult?.paginationInfo;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [_, setShowGuideModal] = useState(false);
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "discount">(
    "distance"
  );

  const { data: myLevel } = useMyLevel();
  const { user } = useAuthStore();
  const discountPercentage =
    (user?.isPremium ? 15 : myLevel?.discountPercentage) ?? 10;

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

  const handleMapView = (): void => {
    // TODO: Implement map view
    alert("¡Vista de mapa próximamente!");
  };

  const clearFilters = (): void => {
    setSearchQuery("");
    setSelectedSubCategory("All");
    setSortBy("distance");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <BasicLayout>
      <div className="pt-14 pb-16 ">
        <div className="min-h-screen bg-background pb-20">
          {/* Header Section with Search */}
          <div className="bg-gradient-hero p-6 pb-8 ">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Image
                    src="/namy-logo.webp"
                    alt="Ñamy Logo"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-xl object-cover shadow-card"
                  />
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">Amy</h1>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>Cancún, Quintana Roo</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setShowGuideModal(true)}
                  >
                    <Info className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={handleMapView}
                  >
                    <Map className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setShowFilterModal(!showFilterModal)}
                  >
                    <Filter className="w-5 h-5" />
                  </Button>
                </div>
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
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
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

          {/* Sort Options */}
          <div className="px-6 mb-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {isLoading
                  ? "Cargando..."
                  : `${allStores.length} restaurantes encontrados`}
              </p>
              {/* <div className="flex items-center gap-2"> */}
              <div className="hidden items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as "distance" | "rating" | "discount"
                    )
                  }
                  className="text-sm bg-transparent text-foreground border-none focus:outline-none cursor-pointer"
                >
                  <option value="distance">Mas cercano</option>
                  <option value="rating">Mejor valorado</option>
                  <option value="discount">Mejor descuento</option>
                </select>
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
                {allStores.length === 0 ? (
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
                  allStores.map((store) => (
                    <RestaurantCard
                      key={store.id}
                      discountPercentage={discountPercentage}
                      store={store}
                    />
                  ))
                )}
              </div>

              {/* Pagination */}
              {paginationInfo && paginationInfo.totalPages > 1 ? <div className="px-6 py-8 max-w-5xl mx-auto">
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
                              {showEllipsisBefore ? <span className="px-2 text-muted-foreground">
                                  ...
                                </span> : null}
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
                </div> : null}
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
                  {["distance", "rating", "discount"].map((option) => (
                    <button
                      key={option}
                      onClick={() => setSortBy(option as typeof sortBy)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                        sortBy === option
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {option === "distance" && "Más cercano"}
                      {option === "rating" && "Mejor valorado"}
                      {option === "discount" && "Mejor descuento"}
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
