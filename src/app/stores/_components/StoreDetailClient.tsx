"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Heart,
  Clock,
  MapPin,
  Phone,
  Star,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";

import { CongratulationsModal } from "@/components/CongratulationsModal";
import {
  CouponAnimationPreloader,
  CouponGenerationAnimation,
} from "@/components/CouponGenerationAnimation";
import { MapDisplay } from "@/components/MapDisplay";
import { UnlockDiscountModal } from "@/components/UnlockDiscountModal";
import { VideoAdsModal } from "@/components/VideoAdsModal";
import { PlaceHolderTypeEnum } from "@/data/constants";
import { getDefaultChallenge } from "@/data/default-challenges.data";
import { useStoreDiscounts, useStoreCatalogs } from "@/domains/admin/hooks";
import type { Discount } from "@/domains/admin/types";
import { GeneratingCouponModal } from "@/domains/coupons/GeneratingCouponModal";
import { useWallet } from "@/domains/payment/hooks";
import { CatalogCarousel } from "@/domains/store/components/CatalogCarousel";
import { DiscountPromoCarousel } from "@/domains/store/components/DiscountPromoCarousel";
import { useStore } from "@/domains/store/hooks";
import { useStoreReviews } from "@/domains/store/hooks/query/useStoreReviews";
import type { ParsedStore } from "@/domains/store/type";
import { getDiscountRestrictions } from "@/domains/store/utils";
import {
  buildFallbackPromoSlide,
  buildPromoSlidesFromDiscounts,
} from "@/domains/store/utils/discountPromoDisplay";
import { useMyLevel } from "@/domains/user/hooks/query/useMyLevel";
import { useToast } from "@/hooks/use-toast";
import { useDiscountCountdown } from "@/hooks/useDiscountCountdown";
import { BasicLayout } from "@/layouts/BasicLayout";
import { analytics } from "@/lib/analytics";
import { trackPartnerJourney } from "@/lib/analytics/trackPartnerJourney";
import {
  CAPACITOR_DYNAMIC_NAV_EVENT,
  resolveCapacitorDynamicId,
  resolveCapacitorDynamicQueryParam,
} from "@/lib/capacitor-navigate";
import { convertTo12Hour } from "@/lib/date-time-utils";
import {
  displayDiscountValue,
  resolveDiscountDisplayText,
} from "@/lib/discount-type";
import { isDiscountValid } from "@/lib/discount-utils";
import { graphqlRequest } from "@/lib/graphql-client";
import {
  GENERATE_COUPON_MUTATION,
  QUICK_PAY_FOR_DISCOUNT_MUTATION,
  EXCHANGE_UNLOCK_MUTATION,
  CREATE_REVIEW_MUTATION,
  CREATE_MURAL_POST_MUTATION,
} from "@/lib/graphql-queries";
import { useAppTranslation } from "@/lib/i18n/useAppTranslation";
import { contentfulImageLoader } from "@/lib/image-utils";
import { openInGoogleMaps } from "@/lib/maps";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { useAuthStore } from "@/store/useAuthStore";
import { usePartnerConfig } from "@/store/usePartnerStore";

// Mapping for Spanish day labels
const DAY_LABELS: Record<string, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

// Get current day of the week in lowercase English
function getCurrentDayOfWeek(): string {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const today = new Date();
  return days[today.getDay()] || "";
}

const muralPts = getDefaultChallenge("mural_posts")?.points ?? 50;
const reviewPts = getDefaultChallenge("reviews")?.points ?? 40;

export default function StoreDetailClient(): React.JSX.Element {
  const { t, i18n } = useAppTranslation();

  const router = useRouter();
  const partner = usePartnerConfig();
  const isPartnerMode = partner != null;
  const canPostMural = !partner || partner.features.mural === true;
  const params = useParams();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, accessToken } = useAuthStore();
  const { data: userLevel } = useMyLevel();

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllHours, setShowAllHours] = useState(false);
  const [showRestrictions, setShowRestrictions] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showVideoAdsModal, setShowVideoAdsModal] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [_, setShowSuccess] = useState(false);
  const [couponGenerationError, setCouponGenerationError] = useState<
    string | null
  >(null);
  const [quickPayError, setQuickPayError] = useState<string | null>(null);
  const [showAddFundsAction, setShowAddFundsAction] = useState(false);
  const [showQuickPaySuccess, setShowQuickPaySuccess] = useState(false);
  const [showCouponAnimation, setShowCouponAnimation] = useState(false);
  const [unlockToken, setUnlockToken] = useState<string | null>(null);
  const [selectedDiscount, setSelectedDiscount] = useState<{
    id: string;
  } | null>(null);
  const [selectedCatalogImage, setSelectedCatalogImage] = useState<
    string | null
  >(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewPhotoUrl, setReviewPhotoUrl] = useState<string | null>(null);
  const [reviewPhotoPreview, setReviewPhotoPreview] = useState<string | null>(
    null
  );
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadPhotoError, setUploadPhotoError] = useState<string | null>(null);
  const [muralPostDone, setMuralPostDone] = useState(false);
  const reviewPhotoRef = useRef<HTMLInputElement>(null);
  const appliedDiscountDeepLinkRef = useRef(false);
  const [capacitorNavTick, setCapacitorNavTick] = useState(0);
  const [selectedReview, setSelectedReview] = useState<{
    id: string;
    userId: string;
    title: string;
    description?: string | null;
    rating: number;
  } | null>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedCatalogImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedCatalogImage]);

  useEffect(() => {
    const handleCapacitorNav = (): void => {
      setCapacitorNavTick((tick) => tick + 1);
    };
    window.addEventListener(CAPACITOR_DYNAMIC_NAV_EVENT, handleCapacitorNav);
    return () => {
      window.removeEventListener(
        CAPACITOR_DYNAMIC_NAV_EVENT,
        handleCapacitorNav
      );
    };
  }, []);

  const { data: wallet } = useWallet({ userId: user?.id });
  const storeId = useMemo(
    () =>
      resolveCapacitorDynamicId("/stores/", params?.id as string | undefined) ??
      "",
    [params?.id, capacitorNavTick]
  );
  const { data: store, isLoading } = useStore(storeId);

  const discountIdFromNavigation = useMemo(() => {
    const fromUrl = searchParams?.get("discountId");
    if (fromUrl) {
      return fromUrl;
    }
    return resolveCapacitorDynamicQueryParam("discountId");
  }, [searchParams, capacitorNavTick]);

  useEffect(() => {
    appliedDiscountDeepLinkRef.current = false;
  }, [storeId]);

  useEffect(() => {
    if (!store?.id || store.id === "id" || store.id === "placeholder") {
      return;
    }
    const discountIdFromUrl = discountIdFromNavigation ?? undefined;
    analytics.trackDistinct("restaurant_viewed", store.id, {
      store_id: store.id,
      ...(store.type ? { store_type: store.type } : {}),
      ...(discountIdFromUrl ? { discount_id: discountIdFromUrl } : {}),
    });
  }, [store?.id, store?.type, discountIdFromNavigation]);

  const storeDiscountFilters = useMemo(
    () => (storeId ? { storeId } : undefined),
    [storeId]
  );
  const storeDiscountPagination = useMemo(() => ({ page: 1, first: 10 }), []);

  // Fetch discounts for this store
  const { data: discountsData, isLoading: isLoadingDiscounts } =
    useStoreDiscounts(storeDiscountFilters, storeDiscountPagination, {
      enabled: !!storeId,
    });

  // Fetch catalogs for this store
  const { data: catalogs = [] } = useStoreCatalogs(storeId || "");

  // Fetch reviews for this store
  const { data: reviewsData } = useStoreReviews(
    storeId,
    { first: 3 },
    { enabled: !isPartnerMode }
  );

  // Active discounts only — no promotional filters
  const visibleDiscounts = useMemo(
    () => discountsData?.data?.filter((d) => d.active === true) ?? [],
    [discountsData?.data]
  );
  const userLevelPct = userLevel?.discountPercentage ?? 10;
  const isPremiumUser = Boolean(user?.isPremium);
  const promoDisplayContext = useMemo(
    () => ({
      userLevelPct,
      isPremium: isPremiumUser,
      language: i18n.language === "en" ? ("en" as const) : ("es" as const),
    }),
    [userLevelPct, isPremiumUser, i18n.language]
  );
  const fallbackDiscountPercentage = userLevelPct;
  const currentCarouselDiscount =
    visibleDiscounts[activeCardIndex] ?? visibleDiscounts[0];

  const getDiscountSlideLabel = (discount: Discount): string => {
    const label = resolveDiscountDisplayText({
      customText: discount.customText,
      title: discount.title,
      type: discount.type,
      value: displayDiscountValue(discount, userLevelPct, isPremiumUser),
    });
    return label || discount.title || t("ui.special_offer");
  };

  const getSelectedDiscountId = (): string | undefined => {
    if (visibleDiscounts.length === 0) {
      return undefined;
    }
    const safeIndex = Math.min(activeCardIndex, visibleDiscounts.length - 1);
    return visibleDiscounts[safeIndex]?.id;
  };

  const discountRestrictions = getDiscountRestrictions(currentCarouselDiscount);

  const isRestaurant =
    store?.type === "RESTAURANT" || store?.type === "PRODUCT";
  const storeCategoryType = isRestaurant ? "Restaurant" : "Store";

  // Use optimized countdown hook for the carousel's current discount
  const { isValid: isValidDiscount, countdownText: timeUntilNext } =
    useDiscountCountdown(currentCarouselDiscount);

  useEffect(() => {
    if (activeCardIndex >= visibleDiscounts.length) {
      setActiveCardIndex(Math.max(0, visibleDiscounts.length - 1));
    }
  }, [visibleDiscounts.length, activeCardIndex]);

  // Deep-link from Explore featured coupons (?discountId=...)
  useEffect(() => {
    if (appliedDiscountDeepLinkRef.current) {
      return;
    }

    const discountIdFromUrl = discountIdFromNavigation;
    if (!discountIdFromUrl || visibleDiscounts.length === 0) {
      return;
    }

    const index = visibleDiscounts.findIndex((d) => d.id === discountIdFromUrl);
    if (index >= 0) {
      setActiveCardIndex(index);
      appliedDiscountDeepLinkRef.current = true;
    }
  }, [discountIdFromNavigation, visibleDiscounts]);

  // Show spinner while storeId is not yet available from params or query is loading
  if (!storeId || storeId === "undefined") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!store || !store.id) {
    router.push("/explore");
    return <></>;
  }

  // Convert store data to store format for the UI
  const parsedStore: ParsedStore | null = store
    ? {
        id: store.id,
        name: store.name,
        categoryIds: store.categoryIds ?? [],
        categoryLabel:
          store.type === "RESTAURANT"
            ? "Restaurant"
            : store.type === "SERVICE"
              ? "Service"
              : "Store",
        emoji:
          store.type === "RESTAURANT" || store.type === "PRODUCT" ? "🍽️" : "🔧",
        rating: store.averageRating ?? 4.5,
        reviewCount: store.reviewCounter ?? 0,
        isAdPartner: false,
        discount: {
          id: store.id,
          percentage: userLevel?.discountPercentage ?? 10,
          points: 0,
        },
        hours:
          store.openDays && typeof store.openDays === "object"
            ? (() => {
                // Check if it's the availableDays array format
                if (
                  "availableDays" in store.openDays &&
                  Array.isArray(store.openDays.availableDays) &&
                  store.openDays.availableDays.length > 0
                ) {
                  return store.openDays.availableDays
                    .map(
                      (day: {
                        day: string;
                        closed?: boolean;
                        startTime?: string;
                        endTime?: string;
                      }) => {
                        const dayLabel =
                          DAY_LABELS[day.day.toLowerCase()] || day.day;
                        return day.closed
                          ? `${dayLabel}: ${t("ui.closed")}`
                          : `${dayLabel}: ${day.startTime} - ${day.endTime}`;
                      }
                    )
                    .join(", ");
                }

                // Otherwise, it's the old format with day keys directly
                const daysOfWeek = [
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                  "saturday",
                  "sunday",
                ];
                const openDaysObj = store.openDays as Record<
                  string,
                  { open?: string; close?: string }
                >;
                const formattedHours = daysOfWeek
                  .filter((day) => day in openDaysObj && openDaysObj[day])
                  .map((day) => {
                    const hours = openDaysObj[day];
                    const dayLabel =
                      DAY_LABELS[day] ||
                      day.charAt(0).toUpperCase() + day.slice(1);
                    if (hours && hours.open && hours.close) {
                      return `${dayLabel}: ${hours.open} - ${hours.close}`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(", ");

                return formattedHours || t("ui.hours_unavailable");
              })()
            : t("ui.hours_unavailable"),
        hoursStructured:
          store.openDays && typeof store.openDays === "object"
            ? (() => {
                // Check if it's the availableDays array format
                if (
                  "availableDays" in store.openDays &&
                  Array.isArray(store.openDays.availableDays) &&
                  store.openDays.availableDays.length > 0
                ) {
                  return store.openDays.availableDays.map(
                    (day: {
                      day: string;
                      closed?: boolean;
                      startTime?: string;
                      endTime?: string;
                    }) => {
                      const dayLabel =
                        DAY_LABELS[day.day.toLowerCase()] || day.day;
                      return {
                        day: dayLabel,
                        hours: day.closed
                          ? t("ui.closed")
                          : `${convertTo12Hour(day.startTime || "")} - ${convertTo12Hour(day.endTime || "")}`,
                      };
                    }
                  );
                }

                // Otherwise, it's the old format with day keys directly
                const daysOfWeek = [
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                  "saturday",
                  "sunday",
                ];
                const openDaysObj = store.openDays as Record<
                  string,
                  { open?: string; close?: string }
                >;
                return daysOfWeek
                  .filter((day) => day in openDaysObj && openDaysObj[day])
                  .map((day) => {
                    const hours = openDaysObj[day];
                    const dayLabel =
                      DAY_LABELS[day] ||
                      day.charAt(0).toUpperCase() + day.slice(1);
                    if (hours && hours.open && hours.close) {
                      return {
                        day: dayLabel,
                        hours: `${convertTo12Hour(hours.open)} - ${convertTo12Hour(hours.close)}`,
                      };
                    }
                    return null;
                  })
                  .filter(
                    (item): item is { day: string; hours: string } =>
                      item !== null
                  );
              })()
            : undefined,
        location: {
          address: store.address || t("ui.address_unavailable"),
          city: store.city || t("ui.city_unavailable"),
          lat: store.lat,
          lng: store.lng,
          placeId: store.placeId,
        },
        phone: store.phoneNumber || t("ui.phone_unavailable"),
        images: (() => {
          const allImages = [
            store.imageUrl, // Main image first
            store.image1Url,
            store.image2Url,
            store.image3Url,
          ].filter((url): url is string => !!url && url.trim() !== "");
          return allImages.length > 0
            ? allImages
            : [
                isRestaurant
                  ? PlaceHolderTypeEnum.RESTAURANT
                  : PlaceHolderTypeEnum.SHOP,
              ];
        })(),
        menuItems: [],
        reviews: [],
        amenities:
          store.additionalInfo &&
          typeof store.additionalInfo === "object" &&
          "amenities" in store.additionalInfo &&
          Array.isArray(
            (store.additionalInfo as { amenities?: string[] }).amenities
          )
            ? ((store.additionalInfo as { amenities: string[] })
                .amenities as string[])
            : [t("ui.amenities_unavailable")],
      }
    : null;

  const handleUnlockDiscountClick = (): void => {
    if (!isAuthenticated) {
      toast({
        variant: "default",
        title: t("ui.login_required"),
        description: t("ui.please_log_in_to_unlock_discounts"),
      });
      router.push("/");
      return;
    }

    const discountId = getSelectedDiscountId();
    if (discountId) {
      setSelectedDiscount({ id: discountId });
    }

    analytics.track("discount_unlock_started", {
      store_id: storeId,
      ...(discountId ? { discount_id: discountId } : {}),
      is_premium: Boolean(user?.isPremium),
    });

    // Premium and ad-free partner sessions generate directly.
    if (user?.isPremium || partner?.adsDisabled) {
      void handleUnlockDiscount();
    } else {
      // Show modal for free users
      setShowUnlockModal(true);
    }
  };

  const handleWatchAdClick = (): void => {
    if (!isDiscountValid(currentCarouselDiscount)) {
      toast({
        variant: "destructive",
        title: t("ui.this_discount_is_no_longer_available"),
      });
      return;
    }

    setShowUnlockModal(false);
    if (partner?.adsDisabled) {
      void handleUnlockDiscount();
      return;
    }
    // Show video ads modal
    setShowVideoAdsModal(true);
  };

  const handleQuickPayClick = (): void => {
    setShowUnlockModal(false);
    void handleQuickPay();
  };

  const handleCongratulationsComplete = async (): Promise<void> => {
    if (!unlockToken || !parsedStore) {
      toast({
        variant: "destructive",
        title: "Error",
        description: t("ui.unlock_token_missing_please_try_again"),
      });
      setShowCongratulations(false);
      return;
    }

    try {
      const discountId = getSelectedDiscountId();

      if (!discountId) {
        toast({
          variant: "destructive",
          title: t("ui.no_discounts_available"),
          description: t("ui.this_store_has_no_active_discounts_right_now"),
        });
        setShowCongratulations(false);
        return;
      }

      // Show looping animation while exchanging the unlock token
      setShowCouponAnimation(true);
      setShowCongratulations(false);

      // Exchange unlock token for coupon
      const exchangeData = await graphqlRequest<{
        exchangeUnlock: {
          id: string;
          code: string;
          qrCode: string;
          url: string;
        };
      }>(EXCHANGE_UNLOCK_MUTATION, {
        input: {
          token: unlockToken,
          discountId,
        },
      });

      if (exchangeData?.exchangeUnlock) {
        // Invalidate coupons cache
        try {
          void queryClient.invalidateQueries({ queryKey: ["coupons"] });
        } catch (_e) {
          // ignore
        }

        setUnlockToken(null);
        setShowCouponAnimation(false);
        setShowSuccess(true);
      }
    } catch (error) {
      console.error("Error exchanging unlock token:", error);
      setShowCouponAnimation(false);
      toast({
        variant: "destructive",
        title: t("ui.unable_to_unlock_coupon"),
        description:
          error instanceof Error ? error.message : t("ui.please_try_again"),
      });
      setShowCongratulations(false);
    }
  };

  const handleUnlockDiscount = async (): Promise<void> => {
    if (!isAuthenticated) {
      toast({
        variant: "default",
        title: t("ui.login_required"),
        description: t("ui.please_log_in_to_unlock_discounts"),
      });
      router.push("/");
      return;
    }

    const discountId = getSelectedDiscountId();

    if (!discountId) {
      toast({
        variant: "destructive",
        title: t("ui.no_discounts_available"),
        description: t("ui.this_store_has_no_active_discounts_right_now"),
      });
      return;
    }

    // Show looping animation immediately — replaces the old spinner modal
    setShowCouponAnimation(true);
    setCouponGenerationError(null);

    try {
      const data = await graphqlRequest<{
        generateCoupon: {
          code: string;
          qrCode: string;
          url: string;
          value: number;
          discount: {
            id: string;
            title: string;
            description?: string;
            type: string;
            value: number;
            minPurchaseAmount?: number;
            maxDiscountAmount?: number;
          };
          store: {
            id: string;
            name: string;
            address?: string;
            city?: string;
            phoneNumber?: string;
            averageRating?: number;
            reviewCounter?: number;
          };
        };
      }>(GENERATE_COUPON_MUTATION, {
        input: { discountId },
      });

      if (data?.generateCoupon) {
        trackPartnerJourney("coupon_generated", {
          store_id: data.generateCoupon.store?.id ?? storeId,
          discount_id: discountId,
        });
        analytics.track("coupon_generated", {
          store_id: data.generateCoupon.store?.id ?? storeId,
          discount_id: discountId,
          method: partner?.adsDisabled ? "partner" : "premium",
        });
        // Ensure coupons cache is refreshed so UI shows the new coupon
        try {
          void queryClient.invalidateQueries({ queryKey: ["coupons"] });
        } catch (_e) {
          // ignore
        }
        setShowCouponAnimation(false);
        toast({
          title: t("ui.coupon_created"),
          description: t("ui.coupon_added_to_my_coupons"),
        });
        router.push("/my-coupons");
      } else {
        throw new Error(t("ui.no_coupon_received_from_the_server"));
      }
    } catch (err) {
      setShowCouponAnimation(false);
      const message = err instanceof Error ? err.message : String(err);
      setCouponGenerationError(message);
    }
  };

  const handleQuickPay = async (): Promise<void> => {
    if (!isAuthenticated) {
      toast({
        variant: "default",
        title: t("ui.login_required"),
        description: t("ui.please_log_in_to_use_quick_pay"),
      });
      router.push("/");
      return;
    }

    // Check wallet balance before attempting payment
    const QUICK_PAY_COST = 900; // $9 MXN in cents
    if (wallet && wallet.balance < QUICK_PAY_COST) {
      setQuickPayError(
        `Fondos insuficientes\n\nNecesitas $${QUICK_PAY_COST / 100} MXN pero solo tienes $${wallet.balance / 100} MXN. Agrega fondos para continuar.`
      );
      setShowAddFundsAction(true);
      return;
    }

    // Show looping animation immediately — replaces the old spinner modal
    setShowCouponAnimation(true);

    try {
      const data = await graphqlRequest<{
        quickPayForDiscount: {
          code: string;
          qrCode: string;
          url: string;
          value: number;
          discount: {
            id: string;
            title: string;
            description?: string;
            type: string;
            value: number;
            minPurchaseAmount?: number;
            maxDiscountAmount?: number;
          };
          store: {
            id: string;
            name: string;
            address?: string;
            city?: string;
            phoneNumber?: string;
            averageRating?: number;
            reviewCounter?: number;
          };
        };
      }>(QUICK_PAY_FOR_DISCOUNT_MUTATION, {
        discountId: getSelectedDiscountId(),
      });

      if (data?.quickPayForDiscount) {
        analytics.track("coupon_generated", {
          store_id: data.quickPayForDiscount.store?.id ?? storeId,
          discount_id: getSelectedDiscountId(),
          method: "quick_pay",
        });
        try {
          void queryClient.invalidateQueries({ queryKey: ["coupons"] });
        } catch (_e) {
          // ignore
        }
        setShowCouponAnimation(false);
        setShowQuickPaySuccess(true);
      } else {
        setShowCouponAnimation(false);
        throw new Error(t("ui.quick_pay_failed"));
      }
    } catch (err) {
      setShowCouponAnimation(false);
      const message = err instanceof Error ? err.message : String(err);

      // Set error message for modal
      setQuickPayError(message);
    }
  };

  const handleWhatsAppContact = (): void => {
    if (!parsedStore) {
      return;
    }
    window.open(
      `https://wa.me/${parsedStore.phone.replace(/\D/g, "")}`,
      "_blank"
    );
  };

  const handleShareContact = (): void => {
    if (!parsedStore) {
      return;
    }

    const currentUrl =
      typeof window !== "undefined" ? window.location.href : "";
    const shareText = `🍽️ Check out ${parsedStore.name}!\n\n📍 ${parsedStore.location.address}, ${parsedStore.location.city}\n💰 Get ${parsedStore.discount.percentage}% off with Ñamy!\n📞 ${parsedStore.phone}\n\n${currentUrl}`;

    const shareData = {
      title: `${parsedStore.name} - ${parsedStore.discount.percentage}% off with Ñamy!`,
      text: shareText,
      url: currentUrl,
    };

    // Check if Web Share API is supported (mobile devices)
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share(shareData).catch((error) => {
        console.error("Error sharing:", error);
        // Fallback to clipboard
        handleClipboardShare(shareText);
      });
    } else {
      // Desktop fallback - copy to clipboard
      handleClipboardShare(shareText);
    }
  };

  const handleClipboardShare = (text: string): void => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast({
            title: t("ui.copied_to_clipboard"),
            description: `${storeCategoryType} details have been copied. Share them with friends!`,
          });
        })
        .catch((error) => {
          console.error("Error copying to clipboard:", error);
          toast({
            variant: "destructive",
            title: t("ui.copy_failed"),
            description: t(
              "ui.unable_to_copy_to_clipboard_please_copy_manually"
            ),
          });
        });
    } else {
      // Fallback for browsers without clipboard API
      toast({
        variant: "destructive",
        title: t("ui.sharing_is_not_supported"),
        description: `Please copy the ${storeCategoryType.toLowerCase()} details manually.`,
      });
    }
  };

  if (isLoading) {
    return (
      <BasicLayout className="bg-gradient-hero pb-20">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">
              {t("ui.loading_restaurant_details")}
            </p>
          </div>
        </div>
      </BasicLayout>
    );
  }

  const handleGetDirections = (): void => {
    if (!parsedStore) {
      return;
    }
    openInGoogleMaps({
      placeId: store?.placeId,
      ...(parsedStore.location.lat &&
        parsedStore.location.lng && {
          lat: +Number(parsedStore.location.lat).toFixed(6),
          lng: +Number(parsedStore.location.lng).toFixed(6),
        }),
      address: `${parsedStore.location.address}, ${parsedStore.location.city}`,
    });
  };

  const navigateToCouponsWithDelay = (): void => {
    setTimeout(() => {
      router.push("/my-coupons");
    }, 500); // 500ms delay for better UX
  };

  return (
    <BasicLayout className="bg-gradient-hero pb-20">
      {!parsedStore ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-muted-foreground text-lg mb-4">
              {t("ui.place_not_found", { type: storeCategoryType })}
            </p>
            <Button onClick={() => router.push("/restaurants")}>
              {t("ui.back_to_places", { type: storeCategoryType })}
            </Button>
          </div>
        </div>
      ) : (
        <div className={`${isPartnerMode ? "pt-0" : "pt-14"} pb-16`}>
          <div className="mx-auto max-w-5xl px-4">
            <div className="relative h-96 md:h-130 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={parsedStore.images[currentImageIndex] ?? ""}
                alt={parsedStore.name}
                fill
                className="object-cover transform-gpu scale-105 transition-transform duration-700"
                priority
                unoptimized
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://placehold.co/800x520/fef2f2/f87171?text=Restaurant+Image";
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/10" />

              <div className="absolute inset-0 flex items-start justify-between p-4">
                <div className="flex gap-3 items-center">
                  <Button
                    onClick={() => router.back()}
                    size="icon"
                    className="bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow"
                  >
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                  </Button>
                </div>
                <div className="flex gap-3 items-center">
                  <Button
                    onClick={() => setIsFavorite(!isFavorite)}
                    size="icon"
                    className="bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow"
                  >
                    <Heart
                      className={`w-5 h-5 text-foreground transition-all ${
                        isFavorite ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </Button>
                </div>
              </div>

              {/* Image Navigation Controls - Only show if multiple images */}
              {parsedStore.images.length > 1 && (
                <>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-between w-full px-4 pointer-events-none">
                    <Button
                      onClick={() =>
                        setCurrentImageIndex((prev: number) =>
                          prev === 0 ? parsedStore.images.length - 1 : prev - 1
                        )
                      }
                      size="icon"
                      className="bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow pointer-events-auto"
                    >
                      <ChevronLeft className="w-5 h-5 text-foreground" />
                    </Button>
                    <Button
                      onClick={() =>
                        setCurrentImageIndex((prev: number) =>
                          prev === parsedStore.images.length - 1 ? 0 : prev + 1
                        )
                      }
                      size="icon"
                      className="bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow pointer-events-auto"
                    >
                      <ChevronRight className="w-5 h-5 text-foreground" />
                    </Button>
                  </div>
                  {/* Image indicators */}
                  <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
                    {parsedStore.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "bg-white w-8"
                            : "bg-white/50 hover:bg-white/75"
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}

              <div className="absolute left-6 bottom-6 text-left text-white">
                <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg">
                  {parsedStore.name}
                </h1>
                <div className="mt-2 flex items-center gap-4 text-sm md:text-base text-white/90">
                  <div className="inline-flex items-center gap-2">
                    <span>{parsedStore.emoji}</span>
                    <span className="font-medium">
                      {parsedStore.categoryLabel ?? "Store"}
                    </span>
                  </div>
                  {!isPartnerMode && (
                    <div className="inline-flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">
                        {parsedStore.rating}
                      </span>
                      <span className="text-sm">
                        (
                        {t("ui.review_count", {
                          count: parsedStore.reviewCount,
                        })}
                        )
                      </span>
                    </div>
                  )}
                </div>
                {parsedStore.isAdPartner ? (
                  <div className="mt-3 inline-block bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                    {t("ui.ad_partner")}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="min-w-0 space-y-6 lg:col-span-2">
                <div className="max-w-full min-w-0">
                  {visibleDiscounts.length > 0 ? (
                    <DiscountPromoCarousel
                      activeIndex={activeCardIndex}
                      onActiveIndexChange={setActiveCardIndex}
                      slides={buildPromoSlidesFromDiscounts(
                        visibleDiscounts,
                        getDiscountSlideLabel,
                        promoDisplayContext
                      )}
                      unlock={{
                        onUnlock: handleUnlockDiscountClick,
                        isAvailable: isValidDiscount,
                        isPremium: user?.isPremium,
                        isLoading: isLoadingDiscounts,
                        countdown: timeUntilNext,
                      }}
                    />
                  ) : (
                    <DiscountPromoCarousel
                      activeIndex={0}
                      onActiveIndexChange={() => undefined}
                      slides={[
                        buildFallbackPromoSlide(fallbackDiscountPercentage),
                      ]}
                      unlock={{
                        onUnlock: handleUnlockDiscountClick,
                        isAvailable: false,
                        isPremium: user?.isPremium,
                        isLoading: isLoadingDiscounts,
                      }}
                    />
                  )}
                </div>

                <Card className="p-6 space-y-4 bg-white border border-[var(--partner-border,#f1e9e6)] rounded-xl shadow-md">
                  {parsedStore.hoursStructured &&
                  parsedStore.hoursStructured.length > 0 ? (
                    <>
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-[var(--partner-primary,#f43f5e)] mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-foreground mb-3">
                            {t("ui.today_s_hours")}
                          </p>
                          <div className="space-y-2">
                            {(() => {
                              const currentDay = getCurrentDayOfWeek();
                              const todayHours =
                                parsedStore.hoursStructured.find(
                                  (item) =>
                                    item.day.toLowerCase() ===
                                    DAY_LABELS[currentDay]?.toLowerCase()
                                );

                              return todayHours ? (
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium text-foreground">
                                    {t(
                                      "ui." +
                                        (Object.keys(DAY_LABELS).find(
                                          (key) =>
                                            DAY_LABELS[key] === todayHours.day
                                        ) ?? ""),
                                      { defaultValue: todayHours.day }
                                    )}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {todayHours.hours}
                                  </span>
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  {t("ui.no_hours_listed_for_today")}
                                </p>
                              );
                            })()}
                          </div>
                          <button
                            onClick={() => setShowAllHours(true)}
                            className="mt-3 text-sm text-primary hover:text-primary/80 transition-colors underline"
                          >
                            {t("ui.view_all_hours")}
                          </button>
                        </div>
                      </div>

                      <div className="h-px bg-border" />
                    </>
                  ) : null}

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">
                        {t("ui.location")}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {parsedStore.location.address},{" "}
                        {parsedStore.location.city}
                      </p>

                      {/* Embedded Map Display */}
                      {parsedStore.location.lat && parsedStore.location.lng ? (
                        <div className="my-3">
                          <MapDisplay
                            lat={parsedStore.location.lat}
                            lng={parsedStore.location.lng}
                            storeName={parsedStore.name}
                            height="180px"
                          />
                        </div>
                      ) : null}

                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={handleGetDirections}
                      >
                        {t("ui.get_directions")}
                      </Button>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  {parsedStore.phone.length > 0 ? (
                    <>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-[var(--partner-primary,#f43f5e)] shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">
                            {t("ui.phone")}
                          </p>
                          <a
                            href={`tel:${parsedStore.phone}`}
                            className="text-sm text-[var(--partner-primary,#e11d48)] hover:underline"
                          >
                            {parsedStore.phone}
                          </a>
                        </div>
                      </div>
                      <div className="h-px bg-border" />

                      <Button
                        onClick={handleWhatsAppContact}
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {t("ui.contact_via_whatsapp")}
                      </Button>
                    </>
                  ) : null}
                </Card>

                {catalogs && catalogs.length > 0 && catalogs[0] ? (
                  <div>
                    {(() => {
                      const catalog = catalogs[0]; // Only one catalog per store
                      const catalogImages = [
                        catalog.image1Url,
                        catalog.image2Url,
                        catalog.image3Url,
                        catalog.image4Url,
                        catalog.image5Url,
                        catalog.image6Url,
                        catalog.image7Url,
                        catalog.image8Url,
                        catalog.image9Url,
                        catalog.image10Url,
                      ].filter(
                        (url): url is string => !!url && url.trim() !== ""
                      );
                      const sentenceCaseName =
                        catalog.name.charAt(0).toUpperCase() +
                        catalog.name.slice(1).toLowerCase();
                      return (
                        <div className="mb-8">
                          <h2 className="text-2xl font-bold text-foreground mb-2">
                            📚 {sentenceCaseName}
                          </h2>
                          {catalog.description ? (
                            <p className="text-base text-muted-foreground mb-4">
                              {catalog.description}
                            </p>
                          ) : null}
                          <CatalogCarousel
                            images={catalogImages}
                            catalogName={catalog.name}
                            onImageClick={setSelectedCatalogImage}
                          />
                        </div>
                      );
                    })()}
                  </div>
                ) : null}

                {parsedStore.menuItems.length > 0 ? (
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      {t("ui.menu")}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {parsedStore.menuItems.map((item, idx) => (
                        <div
                          key={item.id}
                          className={`relative overflow-hidden rounded-2xl shadow-md cursor-pointer transition-transform hover:scale-105 ${
                            idx === 0
                              ? "md:col-span-2 md:row-span-2 h-[420px]"
                              : "h-52"
                          }`}
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute bottom-3 left-3 bg-white/80 text-sm px-3 py-1 rounded-full font-semibold">
                            {item.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <Card className="p-5 bg-white border border-[var(--partner-border,#f1e9e6)] rounded-xl">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    {t("ui.discount_restrictions")}
                  </h2>
                  <ul className="space-y-3">
                    {discountRestrictions.map(
                      ({ icon, text, key, isAvailableDays }) => {
                        if (isAvailableDays) {
                          const days = text.split(" • ");
                          return (
                            <li
                              key={key}
                              className="border border-border rounded-lg overflow-hidden"
                            >
                              <button
                                onClick={() =>
                                  setShowRestrictions(!showRestrictions)
                                }
                                className="w-full flex items-start gap-3 text-sm p-3 hover:bg-muted/50 transition-colors"
                              >
                                <span className="text-base mt-0.5">{icon}</span>
                                <span className="text-muted-foreground flex-1 text-left">
                                  {t("ui.view_available_times")}
                                </span>
                                <ChevronDown
                                  className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 mt-0.5 ${
                                    showRestrictions ? "rotate-180" : ""
                                  }`}
                                />
                              </button>
                              {showRestrictions ? (
                                <div className="border-t border-border">
                                  {days.map((day, idx) => (
                                    <div
                                      key={idx}
                                      className={`px-3 py-2 text-sm text-muted-foreground ${
                                        idx !== days.length - 1
                                          ? "border-b border-border"
                                          : ""
                                      }`}
                                    >
                                      {day}
                                    </div>
                                  ))}
                                </div>
                              ) : null}
                            </li>
                          );
                        }

                        return (
                          <li
                            key={key}
                            className="flex items-start gap-3 text-sm"
                          >
                            <span className="text-base mt-0.5">{icon}</span>
                            <span className="text-muted-foreground">
                              {text}
                            </span>
                          </li>
                        );
                      }
                    )}
                  </ul>
                </Card>

                {/* ── Opiniones ── */}
                {!isPartnerMode && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-1">
                      {t("ui.reviews")}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-3">
                      {t(
                        "ui.visit_the_business_and_use_a_discount_to_leave_a_review"
                      )}
                    </p>

                    {(reviewsData?.data?.length ?? 0) > 0 ? (
                      <>
                        <div className="space-y-3 mb-3">
                          {reviewsData!.data.map((review) => {
                            const initials = review.userId
                              .slice(0, 2)
                              .toUpperCase();
                            return (
                              <button
                                key={review.id}
                                onClick={() => setSelectedReview(review)}
                                className="w-full flex items-start gap-3 bg-white border border-[var(--partner-border,#f1e9e6)] rounded-2xl px-4 py-3 shadow-sm hover:bg-orange-50 hover:border-orange-200 transition-colors text-left"
                              >
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-base font-bold text-[var(--partner-primary,#f97316)] shrink-0">
                                  {initials}
                                </div>
                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-gray-800 truncate">
                                    {review.title}
                                  </p>
                                  {review.description ? (
                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                      {review.description}
                                    </p>
                                  ) : null}
                                </div>
                                {/* Stars */}
                                <div className="flex gap-0.5 shrink-0">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                      key={s}
                                      className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                                    />
                                  ))}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {reviewsData!.paginationInfo.total > 3 && (
                          <button className="w-full border border-gray-300 rounded-2xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors mb-3">
                            {t("ui.view_all_reviews")}
                            {reviewsData!.paginationInfo.total})
                          </button>
                        )}
                      </>
                    ) : null}

                    {reviewsData?.data?.some((r) => r.userId === user?.id) ? (
                      <p className="w-full text-center text-sm font-semibold text-gray-400 py-3">
                        {t("ui.you_have_already_reviewed_this_place")}
                      </p>
                    ) : (
                      <button
                        onClick={() => setShowReviewModal(true)}
                        className="w-full bg-[var(--partner-primary,#fb7185)] hover:bg-[var(--partner-primary,#f43f5e)] text-white font-bold rounded-2xl py-3 text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <span>{t("ui.write_your_review")}</span>
                        <span>🍽️</span>
                        <span className="text-xs font-semibold opacity-90">
                          +{reviewPts} pts ⭐
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <aside className="space-y-6">
                <Card className="p-5 bg-white border border-[var(--partner-border,#f1e9e6)] rounded-xl shadow-md">
                  <h3 className="font-semibold mb-3">{t("ui.location_alt")}</h3>
                  {/* Hide until we sort out the map */}
                  <div className="aspect-video hidden bg-[var(--partner-primary-tint,#fbf7f6)] rounded-xl mb-3 flex items-center justify-center">
                    <span className="text-4xl">🗺️</span>
                  </div>
                  <Button
                    className="w-full bg-[var(--partner-primary,#f43f5e)] hover:bg-[var(--partner-primary,#e11d48)] text-white"
                    onClick={handleGetDirections}
                  >
                    {t("ui.get_directions")}
                  </Button>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {parsedStore.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="text-xs bg-[#faf7f6] px-3 py-1 rounded-full text-muted-foreground"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </Card>

                <Card className="p-5 bg-white border border-[var(--partner-border,#f1e9e6)] rounded-xl shadow-md">
                  <Button
                    onClick={handleShareContact}
                    className="w-full bg-white hover:bg-gray-200 text-gray-800 border border-gray-300"
                  >
                    {t("ui.share")}
                  </Button>
                </Card>
              </aside>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <UnlockDiscountModal
        isOpen={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        onWatchAd={handleWatchAdClick}
        onQuickPay={handleQuickPayClick}
      />

      {/* Video Ads Modal */}
      {!partner?.adsDisabled ? (
        <VideoAdsModal
          isOpen={showVideoAdsModal}
          onClose={() => setShowVideoAdsModal(false)}
          onSuccess={(_couponCode) => {
            setShowVideoAdsModal(false);
            setShowSuccess(true);
            navigateToCouponsWithDelay();
          }}
          discountId={selectedDiscount?.id || ""}
        />
      ) : null}

      <CongratulationsModal
        isOpen={showCongratulations}
        onComplete={() => {
          void handleCongratulationsComplete();
        }}
      />

      {/* Quick Pay Success Modal */}
      {showQuickPaySuccess && typeof window !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-6">
              <div className="bg-linear-to-br from-white to-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center animate-bounce-in">
                <Image
                  loader={contentfulImageLoader}
                  src="/success-modal.jpg"
                  alt="Success"
                  width={400}
                  height={100}
                  className="mx-auto mb-4 sm:mb-6 w-full h-auto max-w-[300px] sm:max-w-[400px]"
                />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={() => setShowQuickPaySuccess(false)}
                    className="w-full text-gray-700 bg-gray-200 font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:bg-gray-300 transition-colors shadow-lg text-sm sm:text-base"
                  >
                    {t("ui.cancel")}
                  </button>
                  <button
                    onClick={() => {
                      setShowQuickPaySuccess(false);
                      router.push("/my-coupons");
                    }}
                    className="w-full text-white bg-green-600 font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:bg-green-400 transition-colors shadow-lg text-sm sm:text-base"
                  >
                    {t("ui.view_my_coupons")}
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}

      {/* All Hours Modal */}
      {showAllHours &&
      parsedStore?.hoursStructured &&
      typeof window !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setShowAllHours(false)}
            >
              <div
                className="bg-card rounded-lg shadow-xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-bold text-foreground">
                      {t("ui.opening_hours")}
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowAllHours(false)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Hours List */}
                <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
                  {parsedStore.hoursStructured.map((item) => {
                    const currentDay = getCurrentDayOfWeek();
                    const isToday =
                      item.day.toLowerCase() ===
                      DAY_LABELS[currentDay]?.toLowerCase();

                    return (
                      <div
                        key={t(
                          "ui." +
                            (Object.keys(DAY_LABELS).find(
                              (key) => DAY_LABELS[key] === item.day
                            ) ?? ""),
                          { defaultValue: item.day }
                        )}
                        className={`flex justify-between p-3 rounded-lg transition-colors ${
                          isToday
                            ? "bg-primary/10 border-2 border-primary"
                            : "bg-muted/50"
                        }`}
                      >
                        <span
                          className={`font-medium ${
                            isToday ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {t(
                            "ui." +
                              (Object.keys(DAY_LABELS).find(
                                (key) => DAY_LABELS[key] === item.day
                              ) ?? ""),
                            { defaultValue: item.day }
                          )}
                          {isToday ? (
                            <span className="ml-2 text-xs font-semibold">
                              {t("ui.today")}
                            </span>
                          ) : null}
                        </span>
                        <span
                          className={
                            isToday
                              ? "text-primary font-medium"
                              : "text-muted-foreground"
                          }
                        >
                          {item.hours}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border">
                  <button
                    onClick={() => setShowAllHours(false)}
                    className="w-full px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-colors"
                  >
                    {t("ui.close")}
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}

      {/* Catalog Image Modal with Carousel */}
      {selectedCatalogImage && typeof window !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-50 bg-black/90 overflow-y-auto"
              onClick={() => setSelectedCatalogImage(null)}
            >
              <div className="min-h-screen flex items-center justify-center p-4">
                <div className="relative max-w-5xl w-full">
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedCatalogImage(null)}
                    className="sticky top-4 left-full ml-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  {/* Image Container with Navigation */}
                  <div
                    className="relative w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {(() => {
                      // Get the catalog and its images
                      const catalog = catalogs?.[0];
                      if (!catalog) {
                        return null;
                      }

                      const catalogImages = Array.from(
                        { length: 10 },
                        (_, i) =>
                          catalog[`image${i + 1}Url` as keyof typeof catalog]
                      ).filter((url): url is string => !!url);

                      const currentImageIndex =
                        catalogImages.indexOf(selectedCatalogImage);
                      const hasMultipleImages = catalogImages.length > 1;

                      return (
                        <>
                          {/* Main Image */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={selectedCatalogImage}
                            alt={t("ui.catalog_image")}
                            className="w-full h-auto rounded-lg"
                          />

                          {/* Navigation Controls */}
                          {hasMultipleImages && currentImageIndex !== -1 ? (
                            <>
                              {/* Previous Button */}
                              {currentImageIndex > 0 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCatalogImage(
                                      catalogImages[currentImageIndex - 1] ||
                                        null
                                    );
                                  }}
                                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all shadow-lg"
                                  aria-label={t("ui.previous_image")}
                                >
                                  <ChevronLeft className="w-6 h-6" />
                                </button>
                              )}

                              {/* Next Button */}
                              {currentImageIndex < catalogImages.length - 1 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCatalogImage(
                                      catalogImages[currentImageIndex + 1] ||
                                        null
                                    );
                                  }}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all shadow-lg"
                                  aria-label={t("ui.next_image")}
                                >
                                  <ChevronRight className="w-6 h-6" />
                                </button>
                              )}

                              {/* Image Counter */}
                              <div className="absolute bottom-6 right-6 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm">
                                {currentImageIndex + 1} / {catalogImages.length}
                              </div>

                              {/* Thumbnail Strip */}
                              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/70 px-4 py-2 rounded-full max-w-[90%] overflow-x-auto backdrop-blur-sm">
                                {catalogImages.map((imgUrl, idx) => (
                                  <button
                                    key={`${imgUrl}-${idx}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedCatalogImage(imgUrl);
                                    }}
                                    className={`hrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                                      idx === currentImageIndex
                                        ? "border-white scale-110 shadow-lg"
                                        : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                                    }`}
                                  >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={imgUrl}
                                      alt={`Thumbnail ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </button>
                                ))}
                              </div>
                            </>
                          ) : null}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}

      <GeneratingCouponModal
        isOpen={!!(couponGenerationError || quickPayError)}
        isLoading={false}
        error={couponGenerationError || quickPayError}
        onClose={() => {
          setCouponGenerationError(null);
          setQuickPayError(null);
          setShowAddFundsAction(false);
        }}
        actionButton={
          showAddFundsAction
            ? {
                label: t("ui.add_funds"),
                onClick: () => router.push("/wallet"),
              }
            : undefined
        }
      />

      <CouponAnimationPreloader />
      <CouponGenerationAnimation isOpen={showCouponAnimation} />

      {/* Review Detail Modal */}
      {!isPartnerMode && selectedReview && typeof window !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
              onClick={() => setSelectedReview(null)}
            >
              <div
                className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-black text-gray-900">
                    {t("ui.review")}
                  </h2>
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label={t("ui.close")}
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Avatar + stars */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-lg font-bold text-[var(--partner-primary,#f97316)] shrink-0">
                    {selectedReview.userId.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex gap-0.5 mb-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${s <= selectedReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Title */}
                <p className="text-base font-bold text-gray-900 mb-2">
                  {selectedReview.title}
                </p>

                {/* Description */}
                {selectedReview.description ? (
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {selectedReview.description}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    {t("ui.no_additional_description")}
                  </p>
                )}

                <button
                  onClick={() => setSelectedReview(null)}
                  className="mt-6 w-full py-2.5 bg-[var(--partner-primary,#fb7185)] hover:bg-[var(--partner-primary,#f43f5e)] text-white font-bold rounded-xl transition-colors text-sm"
                >
                  {t("ui.close")}
                </button>
              </div>
            </div>,
            document.body
          )
        : null}

      {/* Review Modal */}
      {!isPartnerMode && showReviewModal && typeof window !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
              onClick={() => {
                setShowReviewModal(false);
                setReviewPhotoUrl(null);
                setReviewPhotoPreview(null);
                setUploadPhotoError(null);
                setMuralPostDone(false);
              }}
            >
              <div
                className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-black text-gray-900">
                    {t("ui.leave_your_review")}
                  </h2>
                  <button
                    onClick={() => {
                      setShowReviewModal(false);
                      setReviewPhotoUrl(null);
                      setReviewPhotoPreview(null);
                      setUploadPhotoError(null);
                      setMuralPostDone(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none"
                  >
                    ×
                  </button>
                </div>

                {/* Store name prompt */}
                <p className="text-sm text-gray-500 mb-4">
                  {t("ui.how_was_your_experience_at")}{" "}
                  <span className="font-bold text-gray-800">
                    {parsedStore?.name}
                  </span>
                  ?
                </p>

                {/* Star rating */}
                <div className="flex justify-center gap-2 mb-5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setReviewHover(star)}
                      onMouseLeave={() => setReviewHover(0)}
                      className="text-3xl transition-transform active:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (reviewHover || reviewRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Title input */}
                <div className="mb-3">
                  <input
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder={t("ui.review_title_at_least_3_characters")}
                    maxLength={100}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                {/* Text area */}
                <div className="mb-4">
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder={t("ui.tell_us_more_optional")}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                {/* Post to Mural — independent of review */}
                {canPostMural ? (
                  <div className="mb-3 border border-gray-200 rounded-xl p-3 space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {t("ui.post_to_city_mural")}
                    </p>
                    {reviewPhotoPreview ? (
                      <div className="relative w-full rounded-xl overflow-hidden border border-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={reviewPhotoPreview}
                          alt="Preview"
                          className="w-full object-cover max-h-40"
                        />
                        {!!isUploadingPhoto && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                          </div>
                        )}
                        {!!canPostMural &&
                          !isUploadingPhoto &&
                          !muralPostDone && (
                            <button
                              onClick={() => {
                                setReviewPhotoUrl(null);
                                setReviewPhotoPreview(null);
                                setUploadPhotoError(null);
                              }}
                              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
                              aria-label={t("ui.remove_photo")}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => reviewPhotoRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-xl py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <span>📷</span>
                        {t("ui.add_photo")}
                        <span className="text-xs text-[var(--partner-primary,#fb7185)] font-bold">
                          +{muralPts} pts 📸
                        </span>
                      </button>
                    )}
                    <input
                      ref={reviewPhotoRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        void (async () => {
                          const file = e.target.files?.[0];
                          if (!file) {
                            return;
                          }
                          if (
                            !["image/jpeg", "image/png", "image/webp"].includes(
                              file.type
                            )
                          ) {
                            setUploadPhotoError(
                              t("ui.only_jpg_png_and_webp_are_allowed")
                            );
                            return;
                          }
                          if (file.size > 5 * 1024 * 1024) {
                            setUploadPhotoError(
                              t("ui.image_must_be_under_5mb")
                            );
                            return;
                          }
                          setUploadPhotoError(null);
                          setMuralPostDone(false);
                          setReviewPhotoPreview(URL.createObjectURL(file));
                          setIsUploadingPhoto(true);
                          try {
                            const apiUrl =
                              process.env.NEXT_PUBLIC_API_URL ??
                              "http://localhost:4000/graphql";
                            const baseUrl = apiUrl.replace("/graphql", "");
                            const formData = new FormData();
                            formData.append("file", file);
                            const res = await fetch(
                              `${baseUrl}/upload/mural-image`,
                              {
                                method: "POST",
                                headers: {
                                  Authorization: `Bearer ${accessToken}`,
                                  ...(apiUrl.includes("ngrok") && {
                                    "ngrok-skip-browser-warning": "true",
                                  }),
                                },
                                body: formData,
                              }
                            );
                            if (!res.ok) {
                              throw new Error("Upload failed");
                            }
                            const json = (await res.json()) as { url: string };
                            setReviewPhotoUrl(json.url);
                          } catch {
                            setUploadPhotoError(
                              t("ui.upload_failed_please_try_again")
                            );
                            setReviewPhotoPreview(null);
                          } finally {
                            setIsUploadingPhoto(false);
                          }
                        })();
                      }}
                    />
                    {!!uploadPhotoError && (
                      <p className="text-xs text-red-500">{uploadPhotoError}</p>
                    )}
                  </div>
                ) : null}

                {/* Publish review + mural post */}
                {(() => {
                  const hasReview =
                    reviewRating > 0 && reviewTitle.trim().length >= 3;
                  const hasMural = !!reviewPhotoUrl && canPostMural;
                  const canSubmit =
                    (hasReview || hasMural) &&
                    !isUploadingPhoto &&
                    !isSubmittingReview;

                  return (
                    <Button
                      disabled={!canSubmit}
                      onClick={() => {
                        void (async () => {
                          if (!storeId) {
                            return;
                          }
                          setIsSubmittingReview(true);
                          try {
                            const tasks: Promise<unknown>[] = [];
                            if (hasReview) {
                              tasks.push(
                                graphqlRequest(CREATE_REVIEW_MUTATION, {
                                  input: {
                                    storeId,
                                    title: reviewTitle.trim(),
                                    description: reviewText.trim() || undefined,
                                    rating: reviewRating,
                                  },
                                })
                              );
                            }
                            if (hasMural) {
                              tasks.push(
                                graphqlRequest(CREATE_MURAL_POST_MUTATION, {
                                  input: { storeId, imageUrl: reviewPhotoUrl },
                                })
                              );
                            }

                            const results = await Promise.allSettled(tasks);
                            const reviewResult = hasReview ? results[0] : null;
                            const muralResult = hasMural
                              ? results[hasReview ? 1 : 0]
                              : null;

                            if (reviewResult?.status === "rejected") {
                              const msg =
                                reviewResult.reason instanceof Error
                                  ? reviewResult.reason.message
                                  : "";
                              const isDuplicate =
                                msg.includes("already reviewed") ||
                                msg.includes("409");
                              toast({
                                variant: "destructive",
                                title: isDuplicate
                                  ? t("ui.you_have_already_left_a_review")
                                  : t("ui.unable_to_post_review"),
                                description: isDuplicate
                                  ? t(
                                      "ui.you_can_only_leave_one_review_per_place"
                                    )
                                  : t("ui.try_again"),
                              });
                            }

                            if (muralResult?.status === "rejected") {
                              toast({
                                variant: "destructive",
                                title: t("ui.unable_to_post_photo"),
                                description: t(
                                  "ui.the_photo_could_not_be_posted_to_the_mural"
                                ),
                              });
                            }

                            if (
                              reviewResult?.status !== "rejected" &&
                              muralResult?.status !== "rejected"
                            ) {
                              toast({
                                title:
                                  hasReview && hasMural
                                    ? t("ui.review_and_photo_posted")
                                    : hasReview
                                      ? t("ui.review_posted")
                                      : t("ui.photo_posted_to_the_mural"),
                                description: t(
                                  "ui.thanks_for_your_contribution"
                                ),
                              });
                            }

                            if (hasReview) {
                              void queryClient.invalidateQueries({
                                queryKey: ["storeReviews", storeId],
                              });
                            }

                            setShowReviewModal(false);
                            setReviewRating(0);
                            setReviewTitle("");
                            setReviewText("");
                            setReviewPhotoUrl(null);
                            setReviewPhotoPreview(null);
                            setUploadPhotoError(null);
                            setMuralPostDone(false);
                          } finally {
                            setIsSubmittingReview(false);
                          }
                        })();
                      }}
                      className="w-full bg-[var(--partner-primary,#fb7185)] hover:bg-[var(--partner-primary,#f43f5e)] text-white font-bold rounded-xl py-3 disabled:opacity-50"
                    >
                      {isSubmittingReview ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          {t("ui.posting")}
                        </>
                      ) : (
                        <>
                          {hasReview && hasMural ? (
                            <>
                              {t("ui.post_review_and_photo")}{" "}
                              <span className="ml-1 text-xs">+60 pts 📸</span>
                            </>
                          ) : hasReview ? (
                            <>
                              {t("ui.post_review")}{" "}
                              <span className="ml-1 text-xs">
                                +10 pts Yummy
                              </span>
                            </>
                          ) : hasMural ? (
                            <>
                              {t("ui.post_photo_to_the_mural")}{" "}
                              <span className="ml-1 text-xs">
                                +{muralPts} pts 📸
                              </span>
                            </>
                          ) : (
                            <>
                              {t("ui.post_review")}{" "}
                              <span className="ml-1 text-xs">
                                +10 pts Yummy
                              </span>
                            </>
                          )}
                        </>
                      )}
                    </Button>
                  );
                })()}
              </div>
            </div>,
            document.body
          )
        : null}
    </BasicLayout>
  );
}
