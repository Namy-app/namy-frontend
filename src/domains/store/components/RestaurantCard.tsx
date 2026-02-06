import { Star, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Store } from "@/lib/api-types";
import { Card } from "@/shared/components/Card";

import type { Restaurant } from "../type";

export const RestaurantCard = ({
  discountPercentage,
  store,
  distance,
}: {
  discountPercentage: number;
  store: Store;
  distance?: number;
}) => {
  const restaurant: Restaurant = {
    id: store.id,
    slug: store.id,
    name: store.name,
    category: store.subCategory || "Restaurant",
    rating: store.averageRating ?? 4.5,
    image:
      store.imageUrl ||
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&auto=format&fit=crop",
    discount: discountPercentage,
    distance: distance !== undefined ? `${distance.toFixed(1)} km` : "N/A",
    availabilityStatus: store.discountAvailabilityStatus ?? "unavailable",
    availabilityText: store.discountAvailabilityText,
  };

  const getAvailabilityBadge = () => {
    switch (restaurant.availabilityStatus) {
      case "available":
        return (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Disponible
          </div>
        );
      case "soon":
        return (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            En {restaurant.availabilityText}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Link
      key={restaurant.id}
      className="animate-slide-up"
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
          <div className="absolute top-4 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full font-bold text-sm shadow-lg">
            {restaurant.discount}% OFF
          </div>

          {/* Availability Indicator */}
          {getAvailabilityBadge()}
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
            {restaurant.distance !== "N/A" && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span className="text-xs">{restaurant.distance}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};
