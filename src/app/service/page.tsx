"use client";

import { Grid3x3, Map, MapPin, Search, Star, Info } from "lucide-react";
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
import { useAuthStore } from "@/store/useAuthStore";

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
  availabilityStatus: "available" | "soon" | "unavailable";
  availabilityText?: string;
}

// Note: Now using calculateAvailabilityStatus from availability-utils
// which uses real openDays data from the backend

// (Removed unused mock data to satisfy TypeScript noUnusedLocals)

export type ViewMode = "grid" | "map";

let timeout: NodeJS.Timeout;

export default function ServicesPage(): React.JSX.Element {
  const [filters, setFilters] = useState<StoreFilters>({
    noRestaurants: true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [_, setShowGuideModal] = useState(false);

  const { data: storesResult, isLoading } = useStores(filters);
  const { user } = useAuthStore();
  const { data: myLevel } = useMyLevel();
  const allStores = storesResult?.data ?? [];
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const discountPercentage =
    (user?.isPremium ? 15 : myLevel?.discountPercentage) ?? 10;

  // Create a component to handle individual service availability
  const ServiceCard = ({ store }: { store: (typeof allStores)[0] }) => {
    const service: Service = {
      id: store.id,
      slug: store.id,
      name: store.name,
      image:
        store.imageUrl ||
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop",
      category: store.categoryId || "Service",
      discount: discountPercentage,
      rating: store.averageRating ?? 4.7,
      distance: "N/A",
      availabilityStatus: store.discountAvailabilityStatus ?? "unavailable",
      availabilityText: store.discountAvailabilityText,
    };

    return (
      <Link href={`/stores/${service.id}`} key={service.id}>
        <Card className="overflow-hidden hover:shadow-card hover:scale-[1.02] transition-all cursor-pointer bg-card border-border">
          <div className="relative">
            <Image
              src={service.image}
              alt={service.name}
              width={400}
              height={240}
              className="w-full h-60 object-cover"
              unoptimized
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://placehold.co/400x240/fef2f2/f87171?text=Service+Image";
              }}
            />
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-bold text-sm shadow-lg">
              {service.discount}% OFF
            </div>

            {/* Availability Indicator */}
            {/* <div className="absolute top-3 left-3 flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  service.availabilityStatus === "available"
                    ? "bg-green-500"
                    : service.availabilityStatus === "soon"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              />
              {service.availabilityStatus === "soon" &&
              service.availabilityText ? (
                <span className="bg-black/70 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                  {service.availabilityText}
                </span>
              ) : null}
            </div> */}
          </div>

          <div className="p-4">
            <h3 className="font-bold text-lg text-foreground mb-2">
              {service.name}
            </h3>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="font-medium text-foreground">
                  {service.rating}
                </span>
                <span>• {service.category}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{service.distance}</span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
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
                {allStores.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground text-lg mb-4">
                      No services found
                    </p>
                  </div>
                ) : (
                  allStores.map((store) => (
                    <ServiceCard key={store.id} store={store} />
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

      {/* Availability Guide Modal */}
      {/* <AvailabilityGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      /> */}
    </BasicLayout>
  );
}
