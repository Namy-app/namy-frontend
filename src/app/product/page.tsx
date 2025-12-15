"use client";

import { Search, MapPin, Star, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useStores } from "@/domains/store/hooks";
import { BasicLayout } from "@/layouts/BasicLayout";
import { type Store } from "@/lib/api-types";
import { Card } from "@/shared/components/Card";
import { Input } from "@/shared/components/Input";

export default function ProductListingPage(): React.JSX.Element {
  const { data: storesResult, isLoading } = useStores();
  const allStores = storesResult?.data ?? [];

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "discount">(
    "distance"
  );

  // Filter stores to only show service type
  const products: Store[] = allStores.filter(
    (store) => store.type === "service"
  );

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false);
    return matchesSearch;
  });

  return (
    <BasicLayout>
      <div className="pt-4 pb-20">
        {/* Search Bar */}
        <div className="px-6 mb-6 max-w-5xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
        </div>

        {/* Sort Bar */}
        <div className="px-6 mb-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} services found
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
              <p className="text-muted-foreground">Loading services...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground text-lg mb-4">
                    No services found matching your search
                  </p>
                </div>
              ) : (
                filteredProducts.map((product, index) => (
                  <Link
                    key={product.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    href="/product/detail"
                  >
                    <Card className="overflow-hidden cursor-pointer transition-all hover:shadow-card hover:scale-[1.02] bg-card border-border">
                      {/* Product Image */}
                      <div className="relative">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            width={400}
                            height={192}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-linear-to-br from-cyan-400 via-emerald-400 to-green-500" />
                        )}
                        {/* Discount Badge */}
                        <div className="absolute top-3 right-3 bg-secondary text-secondary-foreground px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                          View Details
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-foreground mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                          {product.description || "No description"}
                        </p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          {/* Rating */}
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-secondary text-secondary" />
                            <span className="font-medium text-foreground">
                              {product.averageRating ?? 4.5}
                            </span>
                          </div>

                          {/* Address */}
                          {product.address ? (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate text-xs">
                                {product.address}
                              </span>
                            </div>
                          ) : null}
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
    </BasicLayout>
  );
}
