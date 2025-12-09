// To integrate this into your Next.js app, replace the existing:
// src/app/service/[id]/page.tsx

"use client";

import {
  ArrowLeft,
  Heart,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  Star,
  MessageCircle,
  Share2,
  CircleAlert,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

import { BottomNavigation } from "@/app/explore/components/BottomNavigation";
import { ExploreHeader } from "@/app/explore/components/ExploreHeader";
import { SubscriptionPrompt } from "@/components/SubscriptionPrompt";
import { useGenerateCoupon } from "@/domains/coupon/hooks/useGenerateCoupon";
import { useToast } from "@/hooks/use-toast";
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
  const generateCoupon = useGenerateCoupon();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
  const [cooldownMinutes, setCooldownMinutes] = useState<number | undefined>(
    undefined
  );

  // Get restaurant ID from params (folder is `[detail]`)
  const restaurantId = (params?.detail ?? params?.id) as string;

  // Fetch restaurant data
  useEffect(() => {
    const fetchRestaurantData = async (): Promise<void> => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/restaurants/${restaurantId}`);
        // const data = await response.json();
        // setRestaurant(data);

        // For now, use mock data
        const data = mockRestaurants[restaurantId];
        if (!data) {
          router.push("/restaurant");
          return;
        }
        setRestaurant(data);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
        router.push("/restaurant");
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      void fetchRestaurantData();
    }
  }, [restaurantId, router]);

  const nextImage = (): void => {
    if (!restaurant) {
      return;
    }
    setCurrentImageIndex((prev) => (prev + 1) % restaurant.images.length);
  };

  const prevImage = (): void => {
    if (!restaurant) {
      return;
    }
    setCurrentImageIndex(
      (prev) => (prev - 1 + restaurant.images.length) % restaurant.images.length
    );
  };

  const handleUnlockDiscount = async (): Promise<void> => {
    if (!restaurant) {
      return;
    }

    try {
      // TODO: Replace with actual storeId and discountId from the restaurant data
      // For now, using mock data - in production, these should come from the API
      const coupon = await generateCoupon.mutateAsync({
        storeId: restaurant.id,
        discountId: "discount-1", // This should come from the restaurant data
      });

      toast({
        title: "Coupon Generated!",
        description: `Your ${restaurant.discount.percentage}% discount coupon is ready!`,
      });

      // Redirect to the generated coupon page
      router.push(`/redeem/detail?code=${coupon.code}`);
    } catch (error: unknown) {
      // Parse error message to extract cooldown time
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // Check if it's a cooldown error
      const cooldownMatch = errorMessage.match(/wait (\d+) minutes/i);

      if (cooldownMatch) {
        const minutes = parseInt(cooldownMatch[1] ?? "0", 10);
        setCooldownMinutes(minutes);
        setShowSubscriptionPrompt(true);
      } else {
        toast({
          title: "Error",
          description:
            errorMessage || "Failed to generate coupon. Please try again.",
          variant: "destructive",
        });
      }
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

  const handleShare = async (): Promise<void> => {
    if (!restaurant) {
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: restaurant.name,
          text: `Check out ${restaurant.name} on Ñamy!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Loading state
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

      <div className="pt-14 pb-16">
        <div className="min-h-screen bg-background">
          {/* Hero Image Carousel */}
          <div className="relative h-80 overflow-hidden">
            <Image
              src={restaurant.images[currentImageIndex] ?? ""}
              alt={restaurant.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

            {/* Back Button */}
            <Button
              onClick={() => router.back()}
              size="icon"
              className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-lg"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Button>

            {/* Favorite Button */}
            <Button
              onClick={() => setIsFavorite(!isFavorite)}
              size="icon"
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-lg"
            >
              <Heart
                className={`w-5 h-5 text-foreground transition-all ${
                  isFavorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>

            {/* Carousel Navigation */}
            <Button
              onClick={prevImage}
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <Button
              onClick={nextImage}
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>

            {/* Restaurant Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                {restaurant.name}
              </h1>
              <div className="flex items-center gap-3 text-white/90 text-sm">
                <span>
                  {restaurant.emoji} {restaurant.category}
                </span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{restaurant.rating}</span>
                  <span>({restaurant.reviewCount} reseñas)</span>
                </div>
              </div>
              {restaurant.isAdPartner ? (
                <div className="mt-2 inline-block bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                  ⭐ Ad Partner
                </div>
              ) : null}
            </div>

            {/* Carousel Indicators */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
              {restaurant.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 space-y-6 py-6">
            {/* Discount Card */}
            <Card className="p-6 bg-gradient-to-br from-primary to-accent border-0 shadow-glow">
              <div className="text-center text-white">
                <h2 className="text-2xl font-bold mb-2">
                  🎉 ¡{restaurant.discount.percentage}% de descuento con Ñamy!
                </h2>
                <p className="text-white/90 mb-1 text-sm">
                  Solo muestra tu código QR después de ver un anuncio
                </p>
                <p className="text-xs text-white/80 mb-4">
                  +{restaurant.discount.points} puntos Ñamy al usar este
                  descuento
                </p>
                <Button
                  onClick={() => void handleUnlockDiscount()}
                  className="w-full bg-white text-primary hover:bg-white/90 font-bold rounded-full shadow-lg"
                >
                  Ver anuncio y desbloquear descuento
                </Button>
              </div>
            </Card>

            {/* Business Info Card */}
            <Card className="p-5 space-y-4 bg-card border-border shadow-card">
              {/* Hours */}
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Horario</p>
                  <p className="text-sm text-muted-foreground">
                    {restaurant.hours}
                  </p>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Ubicación</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {restaurant.location.address}, {restaurant.location.city}
                  </p>
                  <Button variant="outline" size="sm" className="text-xs">
                    Ver en mapa 📍
                  </Button>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Teléfono</p>
                  <a
                    href={`tel:${restaurant.phone}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {restaurant.phone}
                  </a>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* WhatsApp Button */}
              <Button
                onClick={handleWhatsAppContact}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contactar por WhatsApp
              </Button>
            </Card>

            {/* Menu Gallery */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                📖 Menú
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {restaurant.menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative aspect-square rounded-2xl overflow-hidden shadow-card cursor-pointer hover:scale-105 transition-transform"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Discount Restrictions */}
            <Card className="p-5 bg-muted border-border">
              <h2 className="text-xl font-bold text-foreground mb-4">
                🕑 Restricciones del descuento
              </h2>
              <ul className="space-y-3">
                {restaurant.discount.restrictions.map((restriction, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <span className="text-base mt-0.5">
                      {index === restaurant.discount.restrictions.length - 1
                        ? "✅"
                        : "❌"}
                    </span>
                    <span className="text-muted-foreground">{restriction}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                ⭐ Opiniones
              </h2>
              <div className="space-y-3 mb-4">
                {restaurant.reviews.map((review) => (
                  <Card key={review.id} className="p-4 bg-card border-border">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{review.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-foreground">
                            {review.name}
                          </p>
                          <div className="flex">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-3 h-3 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Button variant="outline" className="w-full mb-2">
                Ver todas las reseñas
              </Button>

              <Button className="w-full bg-primary hover:bg-primary/90">
                Escribe tu reseña 🍽️{" "}
                <span className="ml-2 text-xs">+50 pts 📸</span>
              </Button>
            </div>

            {/* Location Map */}
            <Card className="p-5 bg-card border-border">
              <h2 className="text-xl font-bold text-foreground mb-3">
                📍 Ubicación
              </h2>
              <div className="aspect-video bg-muted rounded-xl mb-3 flex items-center justify-center">
                <span className="text-4xl">🗺️</span>
              </div>
              <Button className="w-full bg-services hover:bg-services/90">
                Cómo llegar 📍
              </Button>

              {/* Amenities */}
              <div className="mt-3 flex flex-wrap gap-2">
                {restaurant.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => void handleShare()}
                variant="outline"
                className="flex-1"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
              <Button variant="ghost" className="text-muted-foreground">
                <CircleAlert className="w-4 h-4 mr-1" />
                Reportar
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center py-6">
              <Image
                src="/namy-logo.webp"
                alt="Ñamy"
                width={32}
                height={32}
                className="h-8 mx-auto mb-2 opacity-50"
              />
              <p className="text-xs text-muted-foreground">
                Ñamy — Come inteligente, ahorra más 💚
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />

      {/* Subscription Prompt Modal */}
      <SubscriptionPrompt
        isOpen={showSubscriptionPrompt}
        onClose={() => setShowSubscriptionPrompt(false)}
        trigger="coupon_generation"
        waitTimeMinutes={cooldownMinutes}
      />
    </div>
  );
}
