"use client";

import Image from "next/image";
import { useMemo } from "react";

import { Emoji } from "@/components/Emoji";
import { StoreNavLink } from "@/components/StoreNavLink";
import { PlaceHolderTypeEnum } from "@/data/constants";
import type { Discount } from "@/domains/admin/types";
import type { PromotedDiscount } from "@/domains/store/hooks/query/usePromotedDiscounts";
import { formatDiscountScheduleBadge } from "@/domains/store/utils/discountPromoDisplay";
import { useInfinitePeekCarousel } from "@/hooks/useInfinitePeekCarousel";
import {
  displayDiscountValue,
  resolveDiscountDisplayText,
} from "@/lib/discount-type";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";

const MAX_FEATURED_COUPONS = 10;

function toDiscountForBadge(promoted: PromotedDiscount): Discount {
  return {
    id: promoted.id,
    storeId: promoted.storeId,
    title: promoted.title,
    description: promoted.description ?? undefined,
    type: promoted.type as Discount["type"],
    value: promoted.value,
    code: undefined,
    startDate: "",
    endDate: "",
    active: true,
    usedCount: 0,
    excludedDaysOfWeek: promoted.excludedDaysOfWeek ?? [],
    excludedHours: [],
    additionalRestrictions: [],
    customText: promoted.customText,
    imageUrl: promoted.imageUrl,
    availableDaysAndTimes: promoted.availableDaysAndTimes ?? undefined,
    createdAt: "",
    updatedAt: "",
  };
}

function getCouponImageUrl(discount: PromotedDiscount): string {
  return (
    discount.imageUrl?.trim() ||
    discount.store?.imageUrl?.trim() ||
    PlaceHolderTypeEnum.RESTAURANT
  );
}

function getCouponDiscountLabel(
  discount: PromotedDiscount,
  userLevelPct: number,
  isPremium: boolean
): string {
  return (
    resolveDiscountDisplayText({
      customText: discount.customText,
      title: discount.title,
      type: discount.type,
      value: displayDiscountValue(discount, userLevelPct, isPremium),
    }) || discount.title
  );
}

function FeaturedCouponCard({
  discount,
  userLevelPct,
  isPremium,
  onImageLoad,
}: {
  discount: PromotedDiscount;
  userLevelPct: number;
  isPremium: boolean;
  onImageLoad?: () => void;
}): React.JSX.Element {
  const storeId = discount.store?.id ?? discount.storeId;
  const storeName = discount.store?.name ?? "Tienda";
  const discountLabel = getCouponDiscountLabel(
    discount,
    userLevelPct,
    isPremium
  );
  const scheduleBadge = formatDiscountScheduleBadge(
    toDiscountForBadge(discount)
  );
  const subtitle =
    discount.description?.trim() ||
    (discount.title !== discountLabel ? discount.title : null);

  return (
    <StoreNavLink
      storeId={storeId}
      discountId={discount.id}
      className="group block w-[70%] shrink-0 cursor-pointer sm:w-[48%]"
    >
      <Card className="relative h-48 overflow-hidden rounded-3xl border-0 shadow-lg">
        <Image
          src={getCouponImageUrl(discount)}
          alt={discountLabel}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          unoptimized
          onLoad={onImageLoad}
        />
        <div className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-[#F1A151] px-2.5 py-1 text-xs font-bold text-white">
          {discountLabel}
        </div>
        {scheduleBadge !== "Todos los días" ? (
          <div className="absolute bottom-3 right-3 max-w-[45%] truncate rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#423A33] shadow">
            {scheduleBadge}
          </div>
        ) : null}
      </Card>
      <div className="mt-2 px-1">
        <h3 className="truncate text-sm font-bold text-[#423A33]">
          {storeName}
        </h3>
        {subtitle ? (
          <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
            {subtitle}
          </p>
        ) : null}
      </div>
    </StoreNavLink>
  );
}

export function FeaturedCouponsCarousel({
  discounts,
  isLoading,
  userLevelPct = 10,
  isPremium = false,
}: {
  discounts: PromotedDiscount[];
  isLoading?: boolean;
  userLevelPct?: number;
  isPremium?: boolean;
}): React.JSX.Element | null {
  const featuredItems = useMemo(
    () => discounts.slice(0, MAX_FEATURED_COUPONS),
    [discounts]
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
            Cupones Destacados{" "}
            <Emoji cp="1f3ab" label="ticket" className="inline-block w-5 h-5" />
          </h2>
        </div>
        <div className="h-64 animate-pulse rounded-3xl bg-gray-300" />
      </div>
    );
  }

  if (itemCount === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            Cupones Destacados{" "}
            <Emoji cp="1f3ab" label="ticket" className="inline-block w-5 h-5" />
          </h2>
        </div>

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
                  translateX !== 0 ? `translateX(${translateX}px)` : undefined,
              }}
            >
              {loopItems.map((discount, index) => (
                <FeaturedCouponCard
                  key={`${discount.id}-${index}`}
                  discount={discount}
                  userLevelPct={userLevelPct}
                  isPremium={isPremium}
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
                aria-label="Cupón anterior"
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
                aria-label="Siguiente cupón"
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
      </div>
    </div>
  );
}
