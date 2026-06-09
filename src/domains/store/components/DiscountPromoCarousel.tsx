"use client";

import { ChevronLeft, ChevronRight, Gift, Loader2, Lock } from "lucide-react";
import Image from "next/image";

import { Button } from "@/shared/components/Button";

import type { DiscountPromoSlide } from "../utils/discountPromoDisplay";
import {
  getPromoAccentTheme,
  type PromoAccentTheme,
} from "../utils/promoAccentPalette";

export type { DiscountPromoSlide } from "../utils/discountPromoDisplay";

type UnlockState = {
  onUnlock: () => void;
  isAvailable: boolean;
  isPremium?: boolean;
  isLoading?: boolean;
  countdown?: string | null;
};

type DiscountPromoCarouselProps = {
  slides: DiscountPromoSlide[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  unlock: UnlockState;
};

function TicketScallopEdge({
  panelClass,
}: {
  panelClass: string;
}): React.JSX.Element {
  return (
    <div
      className="pointer-events-none absolute -right-[5px] top-0 z-10 flex h-full w-2.5 flex-col justify-evenly"
      aria-hidden
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${panelClass}`}
        />
      ))}
    </div>
  );
}

function PromoUnlockRow({
  unlock,
  theme,
}: {
  unlock: UnlockState;
  theme: PromoAccentTheme;
}): React.JSX.Element {
  if (unlock.isLoading) {
    return (
      <div className="flex items-center justify-center py-2">
        <Loader2 className={`h-5 w-5 animate-spin ${theme.accentText}`} />
      </div>
    );
  }

  if (!unlock.isAvailable) {
    return (
      <div className="py-1 text-center">
        <p className="text-sm font-semibold text-stone-700">
          No disponible en este momento
        </p>
        {unlock.countdown ? (
          <p className="mt-0.5 text-xs text-stone-500">
            Disponible en:{" "}
            <span className="font-mono font-bold">{unlock.countdown}</span>
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={unlock.onUnlock}
        className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm transition-colors ${theme.unlockBtn}`}
      >
        <Lock className="h-4 w-4 shrink-0" strokeWidth={2.5} />
        {unlock.isPremium ? "Desbloquear oferta ahora" : "Desbloquear oferta"}
      </button>
      <p className="mt-1.5 text-center text-xs text-stone-500">
        {unlock.isPremium
          ? "Acceso premium instantáneo"
          : "Ver anuncio • Es gratis"}
      </p>
    </div>
  );
}

function TicketPromoCard({
  slide,
  unlock,
}: {
  slide: DiscountPromoSlide;
  unlock: UnlockState;
}): React.JSX.Element {
  const theme = getPromoAccentTheme(slide.accent);
  const showGiftIcon =
    slide.mode === "text" &&
    !slide.stubSecondary &&
    slide.stubPrimary.length <= 6 &&
    !/^\d/.test(slide.stubPrimary);

  if (slide.mode === "banner" && slide.imageUrl) {
    return (
      <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <div className="relative h-36 w-full sm:h-40">
          <Image
            src={slide.imageUrl}
            alt={slide.title}
            fill
            className="object-cover object-center"
            unoptimized
            sizes="100vw"
          />
        </div>
        <div
          className={`border-t border-dashed border-stone-200/80 px-4 py-3 ${theme.panel}`}
        >
          <span
            className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${theme.badge}`}
          >
            {slide.scheduleBadge}
          </span>
          <p className="text-base font-bold text-stone-900">{slide.title}</p>
          {slide.description ? (
            <p className="mt-0.5 line-clamp-2 text-sm text-stone-600">
              {slide.description}
            </p>
          ) : null}
          <div className="mt-3 border-t border-dashed border-stone-300/80 pt-3">
            <PromoUnlockRow unlock={unlock} theme={theme} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex h-full overflow-hidden rounded-2xl border border-stone-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.08)] ${theme.panel}`}
    >
      <div
        className={`relative flex w-[34%] min-w-[7.5rem] shrink-0 flex-col items-center justify-center px-3 py-5 text-white ${theme.stub}`}
      >
        <TicketScallopEdge panelClass={theme.scallop} />
        {slide.imageUrl ? (
          <div className="relative mb-2 h-14 w-14 overflow-hidden rounded-full border-2 border-white/40 shadow-md">
            <Image
              src={slide.imageUrl}
              alt=""
              fill
              className="object-cover"
              unoptimized
              sizes="56px"
            />
          </div>
        ) : showGiftIcon ? (
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/30">
            <Gift className="h-7 w-7 text-white" strokeWidth={2} />
          </div>
        ) : (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20"
            aria-hidden
          >
            <div className="h-24 w-24 rounded-full border-4 border-white/60" />
          </div>
        )}
        <p className="relative z-[1] text-center text-2xl font-black leading-none tracking-tight sm:text-3xl">
          {slide.stubPrimary}
        </p>
        {slide.stubSecondary ? (
          <p className="relative z-[1] mt-1 text-center text-xs font-bold uppercase tracking-wider text-white/95">
            {slide.stubSecondary}
          </p>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between px-3.5 py-3.5 sm:px-4 sm:py-4">
        <div className="min-w-0">
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${theme.badge}`}
          >
            {slide.scheduleBadge}
          </span>
          <p className="mt-2 line-clamp-2 text-base font-extrabold leading-snug text-stone-900 sm:text-lg">
            {slide.headline}
          </p>
          {slide.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-stone-600">
              {slide.description}
            </p>
          ) : slide.title && slide.title !== slide.headline ? (
            <p className="mt-1 line-clamp-1 text-sm text-stone-500">
              {slide.title}
            </p>
          ) : null}
        </div>

        <div className="mt-3 border-t border-dashed border-stone-300/80 pt-3">
          <PromoUnlockRow unlock={unlock} theme={theme} />
        </div>
      </div>
    </div>
  );
}

/** Ticket-style promo carousel with external nav controls. */
export function DiscountPromoCarousel({
  slides,
  activeIndex,
  onActiveIndexChange,
  unlock,
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
    <div className="w-full min-w-0 max-w-full">
      <div className="relative min-w-0 overflow-hidden">
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
              className="box-border min-w-0 shrink-0 px-0.5"
              style={{ width: `${slideWidthPercent}%` }}
            >
              <TicketPromoCard slide={slide} unlock={unlock} />
            </div>
          ))}
        </div>
      </div>

      {hasMultiple ? (
        <div className="mt-3 flex items-center justify-between gap-2 px-1">
          <Button
            type="button"
            onClick={goToPrevious}
            size="icon"
            variant="outline"
            className="h-9 w-9 shrink-0 rounded-full border-stone-200 bg-white text-stone-700 shadow-sm hover:bg-stone-50"
            aria-label="Promoción anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center justify-center gap-1.5">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => onActiveIndexChange(index)}
                className={`rounded-full transition-all ${
                  safeIndex === index
                    ? `h-2 w-6 ${getPromoAccentTheme(slide.accent).dot}`
                    : "h-2 w-2 bg-stone-300 hover:bg-stone-400"
                }`}
                aria-label={`Ir a promoción ${index + 1}`}
                aria-current={safeIndex === index ? "true" : undefined}
              />
            ))}
          </div>

          <Button
            type="button"
            onClick={goToNext}
            size="icon"
            variant="outline"
            className="h-9 w-9 shrink-0 rounded-full border-stone-200 bg-white text-stone-700 shadow-sm hover:bg-stone-50"
            aria-label="Siguiente promoción"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
