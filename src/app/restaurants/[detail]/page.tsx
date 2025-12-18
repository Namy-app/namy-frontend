// Restaurant detail page (redesigned, with coupon generation)

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
} from "lucide-react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

import { CongratulationsModal } from "@/components/CongratulationsModal";
import { DiscountSuccessModal } from "@/components/DiscountSuccessModal";
import { RewardedVideoAd } from "@/components/RewardedVideoAd";
import { UnlockDiscountModal } from "@/components/UnlockDiscountModal";
import { PlaceHolderTypeEnum } from "@/data/constants";
import { StoreType } from "@/domains/admin";
import { useStoreDiscounts, useStoreCatalogs } from "@/domains/admin/hooks";
import { useWallet } from "@/domains/payment/hooks";
import { useStore } from "@/domains/store/hooks";
import { useMyLevel } from "@/domains/user/hooks/query/useMyLevel";
import { useToast } from "@/hooks/use-toast";
import { BasicLayout } from "@/layouts/BasicLayout";
import { graphqlRequest } from "@/lib/graphql-client";
import {
  GENERATE_COUPON_MUTATION,
  QUICK_PAY_FOR_DISCOUNT_MUTATION,
  REWARD_AD_MUTATION,
  EXCHANGE_UNLOCK_MUTATION,
} from "@/lib/graphql-queries";
import { openInGoogleMaps } from "@/lib/maps";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { useAuthStore } from "@/store/useAuthStore";

// Utility function to convert 24-hour time to 12-hour AM/PM format
function convertTo12Hour(time24: string): string {
  const parts = time24.split(":");
  const hours = parseInt(parts[0] || "0", 10);
  const minutes = parseInt(parts[1] || "0", 10);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

// Catalog Carousel Component
const CatalogCarousel = ({
  images,
  catalogName,
  onImageClick,
}: {
  images: string[];
  catalogName: string;
  onImageClick: (url: string) => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) return null;

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-lg bg-muted">
        <Image
          src={images[currentIndex] || ""}
          alt={`${catalogName} - Image ${currentIndex + 1}`}
          fill
          className="object-cover cursor-pointer"
          unoptimized
          onClick={() => onImageClick(images[currentIndex] || "")}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? "border-primary scale-105"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Restaurant type definition
interface Restaurant {
  id: string;
  name: string;
  category: string;
  emoji: string;
  rating: number;
  reviewCount: number;
  isAdPartner: boolean;
  discount: {
    id?: string;
    percentage: number;
    points: number;
    restrictions: string[];
  };
  hours: string;
  hoursStructured?: Array<{ day: string; hours: string }>;
  location: {
    address: string;
    city: string;
    lat?: number;
    lng?: number;
  };
  phone: string;
  images: string[];
  menuItems: Array<{ id: string; name: string; image: string }>;
  reviews: Array<{
    id: string;
    name: string;
    avatar: string;
    rating: number;
    comment: string;
  }>;
  amenities: string[];
}

export default function RestaurantDetailPage(): React.JSX.Element {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, user } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showVideoAd, setShowVideoAd] = useState(false);
  const [adsWatched, setAdsWatched] = useState(0);
  const [totalAdsRequired] = useState(2);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [unlockToken, setUnlockToken] = useState<string | null>(null);
  const [selectedCatalogImage, setSelectedCatalogImage] = useState<
    string | null
  >(null);

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

  const { data: userLevel } = useMyLevel();
  const { data: wallet } = useWallet({ userId: user?.id });
  // Get restaurant ID from params
  const storeId = (params?.detail as string) || null;
  const { data: store, isLoading } = useStore(storeId);

  // Fetch discounts for this store
  const { data: discountsData } = useStoreDiscounts(
    { storeId: storeId },
    { page: 1, first: 10 }
  );

  // Fetch catalogs for this store
  const { data: catalogs = [] } = useStoreCatalogs(storeId || "");

  // Get the first active discount for this store
  const firstActiveDiscount = discountsData?.data?.find((d) => d.active);

  if (!isLoading && !store) {
    router.push("/explore");
    return <></>;
  }

  // Convert store data to restaurant format for the UI
  const parsedStore: Restaurant | null = store
    ? {
        id: store.id,
        name: store.name,
        category: store.categoryId || store.subCategory || "Restaurant",
        emoji: store.type === StoreType.PRODUCT ? "🍽️" : "🔧",
        rating: store.averageRating ?? 4.5,
        reviewCount: store.reviewCounter ?? 0,
        isAdPartner: false,
        discount: {
          id: store.id,
          percentage: userLevel?.discountPercentage ?? 10,
          points: 0,
          restrictions: [
            "Show your QR code before paying",
            "Valid for dine-in only",
            "Cannot be combined with other offers",
          ],
          // id: firstActiveDiscount?.id,
          // percentage:
          //   firstActiveDiscount?.type === "PERCENTAGE"
          //     ? firstActiveDiscount.value
          //     : firstActiveDiscount?.type === "FIXED_AMOUNT"
          //       ? Math.round((firstActiveDiscount.value / 100) * 10) // Convert fixed amount to approximate percentage
          //       : 15, // Fallback if no discount
          // points: firstActiveDiscount?.usedCount ?? 0, // Use actual usage count
          // restrictions: firstActiveDiscount?.description
          //   ? [firstActiveDiscount.description]
          //   : [
          //       "Show your QR code before paying",
          //       "Valid for dine-in only",
          //       "Cannot be combined with other offers",
          //     ],
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
                      }) =>
                        day.closed
                          ? `${day.day}: Closed`
                          : `${day.day}: ${day.startTime} - ${day.endTime}`
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
                    const dayName = day.charAt(0).toUpperCase() + day.slice(1);
                    if (hours && hours.open && hours.close) {
                      return `${dayName}: ${hours.open} - ${hours.close}`;
                    }
                    return null;
                  })
                  .filter(Boolean)
                  .join(", ");

                return formattedHours || "Hours not available";
              })()
            : "Hours not available",
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
                    }) => ({
                      day: day.day,
                      hours: day.closed
                        ? "Closed"
                        : `${convertTo12Hour(day.startTime || "")} - ${convertTo12Hour(day.endTime || "")}`,
                    })
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
                    const dayName = day.charAt(0).toUpperCase() + day.slice(1);
                    if (hours && hours.open && hours.close) {
                      return {
                        day: dayName,
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
          address: store.address || "Address not available",
          city: store.city || "City not available",
          lat: store.lat,
          lng: store.lng,
        },
        phone: store.phoneNumber || "Phone not available",
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
                store.categoryId?.toLowerCase() === "restaurant"
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
            : ["Store amenities not available"],
      }
    : null;

  const handleUnlockDiscountClick = (): void => {
    if (!isAuthenticated) {
      toast({
        variant: "default",
        title: "Sign in required",
        description: "Please sign in to unlock discounts.",
      });
      router.push("/");
      return;
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
    setShowVideoAd(true);
  };

  const handleQuickPayClick = (): void => {
    setShowUnlockModal(false);
    void handleQuickPay();
  };

  const handleVideoComplete = async (): Promise<void> => {
    try {
      // Call rewardAd mutation to record the ad view
      const rewardData = await graphqlRequest<{
        rewardAd: {
          canGenerateCoupon: boolean;
          remaining?: number;
          token?: string;
          adsWatched?: number;
        };
      }>(REWARD_AD_MUTATION, {
        input: {
          adUnitId: process.env.NEXT_PUBLIC_ADMOB_AD_UNIT_ID || "test-ad-unit",
          rewardToken: `reward-${Date.now()}-${Math.random()}`,
          deviceId:
            typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        },
      });

      const newAdsWatched = rewardData.rewardAd.adsWatched ?? adsWatched + 1;
      setAdsWatched(newAdsWatched);

      if (rewardData.rewardAd.canGenerateCoupon && rewardData.rewardAd.token) {
        // Got unlock token, exchange it for coupon
        setUnlockToken(rewardData.rewardAd.token);
        setShowVideoAd(false);
        setShowCongratulations(true);
      } else {
        // Show message and prepare for next ad
        const remaining =
          rewardData.rewardAd.remaining ?? totalAdsRequired - newAdsWatched;
        toast({
          title: `Ad ${newAdsWatched} of ${totalAdsRequired} complete`,
          description: `Watch ${remaining} more ad${remaining !== 1 ? "s" : ""} to unlock your discount.`,
        });
        setShowVideoAd(false);
        // Automatically show next ad after a short delay
        setTimeout(() => {
          setShowVideoAd(true);
        }, 1500);
      }
    } catch (error) {
      console.error("Error recording ad view:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to record ad view. Please try again.",
      });
      setShowVideoAd(false);
    }
  };

  const handleCongratulationsComplete = async (): Promise<void> => {
    if (!unlockToken || !parsedStore) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Missing unlock token. Please try again.",
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
          title: "No discounts available",
          description:
            "This store doesn't have any active discounts at the moment.",
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
        title: "Failed to unlock coupon",
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
      setShowCongratulations(false);
    }
  };

  const handleVideoSkip = (): void => {
    toast({
      variant: "default",
      title: "Ad skipped",
      description: "Please watch the full video to unlock your coupon.",
    });
    setShowVideoAd(false);
  };

  const handleUnlockDiscount = async (): Promise<void> => {
    if (!parsedStore) {
      return;
    }

    if (!isAuthenticated) {
      toast({
        variant: "default",
        title: "Sign in required",
        description: "Please sign in to unlock discounts.",
      });
      router.push("/");
      return;
    }

    // Get the first active discount for this store
    const firstActiveDiscount = discountsData?.data?.find((d) => d.active);

    if (!firstActiveDiscount) {
      toast({
        variant: "destructive",
        title: "No discounts available",
        description:
          "This store doesn't have any active discounts at the moment.",
      });
      return;
    }

    const discountId = firstActiveDiscount.id;

    try {
      toast({ title: "Generating coupon...", description: "Please wait." });

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
        throw new Error("No coupon returned from server");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast({
        variant: "destructive",
        title: "Failed to create coupon",
        description: message,
      });
    }
  };

  const handleQuickPay = async (): Promise<void> => {
    if (!parsedStore) {
      return;
    }

    if (!isAuthenticated) {
      toast({
        variant: "default",
        title: "Sign in required",
        description: "Please sign in to use Quick Pay.",
      });
      router.push("/");
      return;
    }

    // Check if discount ID is available
    if (!parsedStore.discount?.id) {
      toast({
        variant: "destructive",
        title: "No discount available",
        description:
          "This store doesn't have any active discounts at the moment.",
      });
      return;
    }

    // Check wallet balance before attempting payment
    const QUICK_PAY_COST = 900; // $9 MXN in cents
    if (wallet && wallet.balance < QUICK_PAY_COST) {
      toast({
        variant: "destructive",
        title: "Insufficient funds",
        description: `You need $${QUICK_PAY_COST / 100} MXN but only have $${wallet.balance / 100} MXN. Add funds to continue.`,
        action: (
          <button
            onClick={() => router.push("/wallet")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
          >
            Add Funds
          </button>
        ),
      });
      return;
    }

    try {
      toast({
        title: "Processing payment...",
        description: "Deducting $9MXN from your wallet.",
      });

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
        toast({
          title: "¡Pago exitoso!",
          description: "Cupón agregado a Mis Cupones.",
        });
        try {
          void queryClient.invalidateQueries({ queryKey: ["coupons"] });
        } catch (_e) {
          // ignore
        }
        router.push("/my-coupons");
      } else {
        throw new Error("Quick Pay failed");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      // Check if error is due to insufficient funds
      if (message.toLowerCase().includes("insufficient funds")) {
        toast({
          variant: "destructive",
          title: "Insufficient funds",
          description:
            "You don't have enough balance. Add funds to your wallet.",
          action: (
            <button
              onClick={() => router.push("/wallet")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
            >
              Add Funds
            </button>
          ),
        });
      } else {
        toast({
          variant: "destructive",
          title: "Payment failed",
          description: message,
        });
      }
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
            description:
              "Restaurant details have been copied. Share them with friends!",
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
        description: "Please copy the restaurant details manually.",
      });
    }
  };

  if (isLoading) {
    return (
      <BasicLayout className="pb-20">
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
      ...(parsedStore.location.lat &&
        parsedStore.location.lng && {
          lat: +Number(parsedStore.location.lat).toFixed(6),
          lng: +Number(parsedStore.location.lng).toFixed(6),
        }),
      address: `${parsedStore.location.address}, ${parsedStore.location.city}`,
    });
  };

  return (
    <BasicLayout className="pb-20">
      {!parsedStore ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-muted-foreground text-lg mb-4">
              Restaurant not found
            </p>
            <Button onClick={() => router.push("/restaurants")}>
              Back to Restaurants
            </Button>
          </div>
        </div>
      ) : (
        <div className="pt-8 pb-16">
          <div className="mx-auto max-w-6xl px-4 pt-6">
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
                    <span className="font-medium">{parsedStore.category}</span>
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
                        {firstActiveDiscount ? (
                          <Button
                            onClick={handleUnlockDiscountClick}
                            className="w-full bg-white text-rose-600 hover:bg-white/95 font-bold rounded-full shadow-lg py-4"
                          >
                            {user?.isPremium
                              ? "Desbloquear descuento ahora"
                              : "Desbloquear descuento"}
                          </Button>
                        ) : (
                          <h6 className="text-center text-white bg-black/50 px-4 py-2 rounded-full">
                            Descuento no disponible en este momento
                          </h6>
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
                            Hours
                          </p>
                          <div className="space-y-2">
                            {parsedStore.hoursStructured.map((item, index) => (
                              <div
                                key={index}
                                className="flex justify-between text-sm"
                              >
                                <span className="font-medium text-foreground capitalize">
                                  {item.day}
                                </span>
                                <span className="text-muted-foreground">
                                  {item.hours}
                                </span>
                              </div>
                            ))}
                          </div>
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
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={handleGetDirections}
                      >
                        View on map 📍
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
                    {parsedStore.discount.restrictions.map(
                      (restriction, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 text-sm"
                        >
                          <span className="text-base mt-0.5">
                            {index ===
                            parsedStore.discount.restrictions.length - 1
                              ? "✅"
                              : "❌"}
                          </span>
                          <span className="text-muted-foreground">
                            {restriction}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </Card>

                {parsedStore.reviews.length > 0 ? (
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      ⭐ Reviews
                    </h2>
                    <div className="space-y-3 mb-4">
                      {parsedStore.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="p-4 bg-white border border-[#f1e9e6] rounded-xl shadow-sm"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-2xl">
                              {review.avatar}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-semibold text-foreground">
                                  {review.name}
                                </p>
                                <div className="flex items-center gap-1">
                                  {[...Array(review.rating)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {review.comment}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button variant="outline" className="w-full mb-2">
                      See all reviews
                    </Button>
                    <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white">
                      Write your review 🍽️{" "}
                      <span className="ml-2 text-xs">+50 pts 📸</span>
                    </Button>
                  </div>
                ) : null}
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
                    Get directions 📍
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

      {showVideoAd ? (
        <RewardedVideoAd
          onAdComplete={() => {
            void handleVideoComplete();
          }}
          onAdSkipped={handleVideoSkip}
        />
      ) : null}

      <CongratulationsModal
        isOpen={showCongratulations}
        onComplete={() => {
          void handleCongratulationsComplete();
        }}
      />

      <DiscountSuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        restaurantName={parsedStore?.name ?? ""}
        discountPercentage={parsedStore?.discount.percentage ?? 10}
        points={parsedStore?.discount.points ?? 0}
      />

      {/* Catalog Image Modal */}
      {selectedCatalogImage ? (
        <div
          className="fixed inset-0 z-50 bg-black/80 overflow-y-auto"
          onClick={() => setSelectedCatalogImage(null)}
        >
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="relative max-w-5xl w-full">
              <button
                onClick={() => setSelectedCatalogImage(null)}
                className="sticky top-4 left-full ml-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                aria-label="Close"
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
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <div className="relative w-full">
                <img
                  src={selectedCatalogImage}
                  alt="Catalog image"
                  className="w-full h-auto"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </BasicLayout>
  );
}
