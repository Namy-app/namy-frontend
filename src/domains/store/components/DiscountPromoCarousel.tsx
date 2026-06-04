"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

import { Button } from "@/shared/components/Button";

import type { PromoDisplayMode } from "../utils/discountPromoDisplay";

export type DiscountPromoSlide = {
  id: string;
  mode: PromoDisplayMode;
  imageUrl?: string | null;
  headline?: string;
  subline?: string;
};

export const DISCOUNT_PROMO_GRADIENT =
  "bg-linear-to-br from-rose-300 via-amber-300 to-lime-200";

type DiscountPromoCarouselProps = {
  slides: DiscountPromoSlide[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
};

/** Horizontal slide track with smooth translate animation. */
export function DiscountPromoCarousel({
  slides,
  activeIndex,
  onActiveIndexChange,
}: DiscountPromoCarouselProps): React.JSX.Element | null {
  if (slides.length === 0) {
    return null;
  }

  const hasMultiple = slides.length > 1;
  const slideCount = slides.length;
  const safeIndex = Math.min(activeIndex, slideCount - 1);
  const slideWidthPercent = 100 / slideCount;

  const goToPrevious = (): void => {
    onActiveIndexChange(safeIndex === 0 ? slides.length - 1 : safeIndex - 1);
  };

  const goToNext = (): void => {
    onActiveIndexChange(safeIndex === slides.length - 1 ? 0 : safeIndex + 1);
  };

  return (
    <div className="relative min-h-[200px] w-full min-w-0 max-w-full overflow-hidden pb-10">
      <div
        className="flex transition-transform duration-500 ease-in-out will-change-transform"
        style={{
          width: `${slideCount * 100}%`,
          transform: `translate3d(-${safeIndex * slideWidthPercent}%, 0, 0)`,
        }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="relative box-border min-h-[200px] min-w-0 shrink-0 overflow-hidden"
            style={{ width: `${slideWidthPercent}%` }}
          >
            {slide.mode === "banner" && slide.imageUrl ? (
              <div className="relative h-[220px] min-h-[200px] w-full max-w-full">
                <Image
                  src={slide.imageUrl}
                  alt="Promoción"
                  fill
                  className="object-cover object-center"
                  unoptimized
                  sizes="100vw"
                  priority={safeIndex === 0}
                />
              </div>
            ) : (
              <>
                {slide.imageUrl ? (
                  <div className="absolute inset-0">
                    <Image
                      src={slide.imageUrl}
                      alt=""
                      fill
                      className="object-cover object-center"
                      unoptimized
                      sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                ) : null}
                <div className="relative z-[1] box-border flex min-h-[200px] w-full max-w-full min-w-0 flex-col justify-end p-4 sm:p-5">
                  {slide.headline ? (
                    <p className="line-clamp-3 break-words text-xl font-extrabold leading-tight text-white drop-shadow-md sm:text-2xl md:text-3xl">
                      {slide.headline}
                    </p>
                  ) : null}
                  {slide.subline ? (
                    <p className="mt-1 break-words text-sm text-white/95 drop-shadow-sm">
                      {slide.subline}
                    </p>
                  ) : null}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {hasMultiple ? (
        <>
          <Button
            type="button"
            onClick={goToPrevious}
            size="icon"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/45 text-white border-0 rounded-full shadow-md backdrop-blur-sm"
            aria-label="Previous promotion"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            type="button"
            onClick={goToNext}
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/45 text-white border-0 rounded-full shadow-md backdrop-blur-sm"
            aria-label="Next promotion"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2 justify-center">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => onActiveIndexChange(index)}
                className={`h-2 rounded-full transition-all ${
                  safeIndex === index
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to promotion ${index + 1}`}
                aria-current={safeIndex === index ? "true" : undefined}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
