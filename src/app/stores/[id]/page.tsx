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
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { CongratulationsModal } from "@/components/CongratulationsModal";
import { MapDisplay } from "@/components/MapDisplay";
import { UnlockDiscountModal } from "@/components/UnlockDiscountModal";
import { VideoAdsModal } from "@/components/VideoAdsModal";
import { PlaceHolderTypeEnum } from "@/data/constants";
import { useStoreDiscounts, useStoreCatalogs } from "@/domains/admin/hooks";
import { GeneratingCouponModal } from "@/domains/coupons/GeneratingCouponModal";
import { useWallet } from "@/domains/payment/hooks";
import { CatalogCarousel } from "@/domains/store/components/CatalogCarousel";
import { useStore } from "@/domains/store/hooks";
import { useStoreReviews } from "@/domains/store/hooks/query/useStoreReviews";
import type { ParsedStore } from "@/domains/store/type";
import { getDiscountRestrictions } from "@/domains/store/utils";
import { useMyLevel } from "@/domains/user/hooks/query/useMyLevel";
import { useToast } from "@/hooks/use-toast";
import { useDiscountCountdown } from "@/hooks/useDiscountCountdown";
import { BasicLayout } from "@/layouts/BasicLayout";
import { convertTo12Hour } from "@/lib/date-time-utils";
import { graphqlRequest } from "@/lib/graphql-client";
import {
  GENERATE_COUPON_MUTATION,
  QUICK_PAY_FOR_DISCOUNT_MUTATION,
  EXCHANGE_UNLOCK_MUTATION,
  CREATE_REVIEW_MUTATION,
  CREATE_MURAL_POST_MUTATION,
} from "@/lib/graphql-queries";
import { contentfulImageLoader } from "@/lib/image-utils";
import { openInGoogleMaps } from "@/lib/maps";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { useAuthStore } from "@/store/useAuthStore";

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

export default function StoresDetailPage(): React.JSX.Element {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, user, accessToken } = useAuthStore();
  const { data: userLevel } = useMyLevel();

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllHours, setShowAllHours] = useState(false);
  const [showRestrictions, setShowRestrictions] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showVideoAdsModal, setShowVideoAdsModal] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [_, setShowSuccess] = useState(false);
  const [isGeneratingCoupon, setIsGeneratingCoupon] = useState(false);
  const [couponGenerationError, setCouponGenerationError] = useState<
    string | null
  >(null);
  const [quickPayError, setQuickPayError] = useState<string | null>(null);
  const [showAddFundsAction, setShowAddFundsAction] = useState(false);
  const [showQuickPaySuccess, setShowQuickPaySuccess] = useState(false);
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

  const { data: wallet } = useWallet({ userId: user?.id });
  // Get store ID from params
  const storeId = (params?.id as string) || null;
  const { data: store, isLoading } = useStore(storeId);

  // Fetch discounts for this store
  const { data: discountsData, isLoading: isLoadingDiscounts } =
    useStoreDiscounts({ storeId: storeId }, { page: 1, first: 10 });
  const discountRestrictions = getDiscountRestrictions(
    discountsData?.data?.[0]
  );

  // Fetch catalogs for this store
  const { data: catalogs = [] } = useStoreCatalogs(storeId || "");

  // Fetch reviews for this store
  const { data: reviewsData } = useStoreReviews(storeId, { first: 3 });

  // Get the first active discount for this store
  const firstActiveDiscount = discountsData?.data?.find((d) => d.active);
  const isRestaurant =
    store?.type === "RESTAURANT" || store?.type === "PRODUCT";
  const storeCategoryType = isRestaurant ? "Restaurant" : "Store";

  // Use optimized countdown hook
  const { isValid: isValidDiscount, countdownText: timeUntilNext } =
    useDiscountCountdown(discountsData?.data?.[0]);

  if (!isLoading && !store) {
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
                          ? `${dayLabel}: Cerrado`
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

                return formattedHours || "Horario no disponible";
              })()
            : "Horario no disponible",
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
                          ? "Cerrado"
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
          address: store.address || "Dirección no disponible",
          city: store.city || "Ciudad no disponible",
          lat: store.lat,
          lng: store.lng,
          placeId: store.placeId,
        },
        phone: store.phoneNumber || "Teléfono no disponible",
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
            : ["Comodidades no disponibles"],
      }
    : null;

  const handleUnlockDiscountClick = (): void => {
    if (!isAuthenticated) {
      toast({
        variant: "default",
        title: "Inicio de sesión requerido",
        description: "Por favor inicia sesión para desbloquear descuentos.",
      });
      router.push("/");
      return;
    }

    // Set the selected discount
    const firstActive = discountsData?.data?.find((d) => d.active);
    if (firstActive) {
      setSelectedDiscount({ id: firstActive.id });
    }

    // If user is premium, directly unlock discount
    if (user?.isPremium) {
      void handleUnlockDiscount();
    } else {
      // Show modal for free users
      setShowUnlockModal(true);
    }
  };

  const handleWatchAdClick = (): void => {
    setShowUnlockModal(false);
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
        description:
          "Token de desbloqueo faltante. Por favor intenta de nuevo.",
      });
      setShowCongratulations(false);
      return;
    }

    try {
      // Get the first active discount for this store
      const firstActiveDiscount = discountsData?.data?.find((d) => d.active);

      if (!firstActiveDiscount) {
        toast({
          variant: "destructive",
          title: "No hay descuentos disponibles",
          description:
            "Esta tienda no tiene descuentos activos en este momento.",
        });
        setShowCongratulations(false);
        return;
      }

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
          discountId: firstActiveDiscount.id,
        },
      });

      if (exchangeData?.exchangeUnlock) {
        // Invalidate coupons cache
        try {
          void queryClient.invalidateQueries({ queryKey: ["coupons"] });
        } catch (_e) {
          // ignore
        }

        setShowCongratulations(false);
        setShowSuccess(true);
        setUnlockToken(null);
      }
    } catch (error) {
      console.error("Error exchanging unlock token:", error);
      toast({
        variant: "destructive",
        title: "Error al desbloquear el cupón",
        description:
          error instanceof Error
            ? error.message
            : "Por favor intenta de nuevo.",
      });
      setShowCongratulations(false);
    }
  };

  const handleUnlockDiscount = async (): Promise<void> => {
    if (!isAuthenticated) {
      toast({
        variant: "default",
        title: "Inicio de sesión requerido",
        description: "Por favor inicia sesión para desbloquear descuentos.",
      });
      router.push("/");
      return;
    }

    // Get the first active discount for this store
    const firstActiveDiscount = discountsData?.data?.find((d) => d.active);

    if (!firstActiveDiscount) {
      toast({
        variant: "destructive",
        title: "No hay descuentos disponibles",
        description: "Esta tienda no tiene descuentos activos en este momento.",
      });
      return;
    }

    const discountId = firstActiveDiscount.id;

    try {
      // Set loading state for premium users
      setIsGeneratingCoupon(true);
      setCouponGenerationError(null);

      const data = await graphqlRequest<{
        generateCoupon: {
          code: string;
          qrCode: string;
          url: string;
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
        toast({
          title: "Cupón creado",
          description: "Cupón agregado a Mis Cupones.",
        });
        // Ensure coupons cache is refreshed so UI shows the new coupon
        try {
          void queryClient.invalidateQueries({ queryKey: ["coupons"] });
        } catch (_e) {
          // ignore
        }
        router.push("/my-coupons");
      } else {
        throw new Error("No se recibió cupón del servidor");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setCouponGenerationError(message);
    }
  };

  const handleQuickPay = async (): Promise<void> => {
    if (!isAuthenticated) {
      toast({
        variant: "default",
        title: "Inicio de sesión requerido",
        description: "Por favor inicia sesión para usar Pago Rápido.",
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

    try {
      setIsGeneratingCoupon(true);

      const data = await graphqlRequest<{
        quickPayForDiscount: {
          code: string;
          qrCode: string;
          url: string;
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
        discountId: firstActiveDiscount?.id,
      });

      if (data?.quickPayForDiscount) {
        try {
          void queryClient.invalidateQueries({ queryKey: ["coupons"] });
        } catch (_e) {
          // ignore
        }
        setIsGeneratingCoupon(false);
        setShowQuickPaySuccess(true);
      } else {
        setIsGeneratingCoupon(false);
        throw new Error("Pago Rápido falló");
      }
    } catch (err) {
      setIsGeneratingCoupon(false);
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
            title: "Copied to clipboard!",
            description: `${storeCategoryType} details have been copied. Share them with friends!`,
          });
        })
        .catch((error) => {
          console.error("Error copying to clipboard:", error);
          toast({
            variant: "destructive",
            title: "Copy failed",
            description: "Unable to copy to clipboard. Please copy manually.",
          });
        });
    } else {
      // Fallback for browsers without clipboard API
      toast({
        variant: "destructive",
        title: "Share not supported",
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
              Loading restaurant details...
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
              {storeCategoryType} not found
            </p>
            <Button onClick={() => router.push("/restaurants")}>
              Back to ${storeCategoryType}s
            </Button>
          </div>
        </div>
      ) : (
        <div className="pt-14 pb-16">
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
                  <div className="inline-flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{parsedStore.rating}</span>
                    <span className="text-sm">
                      ({parsedStore.reviewCount} reviews)
                    </span>
                  </div>
                </div>
                {parsedStore.isAdPartner ? (
                  <div className="mt-3 inline-block bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                    ⭐ Ad Partner
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-3xl overflow-hidden shadow-glow">
                  <div className="p-6 md:p-8 bg-linear-to-br from-rose-300 via-amber-300 to-lime-200 rounded-3xl">
                    <div className="max-w-5xl mx-auto text-center text-white">
                      <h2 className="text-2xl md:text-3xl font-bold mb-2">
                        🎉 {parsedStore.discount.percentage}% de descuento con
                        Ñamy!
                      </h2>
                      <p className="text-white/90 mb-1 text-sm">
                        {user?.isPremium
                          ? "Como miembro premium, ¡desbloquea instantáneamente!"
                          : "Solo muestra tu código QR después de ver un anuncio"}
                      </p>
                      {/* <p className="text-xs text-white/80 mb-4">
                        +{restaurant.discount.points} Ñamy points when using
                        this discount
                      </p> */}
                      <div className="mt-4">
                        {isValidDiscount ? (
                          <Button
                            onClick={handleUnlockDiscountClick}
                            className="w-full bg-white text-rose-600 hover:bg-white/95 font-bold rounded-full shadow-lg py-4"
                          >
                            {user?.isPremium
                              ? "Desbloquear descuento ahora"
                              : "Desbloquear descuento"}
                          </Button>
                        ) : (
                          <div className="text-center text-white bg-black/50 px-4 py-3 rounded-full">
                            {isLoadingDiscounts ? (
                              <Loader2 className="mx-auto animate-spin" />
                            ) : (
                              <div className="flex flex-col gap-1">
                                <p className="text-sm font-semibold">
                                  Descuento no disponible en este momento
                                </p>
                                {timeUntilNext ? (
                                  <p className="text-xs text-white/80">
                                    Disponible en:{" "}
                                    <span className="font-mono font-bold">
                                      {timeUntilNext}
                                    </span>
                                  </p>
                                ) : null}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="p-6 space-y-4 bg-white border border-[#f1e9e6] rounded-xl shadow-md">
                  {parsedStore.hoursStructured &&
                  parsedStore.hoursStructured.length > 0 ? (
                    <>
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-foreground mb-3">
                            Horario de Hoy
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
                                    {todayHours.day}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {todayHours.hours}
                                  </span>
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No hay horario para hoy
                                </p>
                              );
                            })()}
                          </div>
                          <button
                            onClick={() => setShowAllHours(true)}
                            className="mt-3 text-sm text-primary hover:text-primary/80 transition-colors underline"
                          >
                            Ver todos los horarios
                          </button>
                        </div>
                      </div>

                      <div className="h-px bg-border" />
                    </>
                  ) : null}

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Location</p>
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
                        Obtener indicaciones 📍
                      </Button>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  {parsedStore.phone.length > 0 ? (
                    <>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-rose-500 shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">Phone</p>
                          <a
                            href={`tel:${parsedStore.phone}`}
                            className="text-sm text-rose-600 hover:underline"
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
                        Contact via WhatsApp
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
                      📖 Menu
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

                <Card className="p-5 bg-white border border-[#f1e9e6] rounded-xl">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    🕑 Discount Restrictions
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
                                  Ver horarios disponibles
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
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-3">
                    ⭐ Opiniones
                  </h2>

                  {(reviewsData?.data?.length ?? 0) > 0 ? (
                    <>
                      <div className="space-y-3 mb-3">
                        {reviewsData!.data.map((review) => {
                          const initials = review.userId
                            .slice(0, 2)
                            .toUpperCase();
                          return (
                            <div
                              key={review.id}
                              className="flex items-start gap-3 bg-white border border-[#f1e9e6] rounded-2xl px-4 py-3 shadow-sm"
                            >
                              {/* Avatar */}
                              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-base font-bold text-orange-500 shrink-0">
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
                            </div>
                          );
                        })}
                      </div>

                      {reviewsData!.paginationInfo.total > 3 && (
                        <button className="w-full border border-gray-300 rounded-2xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors mb-3">
                          Ver todas las reseñas (
                          {reviewsData!.paginationInfo.total})
                        </button>
                      )}
                    </>
                  ) : null}

                  {reviewsData?.data?.some((r) => r.userId === user?.id) ? (
                    <p className="w-full text-center text-sm font-semibold text-gray-400 py-3">
                      ✓ Ya dejaste una reseña aquí
                    </p>
                  ) : (
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="w-full bg-rose-400 hover:bg-rose-500 text-white font-bold rounded-2xl py-3 text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Escribe tu reseña</span>
                      <span>🍽️</span>
                      <span className="text-xs font-semibold opacity-90">
                        +50 pts 📸
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <aside className="space-y-6">
                <Card className="p-5 bg-white border border-[#f1e9e6] rounded-xl shadow-md">
                  <h3 className="font-semibold mb-3">📍 Location</h3>
                  {/* Hide until we sort out the map */}
                  <div className="aspect-video hidden bg-[#fbf7f6] rounded-xl mb-3 flex items-center justify-center">
                    <span className="text-4xl">🗺️</span>
                  </div>
                  <Button
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white"
                    onClick={handleGetDirections}
                  >
                    Obtener indicaciones 📍
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

                <Card className="p-5 bg-white border border-[#f1e9e6] rounded-xl shadow-md">
                  <Button
                    onClick={handleShareContact}
                    className="w-full bg-white hover:bg-gray-200 text-gray-800 border border-gray-300"
                  >
                    Compartir
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
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      setShowQuickPaySuccess(false);
                      router.push("/my-coupons");
                    }}
                    className="w-full text-white bg-green-600 font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:bg-green-400 transition-colors shadow-lg text-sm sm:text-base"
                  >
                    Ver Mis Cupones
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
                      Horario de Apertura
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
                        key={item.day}
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
                          {item.day}
                          {isToday ? (
                            <span className="ml-2 text-xs font-semibold">
                              (Hoy)
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
                    Cerrar
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
                            alt="Catalog image"
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
                                  aria-label="Previous image"
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
                                  aria-label="Next image"
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
        isOpen={isGeneratingCoupon || !!quickPayError}
        isLoading={
          !!(isGeneratingCoupon && !couponGenerationError && !quickPayError)
        }
        error={couponGenerationError || quickPayError}
        onClose={() => {
          setIsGeneratingCoupon(false);
          setCouponGenerationError(null);
          setQuickPayError(null);
          setShowAddFundsAction(false);
        }}
        actionButton={
          showAddFundsAction
            ? {
                label: "Agregar Fondos",
                onClick: () => router.push("/wallet"),
              }
            : undefined
        }
      />

      {/* Review Modal */}
      {showReviewModal && typeof window !== "undefined"
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
                    Leave your review
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
                  ¿Cómo fue tu experiencia en{" "}
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
                    placeholder="Título de tu reseña (mínimo 3 caracteres)"
                    maxLength={100}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                {/* Text area */}
                <div className="mb-4">
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Cuéntanos más (opcional)..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                {/* Post to Mural — independent of review */}
                <div className="mb-3 border border-gray-200 rounded-xl p-3 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Post to City Mural
                  </p>
                  {reviewPhotoPreview ? (
                    <div className="relative w-full rounded-xl overflow-hidden border border-gray-200">
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
                      {!isUploadingPhoto && !muralPostDone && (
                        <button
                          onClick={() => {
                            setReviewPhotoUrl(null);
                            setReviewPhotoPreview(null);
                            setUploadPhotoError(null);
                          }}
                          className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
                          aria-label="Remove photo"
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
                      Add photo
                      <span className="text-xs text-rose-400 font-bold">
                        +50 pts 📸
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
                            "Only JPG, PNG, and WebP are allowed."
                          );
                          return;
                        }
                        if (file.size > 5 * 1024 * 1024) {
                          setUploadPhotoError("Image must be under 5MB.");
                          return;
                        }
                        setUploadPhotoError(null);
                        setMuralPostDone(false);
                        setReviewPhotoPreview(URL.createObjectURL(file));
                        setIsUploadingPhoto(true);
                        try {
                          const baseUrl = (
                            process.env.NEXT_PUBLIC_API_URL ??
                            "http://localhost:4000/graphql"
                          ).replace("/graphql", "");
                          const formData = new FormData();
                          formData.append("file", file);
                          const res = await fetch(
                            `${baseUrl}/upload/mural-image`,
                            {
                              method: "POST",
                              headers: {
                                Authorization: `Bearer ${accessToken}`,
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
                            "Failed to upload. Please try again."
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

                {/* Publish review + mural post */}
                {(() => {
                  const hasReview =
                    reviewRating > 0 && reviewTitle.trim().length >= 3;
                  const hasMural = !!reviewPhotoUrl;
                  const canSubmit =
                    (hasReview || hasMural) &&
                    !isUploadingPhoto &&
                    !isSubmittingReview;

                  return (
                    <Button
                      disabled={!canSubmit}
                      onClick={() => {
                        void (async () => {
                          if (!storeId) {return;}
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
                                  ? "Ya dejaste una reseña"
                                  : "Error al publicar reseña",
                                description: isDuplicate
                                  ? "Solo puedes dejar una reseña por lugar."
                                  : "Intenta de nuevo.",
                              });
                            }

                            if (muralResult?.status === "rejected") {
                              toast({
                                variant: "destructive",
                                title: "Error al publicar foto",
                                description:
                                  "La foto no pudo subirse al mural.",
                              });
                            }

                            if (
                              reviewResult?.status !== "rejected" &&
                              muralResult?.status !== "rejected"
                            ) {
                              toast({
                                title:
                                  hasReview && hasMural
                                    ? "¡Reseña y foto publicadas!"
                                    : hasReview
                                      ? "Reseña publicada"
                                      : "Foto publicada en el mural",
                                description: "¡Gracias por tu aportación!",
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
                      className="w-full bg-rose-400 hover:bg-rose-500 text-white font-bold rounded-xl py-3 disabled:opacity-50"
                    >
                      {isSubmittingReview ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Publicando...
                        </>
                      ) : (
                        <>
                          {hasReview && hasMural ? (
                            <>
                              Publicar reseña y foto{" "}
                              <span className="ml-1 text-xs">+60 pts 📸</span>
                            </>
                          ) : hasReview ? (
                            <>
                              Publicar reseña{" "}
                              <span className="ml-1 text-xs">
                                +10 pts Yummy
                              </span>
                            </>
                          ) : hasMural ? (
                            <>
                              Publicar foto al mural{" "}
                              <span className="ml-1 text-xs">+50 pts 📸</span>
                            </>
                          ) : (
                            <>
                              Publicar reseña{" "}
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
