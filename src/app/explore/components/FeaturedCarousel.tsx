"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { InfoCard } from "@/components/InfoCard";
import { PlaceHolderTypeEnum } from "@/data/constants";
import { type Store } from "@/lib/api-types";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";

export function FeaturedCarousel({
  discountPercentage = 10,
  isLoading,
  stores,
}: {
  discountPercentage?: number;
  isLoading?: boolean;
  stores?: Store[];
}): React.JSX.Element {
  const allStores = stores ?? [];
  const [currentSlide, setCurrentSlide] = useState(0);

  // Get first 6 stores for carousel
  const featuredItems: Store[] = allStores.slice(0, 6);
  const itemsPerPage = 2;
  const maxSlide = Math.max(0, featuredItems.length - itemsPerPage);

  const nextSlide = (): void => {
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlide));
  };

  const prevSlide = (): void => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  if (isLoading) {
    return (
      <div className="mb-8 px-6">
        <h2 className="text-xl font-bold mb-4 text-foreground">
          🌟 Destacados
        </h2>
        <div className="h-64 bg-card rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="px-6">
        <h2 className="text-xl font-bold mb-4 text-foreground">
          🌟 Destacados
        </h2>
        {featuredItems.length > 0 ? (
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex gap-x-6 transition-transform duration-300 ease-in-out"
                style={{
                  transform: `translateX(-${currentSlide * (100 / itemsPerPage)}%)`,
                }}
              >
                {featuredItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/stores/${item.id}`}
                    className="shrink-0 w-1/2 group"
                  >
                    <Card className="relative h-48 overflow-hidden cursor-pointer group border-0 shadow-lg rounded-3xl">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <Image
                          src={
                            item.categoryId?.toLowerCase() === "restaurant"
                              ? PlaceHolderTypeEnum.RESTAURANT
                              : PlaceHolderTypeEnum.SHOP
                          }
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                        <p className="text-sm text-white/90">
                          {discountPercentage}% de descuento hoy
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={cn(
                "absolute h-10 w-10 rounded-full top-1/2 -translate-y-1/2 left-2 bg-white shadow-lg hover:bg-white hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-border z-10",
                {
                  hidden: currentSlide === 0 || featuredItems.length === 0,
                }
              )}
            >
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
                className="h-5 w-5"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              disabled={currentSlide === maxSlide}
              className={cn(
                "absolute h-10 w-10 rounded-full top-1/2 -translate-y-1/2 right-2 bg-white shadow-lg hover:bg-white hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-border z-10",
                {
                  hidden:
                    currentSlide === maxSlide || featuredItems.length === 0,
                }
              )}
            >
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
                className="h-5 w-5"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Button>
          </div>
        ) : (
          <InfoCard
            title="No hay tiendas destacadas"
            summary="Vuelve pronto para ver tiendas destacadas disponibles"
          />
        )}
      </div>
    </div>
  );
}
