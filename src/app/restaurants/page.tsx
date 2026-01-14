// To integrate this into your Next.js app, create a new route at:
// src/app/restaurants/page.tsx

"use client";

import {
  Search,
  MapPin,
  Filter,
  Map,
  Star,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useStores } from "@/domains/store/hooks";
import { type StoreFilters } from "@/domains/store/type";
import { useMyLevel } from "@/domains/user/hooks/query/useMyLevel";
import { BasicLayout } from "@/layouts/BasicLayout";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Input } from "@/shared/components/Input";

// Restaurant type definition
interface Restaurant {
  id: string;
  slug: string;
  name: string;
  category: string;
  rating: number;
  image: string;
  discount: number;
  distance: string;
}

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

export default function RestaurantListingPage(): React.JSX.Element {
  const [filters, setFilters] = useState<StoreFilters>({
    categoryId: "restaurant",
  });
  const { data: storesResult, isLoading } = useStores(filters);
  const allStores = storesResult?.data ?? [];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "discount">(
    "distance"
  );

  const { data: myLevel } = useMyLevel();

  const restaurants: Restaurant[] = allStores.map((store) => ({
    id: store.id,
    slug: store.id,
    name: store.name,
    category: store.subCategory || "Restaurant",
    rating: store.averageRating ?? 4.5,
    image:
      store.imageUrl ||
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&auto=format&fit=crop",
    discount: myLevel?.discountPercentage ?? 10, // Default discount
    distance: "N/A", // Distance calculation would need geolocation
  }));

  const handleCategoryClick = (subCategory: string): void => {
    setSelectedSubCategory(subCategory);
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
                  : `${restaurants.length} restaurantes encontrados`}
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
                {restaurants.length === 0 ? (
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
                  restaurants.map((restaurant, index) => (
                    <Link
                      key={restaurant.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                      href={`/stores/${restaurant.id}`}
                    >
                      <Card className="overflow-hidden cursor-pointer transition-all hover:shadow-card hover:scale-[1.02] bg-card border-border">
                        {/* Restaurant Image */}
                        <div className="relative">
                          <Image
                            src={restaurant.image}
                            alt={restaurant.name}
                            width={400}
                            height={192}
                            className="w-full h-48 object-cover"
                            unoptimized
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "https://placehold.co/400x192/fef2f2/f87171?text=Restaurant+Image";
                            }}
                          />
                          {/* Discount Badge */}
                          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                            {restaurant.discount}% OFF
                          </div>
                        </div>

                        {/* Restaurant Info */}
                        <div className="p-4">
                          <h3 className="font-bold text-lg text-foreground mb-1">
                            {restaurant.name}
                          </h3>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            {/* Rating and Category */}
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-primary text-primary" />
                              <span className="font-medium text-foreground">
                                {restaurant.rating}
                              </span>
                              <span>• {restaurant.category}</span>
                            </div>

                            {/* Distance */}
                            {/* <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{restaurant.distance}</span>
                            </div> */}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
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
    </BasicLayout>
  );
}
