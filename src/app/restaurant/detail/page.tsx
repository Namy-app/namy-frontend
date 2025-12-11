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
import { useState, useEffect } from "react";

import { BottomNavigation } from "@/app/explore/components/BottomNavigation";
import { ExploreHeader } from "@/app/explore/components/ExploreHeader";
import { useToast } from "@/hooks/use-toast";
import { graphqlRequest } from "@/lib/graphql-client";
import { GENERATE_COUPON_MUTATION, QUICK_PAY_FOR_DISCOUNT_MUTATION } from "@/lib/graphql-queries";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { useAuthStore } from "@/store/useAuthStore";
import { RewardedVideoAd } from "@/components/RewardedVideoAd";

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

// Mock data - replace with API call
const mockRestaurants: Record<string, Restaurant> = {
  "1": {
    id: "1",
    name: "Tacos El Güero",
    category: "Tacos",
    emoji: "🌮",
    rating: 4.6,
    reviewCount: 320,
    isAdPartner: true,
    discount: {
      id: "8c78fab4-4224-470f-b771-b21c638a2c35",
      percentage: 15,
      points: 100,
      restrictions: [
        "No válido viernes y sábado después de las 8:00 PM",
        "No aplica con otras promociones",
        "Muestra tu código QR antes de pagar",
      ],
    },
    hours: "Lunes–Domingo: 11:00 AM – 11:00 PM",
    location: {
      address: "Av. Insurgentes Sur 1234, Del Valle",
      city: "CDMX",
    },
    phone: "+52 55 1234 5678",
    images: [
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599974481812-0e8e87fa375b?w=400&auto=format&fit=crop",
    ],
    menuItems: [
      {
        id: "1",
        name: "Tacos al Pastor",
        image:
          "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format&fit=crop",
      },
      {
        id: "2",
        name: "Tacos de Carnitas",
        image:
          "https://images.unsplash.com/photo-1599974481812-0e8e87fa375b?w=400&auto=format&fit=crop",
      },
      {
        id: "3",
        name: "Tacos de Barbacoa",
        image:
          "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=400&auto=format&fit=crop",
      },
      {
        id: "4",
        name: "Quesadillas",
        image:
          "https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=400&auto=format&fit=crop",
      },
    ],
    reviews: [
      {
        id: "1",
        name: "María G.",
        avatar: "🧑‍🦱",
        rating: 5,
        comment: "¡Increíble comida y excelente servicio!",
      },
      {
        id: "2",
        name: "Carlos R.",
        avatar: "👨",
        rating: 4,
        comment: "Muy buen lugar, precios justos.",
      },
      {
        id: "3",
        name: "Ana L.",
        avatar: "👩",
        rating: 5,
        comment: "Los mejores tacos de la ciudad.",
      },
    ],
    amenities: ["🅿️ Estacionamiento disponible", "📶 WiFi gratis"],
  },
};

export default function RestaurantDetailPage(): React.JSX.Element {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const [currentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVideoAd, setShowVideoAd] = useState(false);
  const [adsWatched, setAdsWatched] = useState(0);
  const [totalAdsRequired] = useState(2);

  // Get restaurant ID from params
  const restaurantId = (params?.id as string) || "1";

  // Fetch restaurant data
  useEffect(() => {
    const fetchRestaurantData = (): void => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        const data = mockRestaurants[restaurantId];
        if (!data) {
          setRestaurant(mockRestaurants["1"]!);
          console.warn(`Restaurant ${restaurantId} not found, using fallback`);
        } else {
          setRestaurant(data);
        }
      } catch (error) {
        console.error("Error fetching restaurant:", error);
        setRestaurant(mockRestaurants["1"]!);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchRestaurantData();
    }, 100);

    return () => clearTimeout(timer);
  }, [restaurantId]);

  // image navigation intentionally removed until carousel controls are needed

  const handleWatchAdClick = (): void => {
    if (!isAuthenticated) {
      toast({
        variant: "default",
        title: "Sign in required",
        description: "Please sign in to unlock discounts.",
      });
      router.push("/");
      return;
    }
    setShowVideoAd(true);
  };

  const handleAdComplete = (): void => {
    const newAdsWatched = adsWatched + 1;
    setAdsWatched(newAdsWatched);

    if (newAdsWatched >= totalAdsRequired) {
      // Both ads watched, proceed to unlock discount
      setShowVideoAd(false);
      void handleUnlockDiscount();
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

  const handleAdSkipped = (): void => {
    toast({
      variant: "default",
      title: "Ad skipped",
      description: "Please watch the full video to unlock your coupon.",
    });
    setShowVideoAd(false);
  };

  const handleAdError = (error: Error): void => {
    console.error("Ad error:", error);
    toast({
      variant: "destructive",
      title: "Ad loading failed",
      description: "Please try again.",
    });
    setShowVideoAd(false);
  };

  const handleUnlockDiscount = async (): Promise<void> => {
    if (!restaurant) {
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

    const discountId = restaurant.discount?.id ?? restaurant.id;

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
    if (!restaurant) {
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

    const discountId = restaurant.discount?.id ?? restaurant.id;

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
          title: "✅ Coupon purchased!",
          description: "Discount unlocked with Quick Pay. Added to My Coupons.",
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
        title: "Quick Pay failed",
        description:
          message.includes("Insufficient")
            ? "Not enough balance in your wallet. Please top up first."
            : message,
      });
    }
  };

  const handleWhatsAppContact = (): void => {
    if (!restaurant) {
      return;
    }
    window.open(
      `https://wa.me/${restaurant.phone.replace(/\D/g, "")}`,
      "_blank"
    );
  };

  // sharing removed (not used) to satisfy lint rules

  if (loading || !restaurant) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <ExploreHeader isAuthenticated={isAuthenticated} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">
              Loading restaurant details...
            </p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <ExploreHeader isAuthenticated={isAuthenticated} />

      <div className="pt-8 pb-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="relative h-96 md:h-[520px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={restaurant.images[currentImageIndex] ?? ""}
              alt={restaurant.name}
              fill
              className="object-cover transform-gpu scale-105 transition-transform duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

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
                {restaurant.name}
              </h1>
              <div className="mt-2 flex items-center gap-4 text-sm md:text-base text-white/90">
                <div className="inline-flex items-center gap-2">
                  <span>{restaurant.emoji}</span>
                  <span className="font-medium">{restaurant.category}</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{restaurant.rating}</span>
                  <span className="text-sm">
                    ({restaurant.reviewCount} reviews)
                  </span>
                </div>
              </div>
              {restaurant.isAdPartner ? (
                <div className="mt-3 inline-block bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                  ⭐ Ad Partner
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-3xl overflow-hidden shadow-glow">
                <div className="p-6 md:p-8 bg-gradient-to-br from-rose-300 via-amber-300 to-lime-200 rounded-3xl">
                  <div className="max-w-5xl mx-auto text-center text-white">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                      🎉 {restaurant.discount.percentage}% discount with Ñamy!
                    </h2>
                    <p className="text-white/90 mb-1 text-sm">
                      Show your QR code after watching an ad
                    </p>
                    <p className="text-xs text-white/80 mb-4">
                      +{restaurant.discount.points} Ñamy points when using this
                      discount
                    </p>
                    <div className="mt-4 space-y-3">
                      <Button
                        onClick={handleWatchAdClick}
                        className="w-full bg-white text-rose-600 hover:bg-white/95 font-bold rounded-full shadow-lg py-4"
                      >
                        {adsWatched > 0 && adsWatched < totalAdsRequired
                          ? `Watch ad ${adsWatched + 1} of ${totalAdsRequired} and unlock discount`
                          : "Watch ad and unlock discount"}
                      </Button>
                      <Button
                        onClick={() => void handleQuickPay()}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 font-bold rounded-full shadow-lg py-4"
                      >
                        💰 Quick Pay $9MXN
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="p-6 space-y-4 bg-white border border-[#f1e9e6] rounded-xl shadow-md">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Hours</p>
                    <p className="text-sm text-muted-foreground">
                      {restaurant.hours}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Location</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {restaurant.location.address}, {restaurant.location.city}
                    </p>
                    <Button variant="outline" size="sm" className="text-xs">
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
                      href={`tel:${restaurant.phone}`}
                      className="text-sm text-rose-600 hover:underline"
                    >
                      {restaurant.phone}
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

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  📖 Menu
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {restaurant.menuItems.map((item, idx) => (
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

              <Card className="p-5 bg-white border border-[#f1e9e6] rounded-xl">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  🕑 Discount Restrictions
                </h2>
                <ul className="space-y-3">
                  {restaurant.discount.restrictions.map(
                    (restriction, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm"
                      >
                        <span className="text-base mt-0.5">
                          {index === restaurant.discount.restrictions.length - 1
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

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  ⭐ Reviews
                </h2>
                <div className="space-y-3 mb-4">
                  {restaurant.reviews.map((review) => (
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
            </div>

            <aside className="space-y-6">
              <Card className="p-5 bg-white border border-[#f1e9e6] rounded-xl shadow-md">
                <h3 className="font-semibold mb-3">📍 Location</h3>
                <div className="aspect-video bg-[#fbf7f6] rounded-xl mb-3 flex items-center justify-center">
                  <span className="text-4xl">🗺️</span>
                </div>
                <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white">
                  Get directions 📍
                </Button>

                <div className="mt-4 flex flex-wrap gap-2">
                  {restaurant.amenities.map((amenity, index) => (
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
                  href={`tel:${restaurant.phone}`}
                  className="block text-rose-600 font-medium mb-3"
                >
                  {restaurant.phone}
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

      <BottomNavigation />

      {/* Video Ad Modal */}
      {showVideoAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl mx-4">
            <RewardedVideoAd
              onAdComplete={handleAdComplete}
              onAdSkipped={handleAdSkipped}
              onAdError={handleAdError}
            />
          </div>
        </div>
      )}
    </div>
  );
}
