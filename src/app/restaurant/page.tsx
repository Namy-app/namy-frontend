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

export default function RestaurantListingPage(): React.JSX.Element {
  const { data: storesResult, isLoading } = useStores();
  const allStores = storesResult?.data ?? [];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "discount">(
    "distance"
  );

  // Filter stores to only show restaurants (categoryId === "Food & Beverage")
  const restaurants: Restaurant[] = allStores
    .filter((store) => store.categoryId?.toLowerCase() === "food & beverage")
    .map((store) => ({
      id: store.id,
      slug: store.id,
      name: store.name,
      category: store.subCategory || "Restaurant",
      rating: store.averageRating ?? 4.5,
      image:
        store.imageUrl ||
        "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&auto=format&fit=crop",
      discount: 15, // Default discount
      distance: "N/A", // Distance calculation would need geolocation
    }));

  // Filter and sort restaurants
  const filteredRestaurants = restaurants
    .filter((restaurant) => {
      const matchesSearch =
        searchQuery === "" ||
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || restaurant.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "distance") {
        return parseFloat(a.distance) - parseFloat(b.distance);
      } else if (sortBy === "rating") {
        return b.rating - a.rating;
      } else if (sortBy === "discount") {
        return b.discount - a.discount;
      }
      return 0;
    });

  const handleCategoryClick = (category: string): void => {
    setSelectedCategory(category);
  };

  const handleMapView = (): void => {
    // TODO: Implement map view
    alert("Map view coming soon!");
  };

  const clearFilters = (): void => {
    setSearchQuery("");
    setSelectedCategory("All");
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
                  placeholder="Search restaurants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-card border-border hover:border-primary"
                  }`}
                  variant={
                    selectedCategory === category ? "default" : "outline"
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
                {filteredRestaurants.length} restaurants found
              </p>
              <div className="flex items-center gap-2">
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
                  <option value="distance">Nearest</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Best Discount</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading restaurants...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Restaurant Grid */}
              <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {filteredRestaurants.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground text-lg mb-4">
                      No restaurants found matching your criteria
                    </p>
                    <Button onClick={clearFilters} variant="outline">
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  filteredRestaurants.map((restaurant, index) => (
                    <Link
                      key={restaurant.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                      href={`/restaurant/${restaurant.id}`}
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
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{restaurant.distance}</span>
                            </div>
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
              <h3 className="text-xl font-bold text-foreground">Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilterModal(false)}
              >
                Done
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Sort By
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
                      {option === "distance" && "Nearest First"}
                      {option === "rating" && "Highest Rated"}
                      {option === "discount" && "Best Discount"}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={clearFilters}
                variant="outline"
                className="w-full"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </BasicLayout>
  );
}
