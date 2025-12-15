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
} from "lucide-react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

import { CongratulationsModal } from "@/components/CongratulationsModal";
import { DiscountSuccessModal } from "@/components/DiscountSuccessModal";
import { RewardedVideoAd } from "@/components/RewardedVideoAd";
import { UnlockDiscountModal } from "@/components/UnlockDiscountModal";
import { PlaceHolderTypeEnum } from "@/data/constants";
import { StoreType } from "@/domains/admin";
import { useStoreDiscounts } from "@/domains/admin/hooks";
import { useWallet } from "@/domains/payment/hooks";
import { useStore } from "@/domains/store/hooks";
import { useMyLevel } from "@/domains/user/hooks/query/useMyLevel";
import { useToast } from "@/hooks/use-toast";
import { BasicLayout } from "@/layouts/BasicLayout";
import { graphqlRequest } from "@/lib/graphql-client";
import {
  GENERATE_COUPON_MUTATION,
  QUICK_PAY_FOR_DISCOUNT_MUTATION,
} from "@/lib/graphql-queries";
import { openInGoogleMaps } from "@/lib/maps";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { useAuthStore } from "@/store/useAuthStore";

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

  const [currentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showVideoAd, setShowVideoAd] = useState(false);
  const [adsWatched, setAdsWatched] = useState(0);
  const [totalAdsRequired] = useState(2);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: userLevel } = useMyLevel();
  const { data: walletData } = useWallet({ userId: user?.id });
  const balance = walletData?.balance ?? 0;
  // Get restaurant ID from params
  const storeId = (params?.detail as string) || null;
  const { data: store, isLoading } = useStore(storeId);

  // Fetch discounts for this store
  const { data: discountsData } = useStoreDiscounts(
    { storeId: storeId },
    { page: 1, first: 10 }
  );

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
          points: 100,
          restrictions: [
            "Show your QR code before paying",
            "Valid for dine-in only",
            "Cannot be combined with other offers",
          ],
        },
        hours: "Mon–Sun: 11:00 AM – 11:00 PM",
        location: {
          address: store.address || "Address not available",
          city: store.city || "City not available",
          lat: store.lat,
          lng: store.lng,
        },
        phone: store.phoneNumber || "--",
        images: store.imageUrl
          ? [store.imageUrl]
          : [
              store.categoryId?.toLowerCase() === "restaurant"
                ? PlaceHolderTypeEnum.RESTAURANT
                : PlaceHolderTypeEnum.SHOP,
            ],
        menuItems: [],
        reviews: [],
        amenities: ["🅿️ Parking available", "📶 Free WiFi"],
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

  const handleVideoComplete = (): void => {
    const newAdsWatched = adsWatched + 1;
    setAdsWatched(newAdsWatched);

    if (newAdsWatched >= totalAdsRequired) {
      // Both ads watched, show congratulations then success
      setShowVideoAd(false);
      setShowCongratulations(true);
    } else {
      // Show message and prepare for next ad
      toast({
        title: `Ad ${newAdsWatched} of ${totalAdsRequired} complete`,
        description: `Watch ${totalAdsRequired - newAdsWatched} more ad to unlock your discount.`,
      });
      // Keep showing video ad for the next round
      setShowVideoAd(false);
      // Automatically show next ad after a short delay
      setTimeout(() => {
        setShowVideoAd(true);
      }, 1500);
    }
  };

  const handleCongratulationsComplete = (): void => {
    setShowCongratulations(false);
    setShowSuccess(true);
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
          title: "Coupon created",
          description: "Coupon added to My Coupons.",
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

    if (balance < 900) {
      toast({
        variant: "default",
        title: "Insufficient balance",
        description: "You need at least $9MXN in your wallet to use Quick Pay.",
      });
      return;
    }

    const discountId = parsedStore.discount?.id ?? parsedStore.id;

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
        discountId,
      });

      if (data?.quickPayForDiscount) {
        toast({
          title: "Payment successful!",
          description: "Coupon added to My Coupons.",
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
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: message,
      });
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
            <Button onClick={() => router.push("/restaurant")}>
              Back to Restaurants
            </Button>
          </div>
        </div>
      ) : (
        <div className="pt-8 pb-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="relative h-96 md:h-[520px] rounded-2xl overflow-hidden shadow-2xl">
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
                        <Button
                          onClick={handleUnlockDiscountClick}
                          className="w-full bg-white text-rose-600 hover:bg-white/95 font-bold rounded-full shadow-lg py-4"
                        >
                          {user?.isPremium
                            ? "Desbloquear descuento ahora"
                            : "Desbloquear descuento"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="p-6 space-y-4 bg-white border border-[#f1e9e6] rounded-xl shadow-md">
                  {parsedStore.hours ? (
                    <>
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">Hours</p>
                          <p className="text-sm text-muted-foreground">
                            {parsedStore.hours}
                          </p>
                        </div>
                      </div>

                      <div className="h-px bg-border" />
                    </>
                  ) : null}

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
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

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-rose-500 flex-shrink-0" />
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
                </Card>

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
                  <h3 className="font-semibold mb-2">Contact</h3>
                  <a
                    href={`tel:${parsedStore.phone}`}
                    className="block text-rose-600 font-medium mb-3"
                  >
                    {parsedStore.phone}
                  </a>
                  <Button
                    onClick={handleWhatsAppContact}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    Contact via WhatsApp
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
          onAdComplete={handleVideoComplete}
          onAdSkipped={handleVideoSkip}
        />
      ) : null}

      <CongratulationsModal
        isOpen={showCongratulations}
        onComplete={handleCongratulationsComplete}
      />

      <DiscountSuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        restaurantName={parsedStore?.name ?? ""}
        discountPercentage={parsedStore?.discount.percentage ?? 10}
        points={parsedStore?.discount.points ?? 0}
      />
    </BasicLayout>
  );
}
