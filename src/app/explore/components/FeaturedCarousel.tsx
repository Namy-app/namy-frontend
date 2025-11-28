"use client";

import Image from "next/image";
import { useState } from "react";

import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";

const featuredItems = [
  {
    id: "1",
    name: "Pizza Leo",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop",
    discount: "15% de descuento hoy",
  },
  {
    id: "2",
    name: "FitZone Gym",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop",
    discount: "Membresía con 10% off",
  },
  {
    id: "3",
    name: "Spa Relaxa",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop",
    discount: "20% en masajes",
  },
  {
    id: "4",
    name: "Burger King",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop",
    discount: "2x1 en combos",
  },
];

export function FeaturedCarousel(): React.JSX.Element {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = (): void => {
    setCurrentSlide((prev) => (prev + 1) % featuredItems.length);
  };

  const prevSlide = (): void => {
    setCurrentSlide(
      (prev) => (prev - 1 + featuredItems.length) % featuredItems.length
    );
  };

  return (
    <div className="mb-8">
      <div className="px-6">
        <h2 className="text-xl font-bold mb-4 text-foreground">
          🌟 Destacados
        </h2>
        <div className="relative">
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {featuredItems.map((item) => (
                <div key={item.id} className="min-w-full px-2">
                  <Card className="relative h-40 overflow-hidden cursor-pointer group border-0 shadow-lg">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                      <p className="text-sm text-white/90">{item.discount}</p>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="absolute h-8 w-8 rounded-full top-1/2 -translate-y-1/2 left-2"
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
              className="h-4 w-4"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            disabled={currentSlide === featuredItems.length - 1}
            className="absolute h-8 w-8 rounded-full top-1/2 -translate-y-1/2 right-2"
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
              className="h-4 w-4"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
