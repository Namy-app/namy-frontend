// To integrate this into your Next.js app, create a new route at:
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
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { BasicLayout } from "@/layouts/BasicLayout";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";

// Service type definition
interface Service {
  id: string;
  name: string;
  category: string;
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
  services: Array<{ id: string; name: string; image: string }>;
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
const mockServices: Record<string, Service> = {
  "1": {
    id: "1",
    name: "Zen Spa & Wellness",
    category: "💆‍♀️ Spa",
    rating: 4.8,
    reviewCount: 245,
    isAdPartner: true,
    discount: {
      percentage: 25,
      points: 150,
      restrictions: [
        "No válido los fines de semana",
        "Reserva con 24 horas de anticipación",
        "Muestra tu código QR al llegar",
      ],
    },
    hours: "Lunes–Domingo: 9:00 AM – 9:00 PM",
    location: {
      address: "Av. Kukulcán Km 12.5, Zona Hotelera",
      city: "Cancún",
    },
    phone: "+52 998 123 4567",
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&auto=format&fit=crop",
    ],
    services: [
      {
        id: "1",
        name: "Masajes",
        image:
          "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&auto=format&fit=crop",
      },
      {
        id: "2",
        name: "Faciales",
        image:
          "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=400&auto=format&fit=crop",
      },
      {
        id: "3",
        name: "Aromaterapia",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format&fit=crop",
      },
      {
        id: "4",
        name: "Pedicure",
        image:
          "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&auto=format&fit=crop",
      },
    ],
    reviews: [
      {
        id: "1",
        name: "Laura M.",
        avatar: "👩‍🦰",
        rating: 5,
        comment: "¡Experiencia increíble! Muy relajante.",
      },
      {
        id: "2",
        name: "Pedro S.",
        avatar: "👨‍🦱",
        rating: 5,
        comment: "El mejor spa de la ciudad, sin duda.",
      },
      {
        id: "3",
        name: "Sofia R.",
        avatar: "🧑",
        rating: 4,
        comment: "Excelente servicio y ambiente.",
      },
    ],
    amenities: ["🅿️ Parking available", "📶 WiFi gratis", "🧖‍♀️ Sauna incluido"],
  },
};

export default function ServiceContainer({
  serviceId = "",
}: {
  serviceId?: string;
}): React.JSX.Element {
  const router = useRouter();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [serviceData, setServiceData] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch service data
  useEffect(() => {
    const fetchServiceData = async (): Promise<void> => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/services/${serviceId}`);
        // const data = await response.json();
        // setServiceData(data);

        // For now, use mock data. Support lookup by id or by human-friendly slug.
        let data = mockServices[serviceId];

        // If not found by key, try to match by slugified name (e.g. 'cafe-central')
        if (!data) {
          const normalize = (str: string): string =>
            str
              .toLowerCase()
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "");

          data = Object.values(mockServices).find(
            (s) =>
              normalize(s.name) === serviceId ||
              normalize(s.name) === normalize(serviceId)
          );
        }

        if (!data) {
          router.push("/explore");
          return;
        }
        setServiceData(data);
      } catch (error) {
        console.error("Error fetching service:", error);
        router.push("/explore");
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      void fetchServiceData();
    }
  }, [serviceId, router]);

  const nextImage = (): void => {
    if (!serviceData) {
      return;
    }
    setCurrentImageIndex((prev) => (prev + 1) % serviceData.images.length);
  };

  const prevImage = (): void => {
    if (!serviceData) {
      return;
    }
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + serviceData.images.length) % serviceData.images.length
    );
  };

  const handleUnlockDiscount = (): void => {
    // TODO: Implement ad viewing and discount unlock logic
    alert("Unlocking discount... (implement ad viewing)");
  };

  const handleWhatsAppContact = (): void => {
    if (!serviceData) {
      return;
    }
    window.open(
      `https://wa.me/${serviceData.phone.replace(/\D/g, "")}`,
      "_blank"
    );
  };

  const handleShare = async (): Promise<void> => {
    if (!serviceData) {
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: serviceData.name,
          text: `Check out ${serviceData.name} on Ñamy!`,
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
  if (loading || !serviceData) {
    return (
      <BasicLayout className="pb-20">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading service details...</p>
          </div>
        </div>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout className="pb-20">
      {/* Hero Image Carousel */}
      <div className="relative h-80 overflow-hidden">
        <Image
          src={serviceData.images[currentImageIndex] ?? ""}
          alt={serviceData.name}
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

        {/* Service Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
            {serviceData.name}
          </h1>
          <div className="flex items-center gap-3 text-white/90 text-sm">
            <span>{serviceData.category}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{serviceData.rating}</span>
              <span>({serviceData.reviewCount} reviews)</span>
            </div>
          </div>
          {serviceData.isAdPartner ? (
            <div className="mt-2 inline-block bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
              ⭐ Ad Partner
            </div>
          ) : null}
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
          {serviceData.images.map((_, index) => (
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
              🎉 {serviceData.discount.percentage}% OFF with Ñamy!
            </h2>
            <p className="text-white/90 mb-1 text-sm">
              Solo muestra tu código QR después de ver un anuncio
            </p>
            <p className="text-xs text-white/80 mb-4">
              +{serviceData.discount.points} Ñamy points when you use this
              discount
            </p>
            <Button
              onClick={handleUnlockDiscount}
              className="w-full bg-white text-primary hover:bg-white/90 font-bold rounded-full shadow-lg"
            >
              Watch ad to unlock discount
            </Button>
          </div>
        </Card>

        {/* Business Info Card */}
        <Card className="p-5 space-y-4 bg-card border-border shadow-card">
          {/* Hours */}
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-services mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-foreground">Hours</p>
              <p className="text-sm text-muted-foreground">
                {serviceData.hours}
              </p>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Location */}
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-services mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-foreground">Location</p>
              <p className="text-sm text-muted-foreground mb-2">
                {serviceData.location.address}, {serviceData.location.city}
              </p>
              <Button variant="outline" size="sm" className="text-xs">
                View on map 📍
              </Button>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Phone */}
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-services flex-shrink-0" />
            <div>
              <p className="font-semibold text-foreground">Teléfono</p>
              <a
                href={`tel:${serviceData.phone}`}
                className="text-sm text-services hover:underline"
              >
                {serviceData.phone}
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

        {/* Services Gallery */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            📖 Servicios
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {serviceData.services.map((service) => (
              <div
                key={service.id}
                className="relative aspect-square rounded-2xl overflow-hidden shadow-card cursor-pointer hover:scale-105 transition-transform"
              >
                <Image
                  src={service.image}
                  alt={service.name}
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
            🕑 Discount restrictions
          </h2>
          <ul className="space-y-3">
            {serviceData.discount.restrictions.map((restriction, index) => (
              <li key={index} className="flex items-start gap-3 text-sm">
                <span className="text-base mt-0.5">
                  {index === serviceData.discount.restrictions.length - 1
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
            {serviceData.reviews.map((review) => (
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
            View all reviews
          </Button>

          <Button className="w-full bg-services hover:bg-services/90">
            Write your review 🍽️{" "}
            <span className="ml-2 text-xs">+50 pts 📸</span>
          </Button>
        </div>

        {/* Location Map */}
        <Card className="p-5 bg-card border-border">
          <h2 className="text-xl font-bold text-foreground mb-3">
            📍 Location
          </h2>
          <div className="aspect-video bg-muted rounded-xl mb-3 flex items-center justify-center">
            <span className="text-4xl">🗺️</span>
          </div>
          <Button className="w-full bg-services hover:bg-services/90">
            Cómo llegar 📍
          </Button>

          {/* Amenities */}
          <div className="mt-3 flex flex-wrap gap-2">
            {serviceData.amenities.map((amenity, index) => (
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
            className="h-8 mx-auto mb-2 opacity-50 rounded-lg"
          />
          <p className="text-xs text-muted-foreground">
            Ñamy — Come inteligente, ahorra más 💚
          </p>
        </div>
      </div>
    </BasicLayout>
  );
}
