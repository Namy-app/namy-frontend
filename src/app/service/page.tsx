"use client";

import { Grid3x3, Map, MapPin, Search, Star } from "lucide-react";
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

// Service type definition
interface Service {
  id: string;
  slug: string;
  name: string;
  image: string;
  category: string;
  discount: number;
  rating: number;
  distance: string;
}

// (Removed unused mock data to satisfy TypeScript noUnusedLocals)

type ViewMode = "grid" | "map";

let timeout: NodeJS.Timeout;

export default function ServicesPage(): React.JSX.Element {
  const [filters, setFilters] = useState<StoreFilters>({
    noRestaurants: true,
    active: true,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const { data: storesResult, isLoading } = useStores(filters);
  const { data: myLevel } = useMyLevel();
  const allStores = storesResult?.data ?? [];
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const servicesData: Service[] = allStores.map((store) => ({
    id: store.id,
    slug: store.id,
    name: store.name,
    image:
      store.imageUrl ||
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop",
    category: store.categoryId || "Service",
    discount: myLevel?.discountPercentage ?? 10,
    rating: store.averageRating ?? 4.7,
    distance: "N/A", // Distance calculation would need geolocation
  }));

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

  return (
    <BasicLayout className="pb-20">
      <div className="pt-14 pb-16">
        {/* Hero Section */}
        <div className="bg-gradient-hero p-6 pb-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground text-center mb-2">
              Promos en Servicios
            </h1>
            <p className="text-muted-foreground text-center">
              Spas, barberías y salones de belleza
            </p>
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar servicios..."
                value={searchQuery}
                onChange={(e) => handleSetSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-card border-border rounded-2xl"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 justify-center mt-4">
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

            {/* Services Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading services...</p>
                </div>
              </div>
            ) : viewMode === "grid" ? (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servicesData.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground text-lg mb-4">
                      No services found
                    </p>
                  </div>
                ) : (
                  servicesData.map((service, index) => (
                    <Card
                      key={service.id}
                      className="overflow-hidden cursor-pointer transition-all hover:shadow-card hover:scale-[1.02] bg-card border-border animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <Link href={`/stores/${service.id}`}>
                        {/* Image */}
                        <div className="relative">
                          <Image
                            src={service.image}
                            alt={service.name}
                            width={800}
                            height={400}
                            className="w-full h-48 object-cover"
                            unoptimized
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "https://placehold.co/800x400/e2e8f0/64748b?text=Service+Image";
                            }}
                          />
                          <div className="absolute top-3 right-3 bg-[hsl(var(--services))] text-[hsl(var(--services-foreground))] px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                            {service.discount}% OFF
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-bold text-lg text-foreground mb-1">
                            {service.name}
                          </h3>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            {/* Rating & Category */}
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-[hsl(var(--services))] text-[hsl(var(--services))]" />
                              <span className="font-medium text-foreground">
                                {service.rating}
                              </span>
                              <span>• {service.category}</span>
                            </div>

                            {/* Distance */}
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{service.distance}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </Card>
                  ))
                )}
              </div>
            ) : (
              /* Map View Placeholder */
              <div className="p-6">
                <Card className="p-8 text-center">
                  <Map className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Map View Coming Soon
                  </h3>
                  <p className="text-muted-foreground">
                    We are working on an interactive map view to help you find
                    services near you.
                  </p>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </BasicLayout>
  );
}
