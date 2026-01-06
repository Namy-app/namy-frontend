"use client";

import Image from "next/image";
import Link from "next/link";

import { InfoCard } from "@/components/InfoCard";
import { PlaceHolderTypeEnum } from "@/data/constants";
import { type Store } from "@/lib/api-types";
import { getInitials } from "@/lib/user.lib";
import { Card } from "@/shared/components/Card";
import { useStoresStore } from "@/store/useStoresStore";

export function NearbyPlaces({
  closestStores = [],
  isLoading = true,
  discountPercentage = 10,
}: Readonly<{
  closestStores?: Store[];
  isLoading?: boolean;
  discountPercentage?: number;
}>): React.JSX.Element {
  const { setStoreId } = useStoresStore();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-24 bg-card rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }
  return (
    <div className="mb-8">
      <div className="px-6">
        <h2 className="text-xl font-bold mb-4 text-foreground">
          📍 Cerca de ti
        </h2>
        {closestStores.length === 0 ? (
          <InfoCard
            title="No hay tiendas cercanas"
            summary="Vuelve pronto para ver tiendas disponibles cerca de ti"
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {closestStores.map((place: Store) => (
              <Card key={place.id} className="shadow-md group">
                <Link
                  href={`/restaurants/${place.id}`}
                  onClick={() => setStoreId(place.id)}
                  className="flex items-center gap-4 p-3 cursor-pointer hover:shadow-glow transition-all border-0 "
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    {place.imageUrl ? (
                      <Image
                        src={place.imageUrl}
                        alt={place.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 text-3xl tracking-widest flex items-center justify-center text-gray-400">
                        <Image
                          src={
                            place.categoryId?.toLowerCase() === "restaurant"
                              ? PlaceHolderTypeEnum.RESTAURANT
                              : PlaceHolderTypeEnum.SHOP
                          }
                          alt={place.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                        {getInitials(place.name)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-1">
                      {place.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>A {place.distance} km</span>
                      <span className="text-primary font-semibold">
                        &bull; - %{discountPercentage} con Ñamy
                      </span>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
