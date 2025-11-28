"use client";

import { Grid3x3, Map, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { BottomNavigation } from "@/app/explore/components/BottomNavigation";
import { ExploreHeader } from "@/app/explore/components/ExploreHeader";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { useAuthStore } from "@/store/useAuthStore";

// Mock data - replace with actual API call
const servicesData = [
  {
    id: "1",
    slug: "zen-spa-wellness",
    name: "Zen Spa & Wellness",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop",
    category: "Spa",
    discount: 25,
    rating: 4.8,
    distance: "0.5 km",
  },
  {
    id: "2",
    slug: "elite-barber-shop",
    name: "Elite Barber Shop",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop",
    category: "Barber",
    discount: 20,
    rating: 4.9,
    distance: "0.8 km",
  },
  {
    id: "3",
    slug: "glamour-hair-salon",
    name: "Glamour Hair Salon",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop",
    category: "Hair Salon",
    discount: 30,
    rating: 4.7,
    distance: "1.2 km",
  },
  {
    id: "4",
    slug: "relax-massage-center",
    name: "Relax Massage Center",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop",
    category: "Spa",
    discount: 15,
    rating: 4.6,
    distance: "1.5 km",
  },
  {
    id: "5",
    slug: "classic-cuts-barber",
    name: "Classic Cuts Barber",
    image:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&auto=format&fit=crop",
    category: "Barber",
    discount: 20,
    rating: 4.8,
    distance: "2.0 km",
  },
  {
    id: "6",
    slug: "beauty-boulevard-salon",
    name: "Beauty Boulevard Salon",
    image:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop",
    category: "Hair Salon",
    discount: 25,
    rating: 4.9,
    distance: "2.3 km",
  },
];

type ViewMode = "grid" | "map";

export default function ServicesPage(): React.JSX.Element {
  const { isAuthenticated } = useAuthStore();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  //   const handleServiceClick = (serviceId: string): void => {
  //     router.push(`ser${serviceId}`);
  //   };

  return (
    <div className="min-h-screen bg-background pb-20">
      <ExploreHeader isAuthenticated={isAuthenticated} />

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
            {viewMode === "grid" ? (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servicesData.map((service, index) => (
                  <Card
                    key={service.id}
                    // onClick={() => handleServiceClick(service.slug)}
                    className="overflow-hidden cursor-pointer transition-all hover:shadow-card hover:scale-[1.02] bg-card border-border animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Link href={`service/${service.slug}`}>
                      {/* Image */}
                      <div className="relative">
                        <Image
                          src={service.image}
                          alt={service.name}
                          width={800}
                          height={400}
                          className="w-full h-48 object-cover"
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
                ))}
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

      <BottomNavigation />
    </div>
  );
}
