"use client";

import Image from "next/image";

import { Card } from "@/shared/components/Card";

const nearbyPlaces = [
  {
    id: "1",
    name: "Sushi House",
    image:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&auto=format&fit=crop",
    distance: "0.8 km",
    discount: "-10% con Ñamy",
  },
  {
    id: "2",
    name: "Barbería Clásica",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&auto=format&fit=crop",
    distance: "1.2 km",
    discount: "-15% con Ñamy",
  },
  {
    id: "3",
    name: "Café Aroma",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&auto=format&fit=crop",
    distance: "0.5 km",
    discount: "-20% con Ñamy",
  },
];

export function NearbyPlaces(): React.JSX.Element {
  return (
    <div className="mb-8">
      <div className="px-6">
        <h2 className="text-xl font-bold mb-4 text-foreground">
          📍 Cerca de ti
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {nearbyPlaces.map((place) => (
            <Card
              key={place.id}
              className="flex items-center gap-4 p-3 cursor-pointer hover:shadow-glow transition-all border-0 shadow-md group"
            >
              <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={place.image}
                  alt={place.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground mb-1">{place.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                    className="w-4 h-4"
                  >
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>A {place.distance}</span>
                  <span className="text-primary font-semibold">
                    • {place.discount}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
