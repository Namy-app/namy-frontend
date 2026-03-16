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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Destacados 🔥</h2>
        </div>
        <div className="h-64 bg-gray-300 rounded-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Destacados 🔥</h2>
          <Link
            href="/restaurants"
            className="text-sm font-semibold text-[#F1A151] hover:underline"
          >
            Ver todos
          </Link>
        </div>
        {featuredItems.length > 0 ? (
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex gap-x-4 transition-transform duration-300 ease-in-out"
                style={{
                  transform: `translateX(-${currentSlide * 74}%)`,
                }}
              >
                {featuredItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/stores/${item.id}`}
                    className="shrink-0 w-[70%] sm:w-[48%] group"
                  >
                    {/* Image card */}
                    <Card className="relative h-48 overflow-hidden cursor-pointer border-0 shadow-lg rounded-3xl">
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
                            item.type?.toLowerCase() === "RESTAURANT"
                              ? PlaceHolderTypeEnum.RESTAURANT
                              : PlaceHolderTypeEnum.SHOP
                          }
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      )}
                      {/* Discount badge — bottom left */}
                      <div className="absolute bottom-3 left-3 bg-[#F1A151] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {discountPercentage}%
                      </div>
                      {/* Rating pill — bottom right */}
                      {item.averageRating != null && (
                        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white text-[#423A33] text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="#F1A151"
                            stroke="#F1A151"
                            strokeWidth="1"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                          {item.averageRating.toFixed(1)}
                        </div>
                      )}
                    </Card>
                    {/* Info below card */}
                    <div className="mt-2 px-1">
                      <h3 className="font-bold text-sm text-[#423A33] truncate">
                        {item.name}
                      </h3>
                      {item.distance != null && (
                        <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="#ef4444"
                            stroke="none"
                          >
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                          </svg>
                          {item.distance < 1
                            ? `${Math.round(item.distance * 1000)} m`
                            : `${item.distance.toFixed(1)} km`}
                        </p>
                      )}
                    </div>
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
                "absolute h-10 w-10 rounded-full top-24 -translate-y-1/2 left-2 bg-white shadow-lg hover:bg-white hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-border z-10",
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
                "absolute h-10 w-10 rounded-full top-24 -translate-y-1/2 right-2 bg-white shadow-lg hover:bg-white hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-border z-10",
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
