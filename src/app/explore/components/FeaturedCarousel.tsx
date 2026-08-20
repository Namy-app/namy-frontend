"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import { Emoji } from "@/components/Emoji";
import { InfoCard } from "@/components/InfoCard";
import { StoreNavLink } from "@/components/StoreNavLink";
import { PlaceHolderTypeEnum } from "@/data/constants";
import { useInfinitePeekCarousel } from "@/hooks/useInfinitePeekCarousel";
import { type Store } from "@/lib/api-types";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";

const MAX_FEATURED_STORES = 6;

function FeaturedStoreCard({
  store,
  discountPercentage,
  onImageLoad,
}: {
  store: Store;
  discountPercentage: number;
  onImageLoad?: () => void;
}): React.JSX.Element {
  return (
    <StoreNavLink
      storeId={store.id}
      className="group block w-[70%] shrink-0 cursor-pointer sm:w-[48%]"
    >
      <Card className="relative h-48 overflow-hidden rounded-3xl border-0 shadow-lg">
        {store.imageUrl ? (
          <Image
            src={store.imageUrl}
            alt={store.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            onLoad={onImageLoad}
          />
        ) : (
          <Image
            src={
              store.type?.toLowerCase() === "RESTAURANT"
                ? PlaceHolderTypeEnum.RESTAURANT
                : PlaceHolderTypeEnum.SHOP
            }
            alt={store.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            onLoad={onImageLoad}
          />
        )}
        <div className="absolute bottom-3 left-3 rounded-full bg-[#F1A151] px-2.5 py-1 text-xs font-bold text-white">
          {discountPercentage}%
        </div>
        {store.averageRating != null ? (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#423A33] shadow">
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
            {store.averageRating.toFixed(1)}
          </div>
        ) : null}
      </Card>
      <div className="mt-2 px-1">
        <h3 className="truncate text-sm font-bold text-[#423A33]">
          {store.name}
        </h3>
        {store.distance != null ? (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
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
            {store.distance < 1
              ? `${Math.round(store.distance * 1000)} m`
              : `${store.distance.toFixed(1)} km`}
          </p>
        ) : null}
      </div>
    </StoreNavLink>
  );
}

export function FeaturedCarousel({
  discountPercentage = 10,
  isLoading,
  stores,
}: {
  discountPercentage?: number;
  isLoading?: boolean;
  stores?: Store[];
}): React.JSX.Element {
  const featuredItems = useMemo(
    () => (stores ?? []).slice(0, MAX_FEATURED_STORES),
    [stores]
  );

  const {
    trackRef,
    loopItems,
    useInfiniteLoop,
    itemCount,
    enableTransition,
    translateX,
    handleTransitionEnd,
    nextSlide,
    prevSlide,
    updateSlideStep,
  } = useInfinitePeekCarousel(featuredItems);

  if (isLoading) {
    return (
      <div className="mb-8 px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            Destacados <Emoji cp="1f525" label="fuego" />
          </h2>
        </div>
        <div className="h-64 animate-pulse rounded-3xl bg-gray-300" />
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            Destacados <Emoji cp="1f525" label="fuego" />
          </h2>
          <Link
            href="/restaurants"
            className="text-sm font-semibold text-[#F1A151] hover:underline"
          >
            Ver todos
          </Link>
        </div>
        {itemCount > 0 ? (
          <div className="relative">
            <div className={useInfiniteLoop ? "overflow-hidden" : undefined}>
              <div
                ref={trackRef}
                className="flex gap-x-4"
                onTransitionEnd={handleTransitionEnd}
                style={{
                  transition: enableTransition
                    ? "transform 300ms ease-in-out"
                    : "none",
                  transform:
                    translateX !== 0
                      ? `translateX(${translateX}px)`
                      : undefined,
                }}
              >
                {loopItems.map((store, index) => (
                  <FeaturedStoreCard
                    key={`${store.id}-${index}`}
                    store={store}
                    discountPercentage={discountPercentage}
                    onImageLoad={updateSlideStep}
                  />
                ))}
              </div>
            </div>

            {useInfiniteLoop ? (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevSlide}
                  className="absolute top-24 left-2 z-10 h-10 w-10 -translate-y-1/2 rounded-full border-2 border-border bg-white shadow-lg transition-all hover:scale-110 hover:bg-white"
                  aria-label="Tienda anterior"
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
                  className="absolute top-24 right-2 z-10 h-10 w-10 -translate-y-1/2 rounded-full border-2 border-border bg-white shadow-lg transition-all hover:scale-110 hover:bg-white"
                  aria-label="Siguiente tienda"
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
              </>
            ) : null}
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
