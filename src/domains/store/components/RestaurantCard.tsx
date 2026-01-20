import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Store } from "@/lib/api-types";
import { Card } from "@/shared/components/Card";

import type { Restaurant } from "../type";

export const RestaurantCard = ({
  discountPercentage,
  store,
}: {
  discountPercentage: number;
  store: Store;
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
    distance: "N/A",
    availabilityStatus: store.discountAvailabilityStatus ?? "unavailable",
    availabilityText: store.discountAvailabilityText,
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
          {/* <AvailabilityStatusBadge
            className="absolute top-3 left-3 flex items-center gap-2 max-w-30 md:max-w-none"
            status={restaurant.availabilityStatus}
          /> */}
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
            {/* Availability Indicator */}
            {/* <AvailabilityStatusBadge
              className="flex items-center gap-2 max-w-30 md:max-w-none"
              status={restaurant.availabilityStatus}
            /> */}
          </div>
        </div>
      </Card>
    </Link>
  );
};
